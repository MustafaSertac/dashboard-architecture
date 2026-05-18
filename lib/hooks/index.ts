"use client";

import { useAuthStore } from "../src/features/auth/store/useAuthStore";
import { loginApi, registerApi } from "../src/features/auth/services/auth.api";
import { useStudentUiStore } from "../src/features/students/store/useStudentUiStore";
import { useStudents as useStudentsQuery } from "../src/features/students/hooks/useStudents";
import { fetchJson } from "../src/config/api";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const loginStore = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const setMode = useAuthStore((s) => s.setMode);

  const login = async (email: string, password: string) => {
    try {
      const data = await loginApi(email, password);
      loginStore(data.user, data.token);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || String(err) };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const data = await registerApi(name, email, password);
      loginStore(data.user, data.token);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || String(err) };
    }
  };

  return { user, token, login, register, logout, setMode };
}

export function useStudentContext() {
  const selectedStudent = useStudentUiStore((s) => s.selectedStudentId);
  const setSelectedStudent = useStudentUiStore((s) => s.setSelected);
  const { data: students = [], isLoading } = useStudentsQuery();

  const studentsWithStats = students.map((s) => ({
    ...s,
    totalSolved: 0,
    totalCorrect: 0,
    totalHours: 0,
    accuracy: 0,
  }));

  const getStudentTasks = async (id: string) => {
    try {
      return await fetchJson(`/api/students/${encodeURIComponent(id)}/tasks`);
    } catch (err) {
      return [];
    }
  };

  const setMode = (mode: 'mock' | 'remote') => {
    /* noop compatibility — feature stores manage their own mode */
  };

  return { selectedStudent, setSelectedStudent, studentsWithStats, getStudentTasks, isLoading, setMode };
}
