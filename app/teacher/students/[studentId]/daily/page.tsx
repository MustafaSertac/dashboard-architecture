"use client";

import { useParams } from "next/navigation";
import { DailyTasksView } from "@/components/tasks/daily-tasks-view";
import { useStudentContext } from "@/lib/hooks";
import { StudentHeader } from "@/components/teacher/student-header";
import { TeacherActions } from "@/components/teacher/teacher-actions";

export default function StudentDailyPage() {
  const params = useParams();
  const studentId = params.studentId as string;
  const { selectedStudent } = useStudentContext();

  return (
    <div className="space-y-6">
      <StudentHeader student={selectedStudent} viewType="daily" />
      <TeacherActions studentId={studentId} viewType="daily" />
      <DailyTasksView studentId={studentId} role="teacher" />
    </div>
  );
}
