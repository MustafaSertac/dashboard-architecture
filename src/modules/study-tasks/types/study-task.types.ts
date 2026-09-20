export interface StudyTaskDTO {
  taskId: string;
  studentId: string;
  teacherId?: string;
  dueDate: string;
  createdAt: string;
  updatedAt?: string;
  lessonId: string;
  lessonTitle: string;
  topicId: string;
  topicTitle: string;
  unitId?: string;
  title: string;
  description: string;
  taskType: number;
  targetHours: number;
  targetQuestions: number;
  studiedHours: number;
  correctCount: number;
  wrongCount: number;
  emptyCount: number;
  totalQuestions: number;
  net: number;
  successRate: number;
  isCompleted: boolean;
  isTargetAchieved: boolean;
}

export interface CreateTaskRequest {
  studentId: string;
  lessonId: string;
  lessonTitle: string;
  taskType: number;
  topicId: string;
  unitId?: string;
  topicTitle: string;
  title: string;
  description?: string;
  targetHours: number;
  targetQuestions: number;
  dueDate: string;
}

export interface UpdateTaskRequest {
  taskId: string;
  studentId?: string;
  lessonId?: string;
  lessonTitle?: string;
  taskType?: number;
  topicId?: string;
  unitId?: string;
  topicTitle?: string;
  title?: string;
  description?: string;
  targetHours?: number;
  targetQuestions?: number;
  dueDate?: string;
}

export interface DeleteTaskRequest {
  taskId: string;
}

export interface CompleteTaskRequest {
  taskId: string;
}

export interface LogTaskStudyRequest {
  taskId: string;
  hours: number;
  correctCount: number;
  wrongCount: number;
  emptyCount: number;
}

// BACKEND #10 (Dusuk) TAMAMLANDI: focus session tracking.
export interface FocusSessionDTO {
  id: string;
  taskId: string;
  studentId: string;
  date: string;
  durationMinutes: number;
  startedAt?: string;
  endedAt?: string;
}

export interface CreateFocusSessionRequest {
  durationMinutes: number;
  startedAt?: string;
  endedAt?: string;
}
