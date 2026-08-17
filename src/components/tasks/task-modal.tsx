"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { TYT_SUBJECTS, TOPICS_BY_SUBJECT } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import {
  useCreateTask,
  useUpdateTask,
  useTasksByRange,
  useTodayTasks,
  useUpcomingTasks,
} from "@/modules/study-tasks/hooks/useStudyTasks";
import { mapUiTaskFormToCreateRequest } from "@/modules/study-tasks/mappers/study-task.mapper";
import { useTeacherStudents } from "@/modules/teacher/hooks/useTeacher";
import { format, startOfMonth, endOfMonth } from "date-fns";

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTaskId: string | null;
  selectedStudentId: string;
}

export function TaskModal({
  open,
  onOpenChange,
  editingTaskId,
  selectedStudentId,
}: TaskModalProps) {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher" || user?.role === "admin";

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [studentId, setStudentId] = useState(selectedStudentId);

  // Teacher/admin ise ogrenci listesini hook'tan al; student ise sadece kendisi.
  const { data: teacherStudents } = useTeacherStudents(
    isTeacher ? user?.id : undefined
  );

  const students = isTeacher
    ? (teacherStudents ?? []).map((s) => ({
        id: s.id,
        name: s.name,
      }))
    : user
      ? [{ id: user.id, name: user.name }]
      : [];

  // Editing task verisini cek: bu ayin range'inden bugun+upcoming'ten dene
  const now = new Date();
  const monthStart = format(startOfMonth(now), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(now), "yyyy-MM-dd");
  const { data: monthTasks } = useTasksByRange(
    editingTaskId ? studentId : "__disabled__",
    monthStart,
    monthEnd
  );
  const { data: todayTasks } = useTodayTasks(
    editingTaskId ? studentId : "__disabled__"
  );
  const { data: upcomingTasks } = useUpcomingTasks(
    editingTaskId ? studentId : "__disabled__"
  );

  const allCandidateTasks = [
    ...(monthTasks ?? []),
    ...(todayTasks ?? []),
    ...(upcomingTasks ?? []),
  ];
  const editingTask = editingTaskId
    ? allCandidateTasks.find((t) => t.id === editingTaskId)
    : null;

  const createTask = useCreateTask();
  const updateTask = useUpdateTask(studentId);

  useEffect(() => {
    if (editingTask) {
      setDate(editingTask.dueDate);
      setSubject(editingTask.subject);
      setTopic(editingTask.topic);
      setQuestionCount(editingTask.questionCount.toString());
      setStudentId(editingTask.studentId);
    } else {
      resetForm();
      setStudentId(selectedStudentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingTaskId, open]);

  const resetForm = () => {
    setDate(new Date().toISOString().split("T")[0]);
    setSubject("");
    setTopic("");
    setQuestionCount("");
  };

  const availableTopics = subject ? TOPICS_BY_SUBJECT[subject] || [] : [];

  const handleSubmit = async () => {
    if (!date || !subject || !topic || !questionCount) {
      toast.error("Lutfen tum alanlari doldurun");
      return;
    }

    const targetStudentId = studentId || selectedStudentId;

    if (editingTask) {
      updateTask.mutate(
        {
          taskId: editingTask.id,
          studentId: targetStudentId,
          dueDate: date,
          // UpdateTaskRequest optional alanlar; backend title/timings'i kendisi turetebilir
          // ama guvenli olmak icin subject/topic'i de gonderelim.
          lessonTitle: subject,
          topicTitle: topic,
          targetQuestions: parseInt(questionCount),
        },
        {
          onSuccess: () => {
            toast.success("Görev guncellendi");
            onOpenChange(false);
            resetForm();
          },
          onError: (err: unknown) => {
            const msg = err instanceof Error ? err.message : "Gorev guncellenemedi";
            toast.error(msg);
          },
        }
      );
    } else {
      const req = mapUiTaskFormToCreateRequest({
        studentId: targetStudentId,
        subject,
        topic,
        questionCount: parseInt(questionCount),
        dueDate: date,
      });
      createTask.mutate(req, {
        onSuccess: () => {
          toast.success("Görev eklendi");
          onOpenChange(false);
          resetForm();
        },
        onError: (err: unknown) => {
          const msg = err instanceof Error ? err.message : "Gorev eklenemedi";
          toast.error(msg);
        },
      });
    }
  };

  const isPending = createTask.isPending || updateTask.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingTask ? "Görev Düzenle" : "Yeni Görev"}</DialogTitle>
          <DialogDescription>
            {editingTask
              ? "Görev bilgilerini güncelleyin."
              : "Öğrenci için yeni bir çalışma görevi oluşturun."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isTeacher && (
            <div>
              <Label htmlFor="student">Öğrenci</Label>
              <Select value={studentId} onValueChange={setStudentId}>
                <SelectTrigger id="student">
                  <SelectValue placeholder="Öğrenci seç" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="date">Tarih</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="subject">Ders</Label>
            <Select
              value={subject}
              onValueChange={(v) => {
                setSubject(v);
                setTopic("");
              }}
            >
              <SelectTrigger id="subject">
                <SelectValue placeholder="Ders seç" />
              </SelectTrigger>
              <SelectContent>
                {TYT_SUBJECTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="topic">Konu</Label>
            <Select
              value={topic}
              onValueChange={setTopic}
              disabled={!subject}
            >
              <SelectTrigger id="topic">
                <SelectValue placeholder={subject ? "Konu seç" : "Önce ders seçin"} />
              </SelectTrigger>
              <SelectContent>
                {availableTopics.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="questionCount">Soru Sayısı</Label>
            <Input
              id="questionCount"
              type="number"
              min="1"
              placeholder="Ornegin: 50"
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Iptal
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending
              ? "Kaydediliyor..."
              : editingTask
                ? "Guncelle"
                : "Ekle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
