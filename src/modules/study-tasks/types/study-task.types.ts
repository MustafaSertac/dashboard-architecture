export interface StudyTaskDTO {
  taskId: string;
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
  // BACKEND EKSIK #1 (Kritik): dueDate alani StudyTaskDTO'da YOK.
  // Backend BackendTalep.md talep #1 ve #4'te listelendi.
  // Frontend dueDate'i varmis gibi implement etti; backend ekleyene kadar
  // service/hook katmaninda context-date fallback kullaniliyor.
  dueDate?: string;
  // BACKEND EKSIK #4 (Yuksek): teacherId/studentId/createdAt/updatedAt alanlari YOK.
  teacherId?: string;
  studentId?: string;
  createdAt?: string;
  updatedAt?: string;
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
