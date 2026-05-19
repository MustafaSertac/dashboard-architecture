"use client";

import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";
import { User, Task } from "./types";
import { mockUsers, mockTasks } from "./mock-data";

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
  getStudentTasks: (studentId: string) => Task[];
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  const studentsWithStats: StudentWithStats[] = useMemo(() => {
    const students = mockUsers.filter((u) => u.role === "student");
    
    return students.map((student) => {
      const studentTasks = mockTasks.filter((t) => t.studentId === student.id);
      const completedTasks = studentTasks.filter((t) => t.status === "completed").length;
      const totalHours = studentTasks.reduce((sum, t) => sum + (t.hoursStudied || 0), 0);
      const totalQuestions = studentTasks.reduce((sum, t) => sum + t.questionCount, 0);
      const completedQuestions = studentTasks.reduce((sum, t) => sum + (t.completedQuestions || 0), 0);
      const weeklyProgress = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

      // Get last activity from the most recent task update
      const lastTaskUpdate = studentTasks
        .map((t) => new Date(t.updatedAt).getTime())
        .sort((a, b) => b - a)[0];
      
      const lastActive = lastTaskUpdate 
        ? new Date(lastTaskUpdate).toLocaleDateString("tr-TR")
        : "Aktivite yok";

      return {
        ...student,
        weeklyProgress,
        totalTasks: studentTasks.length,
        completedTasks,
        totalHours,
        lastActive,
      };
    });
  }, []);

  const getStudentTasks = useCallback((studentId: string) => {
    return mockTasks.filter((t) => t.studentId === studentId);
  }, []);

  return (
    <StudentContext.Provider
      value={{
        selectedStudent,
        setSelectedStudent,
        studentsWithStats,
        getStudentTasks,
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
