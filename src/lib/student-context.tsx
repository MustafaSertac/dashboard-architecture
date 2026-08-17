"use client";

import { createContext, useContext, useState, ReactNode } from "react";
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
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

// BACKEND EKSIK #2 (Yuksek): Ogretmen-ogrenci liste endpoint'i YOK.
// Bu provider artik useTeacherStudents hook'una dayanir; hook backend
// tamamlanana kadar mock fallback doner, tamamlandiginda tek satir degisiklikle
// gercek endpoint'e gecer.
export function StudentProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  const { data: teacherStudents } = useTeacherStudents(user?.id);

  const studentsWithStats: StudentWithStats[] = (teacherStudents ?? []).map(
    (s) => ({
      ...s,
      role: "student" as const,
      weeklyProgress: s.weeklyProgress,
      totalTasks: s.totalTasks,
      completedTasks: s.completedTasks,
      totalHours: s.totalHours,
      lastActive: s.lastActive,
    })
  );

  return (
    <StudentContext.Provider
      value={{
        selectedStudent,
        setSelectedStudent,
        studentsWithStats,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudentContext() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudentContext must be used within StudentProvider");
  }
  return context;
}
