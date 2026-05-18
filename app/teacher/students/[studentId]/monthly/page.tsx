"use client";

import { useParams } from "next/navigation";
import { MonthlyTasksView } from "@/components/tasks/monthly-tasks-view";
import { useStudentContext } from "@/lib/hooks";
import { StudentHeader } from "@/components/teacher/student-header";
import { TeacherActions } from "@/components/teacher/teacher-actions";

export default function StudentMonthlyPage() {
  const params = useParams();
  const studentId = params.studentId as string;
  const { selectedStudent } = useStudentContext();

  return (
    <div className="space-y-6">
      <StudentHeader student={selectedStudent} viewType="monthly" />
      <TeacherActions studentId={studentId} viewType="monthly" />
      <MonthlyTasksView studentId={studentId} role="teacher" />
    </div>
  );
}
