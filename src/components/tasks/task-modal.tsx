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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
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
import { useLessons, useUnits, useTopics } from "@/modules/lessons/hooks/useLessons";
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
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [studentId, setStudentId] = useState(selectedStudentId);

  const { data: lessons, isLoading: lessonsLoading } = useLessons();
  const { data: units, isLoading: unitsLoading } = useUnits(selectedLessonId);
  const { data: topics, isLoading: topicsLoading } = useTopics(selectedUnitId);

  const selectedLesson = lessons?.find((l) => l.id === selectedLessonId);
  const selectedUnit = units?.find((u) => u.id === selectedUnitId);
  const selectedTopic = topics?.find((t) => t.id === selectedTopicId);

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
    setSelectedLessonId("");
    setSelectedUnitId("");
    setSelectedTopicId("");
    setQuestionCount("");
  };

  const handleLessonChange = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setSelectedUnitId("");
    setSelectedTopicId("");
  };

  const handleUnitChange = (unitId: string) => {
    setSelectedUnitId(unitId);
    setSelectedTopicId("");
  };

  const handleSubmit = async () => {
    if (!date || !selectedLessonId || !selectedTopicId || !questionCount) {
      toast.error("Lutfen tum alanlari doldurun");
      return;
    }

    const targetStudentId = studentId || selectedStudentId;
    const subject = selectedLesson?.name ?? "";
    const topic = selectedTopic?.name ?? "";

    if (editingTask) {
      updateTask.mutate(
        {
          taskId: editingTask.id,
          studentId: targetStudentId,
          dueDate: date,
          lessonId: selectedLessonId,
          unitId: selectedUnitId || undefined,
          topicId: selectedTopicId,
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
        lessonId: selectedLessonId,
        unitId: selectedUnitId || undefined,
        topicId: selectedTopicId,
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
            <Label htmlFor="lesson">Ders</Label>
            {lessonsLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <Select
                value={selectedLessonId}
                onValueChange={handleLessonChange}
              >
                <SelectTrigger id="lesson">
                  <SelectValue placeholder="Ders seç" />
                </SelectTrigger>
                <SelectContent>
                  {(lessons ?? []).map((lesson) => (
                    <SelectItem key={lesson.id} value={lesson.id}>
                      {lesson.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div>
            <Label htmlFor="unit">Ünite</Label>
            {unitsLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <Select
                value={selectedUnitId}
                onValueChange={handleUnitChange}
                disabled={!selectedLessonId}
              >
                <SelectTrigger id="unit">
                  <SelectValue placeholder={selectedLessonId ? "Ünite seç" : "Önce ders seçin"} />
                </SelectTrigger>
                <SelectContent>
                  {(units ?? []).map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div>
            <Label htmlFor="topic">Konu</Label>
            {topicsLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <Select
                value={selectedTopicId}
                onValueChange={setSelectedTopicId}
                disabled={!selectedUnitId}
              >
                <SelectTrigger id="topic">
                  <SelectValue placeholder={selectedUnitId ? "Konu seç" : "Önce ünite seçin"} />
                </SelectTrigger>
                <SelectContent>
                  {(topics ?? []).map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {topic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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
