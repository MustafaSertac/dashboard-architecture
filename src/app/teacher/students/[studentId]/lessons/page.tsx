"use client";

import { useParams } from "next/navigation";
import { useStudentContext } from "@/lib/student-context";
import { StudentHeader } from "@/components/teacher/student-header";
import { StudentLessonsView } from "@/components/teacher/student-lessons-view";

export default function StudentLessonsPage() {
  const params = useParams();
  const studentId = params.studentId as string;
  const { selectedStudent } = useStudentContext();

  return (
    <div className="space-y-6">
      <StudentHeader student={selectedStudent} viewType="lessons" />
      <StudentLessonsView studentId={studentId} />
    </div>
  );
}
