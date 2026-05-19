/**
 * Task Entity - Tasks Domain
 * Represents a study task assigned by teacher to student
 */

export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  studentId: string;
  teacherId: string;
  subject: string;
  topic: string;
  dueDate: string;
  questionCount: number;
  completedQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  hoursStudied: number;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  studentId: string;
  subject: string;
  topic: string;
  dueDate: string;
  questionCount: number;
}

export interface UpdateTaskInput {
  completedQuestions?: number;
  correctAnswers?: number;
  wrongAnswers?: number;
  hoursStudied?: number;
  status?: TaskStatus;
}

export interface TaskResponse {
  task: Task | null;
  success: boolean;
  error?: string;
}
