"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";

interface TaskViewDateContextType {
  viewDate: Date;
  setViewDate: (date: Date) => void;
}

const TaskViewDateContext = createContext<TaskViewDateContextType | undefined>(
  undefined
);

export function TaskViewDateProvider({ children }: { children: ReactNode }) {
  const [viewDate, setViewDate] = useState<Date>(() => new Date());

  const value = useMemo(() => ({ viewDate, setViewDate }), [viewDate]);

  return (
    <TaskViewDateContext.Provider value={value}>
      {children}
    </TaskViewDateContext.Provider>
  );
}

export function useTaskViewDate() {
  const context = useContext(TaskViewDateContext);
  if (!context) {
    throw new Error(
      "useTaskViewDate must be used within TaskViewDateProvider"
    );
  }
  return context;
}
