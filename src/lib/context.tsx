"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import { useAuth } from "@/lib/auth-context";
import type { User, UserRole, Task, ExamResult } from "@/lib/types";
import { MOCK_USERS as mockUsers } from "@/lib/mock/mock-users";

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  examResults: ExamResult[];
  setExamResults: React.Dispatch<React.SetStateAction<ExamResult[]>>;
  addExamResult: (result: ExamResult) => void;
  updateExamResult: (id: string, updates: Partial<ExamResult>) => void;
  students: User[];
}

const defaultUser: User = {
  id: "",
  name: "Kullanici",
  email: "",
  role: "student",
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [currentUserState, setCurrentUser] = useState<User>({
    id: "",
    name: "",
    email: "",
    role: "student",
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);

  const uiUser = useMemo<User | null>(() => {
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    };
  }, [user]);

  const displayUser = uiUser ?? currentUserState;

  const students = useMemo(() => {
    return mockUsers
      .filter((u) => u.role === "student")
      .map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: "student" as UserRole,
      }));
  }, []);

  const switchRole = useCallback(
    (role: UserRole) => {
      const target = mockUsers.find((u) => u.role === role);
      if (target) {
        setCurrentUser({
          id: target.id,
          name: target.name,
          email: target.email,
          role: target.role as UserRole,
        });
      }
    },
    []
  );

  const addTask = useCallback((task: Task) => {
    setTasks((prev) => [...prev, task]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addExamResult = useCallback((result: ExamResult) => {
    setExamResults((prev) => [...prev, result]);
  }, []);

  const updateExamResult = useCallback((id: string, updates: Partial<ExamResult>) => {
    setExamResults((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentUser: displayUser.name ? displayUser : defaultUser,
        setCurrentUser,
        switchRole,
        tasks,
        setTasks,
        addTask,
        updateTask,
        deleteTask,
        examResults,
        setExamResults,
        addExamResult,
        updateExamResult,
        students,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
