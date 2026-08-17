"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { TaskModal } from "@/components/tasks/task-modal";
import { DailyTasksView } from "@/components/tasks/daily-tasks-view";
import { WeeklyTasksView } from "@/components/tasks/weekly-tasks-view";
import { MonthlyTasksView } from "@/components/tasks/monthly-tasks-view";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTeacherStudents } from "@/modules/teacher/hooks/useTeacher";
import { Plus, Calendar, CalendarDays, CalendarRange } from "lucide-react";

export default function TasksPage() {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher" || user?.role === "admin";

  // BACKEND EKSIK #2: Ogretmen-ogrenci liste endpoint'i YOK. Hook mock fallback doner.
  const { data: teacherStudents } = useTeacherStudents(
    isTeacher ? user?.id : undefined
  );

  const students = isTeacher
    ? (teacherStudents ?? []).map((s) => ({ id: s.id, name: s.name }))
    : user
      ? [{ id: user.id, name: user.name }]
      : [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    user?.role === "student" ? (user.id ?? "") : (students[0]?.id ?? "")
  );

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTaskId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Görevler</h1>
          <p className="text-muted-foreground">
            Günlük, haftalık ve aylık çalışma görevlerini takip et
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isTeacher && (
            <>
              <div className="flex items-center gap-2">
                <Label htmlFor="student-select" className="text-sm whitespace-nowrap">
                  Öğrenci:
                </Label>
                <Select
                  value={selectedStudentId}
                  onValueChange={setSelectedStudentId}
                >
                  <SelectTrigger id="student-select" className="w-[160px]">
                    <SelectValue placeholder="Ogrenci sec" />
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
              <Button
                onClick={() => {
                  setEditingTaskId(null);
                  setModalOpen(true);
                }}
                disabled={!selectedStudentId}
              >
                <Plus className="mr-2 size-4" />
                Görev Ekle
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="daily" className="gap-2">
            <Calendar className="size-4" />
            <span className="hidden sm:inline">Günlük</span>
          </TabsTrigger>
          <TabsTrigger value="weekly" className="gap-2">
            <CalendarDays className="size-4" />
            <span className="hidden sm:inline">Haftalık</span>
          </TabsTrigger>
          <TabsTrigger value="monthly" className="gap-2">
            <CalendarRange className="size-4" />
            <span className="hidden sm:inline">Aylık</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <DailyTasksView studentId={selectedStudentId} />
        </TabsContent>

        <TabsContent value="weekly">
          <WeeklyTasksView studentId={selectedStudentId} />
        </TabsContent>

        <TabsContent value="monthly">
          <MonthlyTasksView studentId={selectedStudentId} />
        </TabsContent>
      </Tabs>

      <TaskModal
        open={modalOpen}
        onOpenChange={handleCloseModal}
        editingTaskId={editingTaskId}
          selectedStudentId={selectedStudentId}
      />
    </div>
  );
}
