/**
 * Student Entity - Students Domain
 * Represents student information and associated data
 */

export interface StudentWithStats {
  id: string;
  name: string;
  email: string;
  role: 'student';
  avatar?: string;
  weeklyProgress: number;
  completedTasks: number;
  totalTasks: number;
  totalHours: number;
}

export interface StudentNote {
  id: string;
  studentId: string;
  teacherId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentNoteInput {
  studentId: string;
  content: string;
}

export interface StudentResponse {
  student: StudentWithStats | null;
  success: boolean;
  error?: string;
}
