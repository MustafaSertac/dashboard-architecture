// Task entity types
import { User } from './user';

export interface Task {
  id: string;
  studentId: string;
  teacherId: string;
  dueDate: string;
  subject: string;
  topic: string;
  questionCount: number;
  completedQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  hoursStudied: number;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export type FilterStatus = 'all' | 'completed' | 'pending';
