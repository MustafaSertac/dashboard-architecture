"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import { Button } from "@/components/ui/button";
import { TaskModal } from "@/components/tasks/task-modal";
import { NoteModal } from "@/components/teacher/note-modal";
import { Plus, MessageSquarePlus, ClipboardCheck } from "lucide-react";

interface TeacherActionsProps {
  studentId: string;
  viewType: "daily" | "weekly" | "monthly" | "analytics" | "exams";
}

export function TeacherActions({ studentId, viewType }: TeacherActionsProps) {
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);

  // Only show actions on task views
  const showTaskActions = ["daily", "weekly", "monthly"].includes(viewType);

  if (!showTaskActions) return null;

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/30 p-3">
        <span className="text-sm font-medium text-muted-foreground">Ogretmen Islemleri:</span>
        <Button size="sm" onClick={() => setTaskModalOpen(true)}>
          <Plus className="mr-2 size-4" />
          Gorev Ata
        </Button>
        <Button size="sm" variant="outline" onClick={() => setNoteModalOpen(true)}>
          <MessageSquarePlus className="mr-2 size-4" />
          Not Ekle
        </Button>
        <Button size="sm" variant="outline">
          <ClipboardCheck className="mr-2 size-4" />
          Toplu Onayla
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
