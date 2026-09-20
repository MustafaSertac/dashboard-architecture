"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TaskModal } from "@/components/tasks/task-modal";
import { NoteModal } from "@/components/teacher/note-modal";
import {
  useTodayTasks,
  useBulkCompleteTasks,
} from "@/modules/study-tasks/hooks/useStudyTasks";
import { toast } from "sonner";
import { Plus, MessageSquarePlus, ClipboardCheck } from "lucide-react";

interface TeacherActionsProps {
  studentId: string;
  viewType: "daily" | "weekly" | "monthly" | "analytics" | "exams";
}

export function TeacherActions({ studentId, viewType }: TeacherActionsProps) {
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);

  // BACKEND #6 (Orta) TAMAMLANDI: toplu onay.
  // "Toplu Onayla" o ogrencinin gun icindeki tamamlanmamis task'lerini toplar.
  const { data: todayTasks } = useTodayTasks(studentId);
  const bulkComplete = useBulkCompleteTasks(studentId);

  const handleBulkComplete = () => {
    const pendingIds = (todayTasks ?? [])
      .filter((t) => t.status !== "completed")
      .map((t) => t.id);

    if (pendingIds.length === 0) {
      toast.info("Onaylanacak tamamlanmamis gorev bulunamadi");
      return;
    }

    bulkComplete.mutate(pendingIds, {
      onSuccess: (result) => {
        if (result.failedIds.length === 0) {
          toast.success(`${result.completedCount} gorev onaylandi`);
        } else {
          toast.warning(
            `${result.completedCount} onaylandi, ${result.failedIds.length} basarisiz`
          );
        }
      },
      onError: (err: unknown) => {
        const msg = err instanceof Error ? err.message : "Toplu onay basarisiz";
        toast.error(msg);
      },
    });
  };

  // Only show actions on task views
  const showTaskActions = ["daily", "weekly", "monthly"].includes(viewType);

  if (!showTaskActions) return null;

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/30 p-3">
        <span className="text-sm font-medium text-muted-foreground">Öğretmen İşlemleri:</span>
        <Button size="sm" onClick={() => setTaskModalOpen(true)}>
          <Plus className="mr-2 size-4" />
          Görev Ata
        </Button>
        <Button size="sm" variant="outline" onClick={() => setNoteModalOpen(true)}>
          <MessageSquarePlus className="mr-2 size-4" />
          Not Ekle
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleBulkComplete}
          disabled={bulkComplete.isPending}
        >
          <ClipboardCheck className="mr-2 size-4" />
          {bulkComplete.isPending ? "Onaylanıyor..." : "Toplu Onayla"}
        </Button>
      </div>

      <TaskModal
        open={taskModalOpen}
        onOpenChange={setTaskModalOpen}
        editingTaskId={null}
        selectedStudentId={studentId}
      />

      <NoteModal
        open={noteModalOpen}
        onOpenChange={setNoteModalOpen}
        studentId={studentId}
      />
    </>
  );
}
