"use client";

import { useParams } from "next/navigation";
import { WeeklyTasksView } from "@/components/tasks/weekly-tasks-view";
import { useStudentContext } from "@/lib/student-context";
import { StudentHeader } from "@/components/teacher/student-header";
import { TeacherActions } from "@/components/teacher/teacher-actions";

export default function StudentWeeklyPage() {
  const params = useParams();
  const studentId = params.studentId as string;
  const { selectedStudent } = useStudentContext();

  return (
    <div className="space-y-6">
      <StudentHeader student={selectedStudent} viewType="weekly" />
      <TeacherActions studentId={studentId} viewType="weekly" />
      <WeeklyTasksView studentId={studentId} role="teacher" />
    </div>
  );
}
