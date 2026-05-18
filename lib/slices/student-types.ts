import { User, Task } from '../types';

export type Mode = 'mock' | 'remote';

export type StudentWithStats = User & {
  weeklyProgress: number;
  totalTasks: number;
  completedTasks: number;
  totalHours: number;
  lastActive: string;
};

export type StudentState = {
  mode: Mode;
  setMode: (m: Mode) => void;
  selectedStudent: User | null;
  setSelectedStudent: (u: User | null) => void;
  studentsWithStats: StudentWithStats[];
  getStudentTasks: (studentId: string) => Task[];
  init: () => void;
};
