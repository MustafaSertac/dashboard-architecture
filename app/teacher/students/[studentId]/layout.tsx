"use client";

import { useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useStudentContext } from "@/lib/student-context";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { studentsWithStats, setSelectedStudent, selectedStudent } = useStudentContext();

  const studentId = params.studentId as string;

  useEffect(() => {
    const student = studentsWithStats.find((s) => s.id === studentId);
    if (student) {
      setSelectedStudent(student);
    } else if (studentsWithStats.length > 0) {
      // Redirect to students list if student not found
      router.push("/teacher/students");
    }
  }, [studentId, studentsWithStats, setSelectedStudent, router]);

  // Clear selected student when leaving
  useEffect(() => {
    return () => {
      // Only clear if navigating away from student detail pages
      if (!pathname.includes(`/teacher/students/${studentId}`)) {
        setSelectedStudent(null);
      }
    };
  }, [pathname, studentId, setSelectedStudent]);

  if (!selectedStudent) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">Yukleniyor...</div>
      </div>
    );
  }

  return <>{children}</>;
}
