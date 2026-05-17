"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { User, UserRole, Task, ExamResult } from "./types";
import { mockUsers, mockTasks, mockExamResults } from "./mock-data";

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

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[2]); // Default student
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [examResults, setExamResults] = useState<ExamResult[]>(mockExamResults);

  const students = mockUsers.filter((u) => u.role === "student");

  const switchRole = (role: UserRole) => {
    const user = mockUsers.find((u) => u.role === role);
    if (user) setCurrentUser(user);
  };

  const addTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const addExamResult = (result: ExamResult) => {
    setExamResults((prev) => [...prev, result]);
  };

  const updateExamResult = (id: string, updates: Partial<ExamResult>) => {
    setExamResults((prev) =>
      prev.map((result) => (result.id === id ? { ...result, ...updates } : result))
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
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
