"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/lib/context";
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
import type { Task } from "@/lib/types";
import { TYT_SUBJECTS, TOPICS_BY_SUBJECT } from "@/lib/types";

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
  const { tasks, addTask, updateTask, currentUser, students } = useApp();
  
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [studentId, setStudentId] = useState(selectedStudentId);

  const editingTask = editingTaskId
    ? tasks.find((t) => t.id === editingTaskId)
    : null;

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
  }, [editingTask, selectedStudentId]);

  const resetForm = () => {
    setDate(new Date().toISOString().split("T")[0]);
    setSubject("");
    setTopic("");
    setQuestionCount("");
  };

  const availableTopics = subject ? TOPICS_BY_SUBJECT[subject] || [] : [];

  const handleSubmit = () => {
    if (!date || !subject || !topic || !questionCount) {
      toast.error("Lutfen tum alanlari doldurun");
      return;
    }

    if (editingTask) {
      updateTask(editingTask.id, {
        dueDate: date,
        subject,
        topic,
        questionCount: parseInt(questionCount),
        studentId,
      });
      toast.success("Görev guncellendi");
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        studentId,
        teacherId: currentUser.id,
        dueDate: date,
        subject,
        topic,
        questionCount: parseInt(questionCount),
        completedQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        hoursStudied: 0,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addTask(newTask);
      toast.success("Görev eklendi");
    }

    onOpenChange(false);
    resetForm();
  };

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
          <Button onClick={handleSubmit}>
            {editingTask ? "Guncelle" : "Ekle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
