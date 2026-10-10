"use client";

import { createContext, useContext, useState, useMemo, useCallback, ReactNode } from "react";
import { User } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { useTeacherStudents } from "@/modules/teacher/hooks/useTeacher";

interface StudentWithStats extends User {
  weeklyProgress: number;
  totalTasks: number;
  completedTasks: number;
  totalHours: number;
  lastActive: string;
}

interface StudentContextType {
  selectedStudent: User | null;
  setSelectedStudent: (student: User | null) => void;
  studentsWithStats: StudentWithStats[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

// BACKEND #2 (Yuksek) TAMAMLANDI: GET /teachers/{teacherId}/students.
export function StudentProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  const { data: teacherStudents, isLoading, isError, error, refetch } =
    useTeacherStudents(user?.id);

  const studentsWithStats: StudentWithStats[] = useMemo(
    () =>
      (teacherStudents ?? []).map((s) => ({
        ...s,
        role: "student" as const,
        weeklyProgress: s.weeklyProgress,
        totalTasks: s.totalTasks,
        completedTasks: s.completedTasks,
        totalHours: s.totalHours,
        lastActive: s.lastActive,
      })),
    [teacherStudents]
  );

  const selectStudent = useCallback((student: User | null) => {
    setSelectedStudent(student);
  }, []);

  const value = useMemo(
    () => ({
      selectedStudent,
      setSelectedStudent: selectStudent,
      studentsWithStats,
      isLoading,
      isError,
      error,
      refetch,
    }),
    [
      selectedStudent,
      selectStudent,
      studentsWithStats,
      isLoading,
      isError,
      error,
      refetch,
    ]
  );

  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
}

export function useStudentContext() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudentContext must be used within StudentProvider");
  }
  return context;
}
