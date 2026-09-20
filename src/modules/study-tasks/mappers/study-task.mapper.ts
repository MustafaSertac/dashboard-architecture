import type { Task } from "@/lib/types";
import type { StudyTaskDTO, CreateTaskRequest } from "@/modules/study-tasks/types/study-task.types";

export function mapStudyTaskToUi(dto: StudyTaskDTO): Task {
  const isCompleted = dto.isCompleted;
  const hasProgress = dto.totalQuestions > 0 && !isCompleted;

  return {
    id: dto.taskId,
    studentId: dto.studentId,
    teacherId: dto.teacherId ?? "",
    dueDate: dto.dueDate,
    subject: dto.lessonTitle,
    topic: dto.topicTitle,
    questionCount: dto.targetQuestions,
    completedQuestions: dto.totalQuestions,
    correctAnswers: dto.correctCount,
    wrongAnswers: dto.wrongCount,
    emptyAnswers: dto.emptyCount,
    hoursStudied: dto.studiedHours,
    status: isCompleted ? "completed" : hasProgress ? "in-progress" : "pending",
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt ?? dto.createdAt,
  };
}

export function mapUiTaskFormToCreateRequest(params: {
  studentId: string;
  subject: string;
  topic: string;
  questionCount: number;
  dueDate: string;
  lessonId?: string;
  topicId?: string;
  unitId?: string;
  targetHours?: number;
  description?: string;
}): CreateTaskRequest {
  return {
    studentId: params.studentId,
    lessonId: params.lessonId ?? "",
    lessonTitle: params.subject,
    taskType: 0,
    topicId: params.topicId ?? "",
    unitId: params.unitId,
    topicTitle: params.topic,
    title: `${params.subject} - ${params.topic}`,
    description: params.description ?? "",
    targetHours: params.targetHours ?? 1,
    targetQuestions: params.questionCount,
    dueDate: params.dueDate,
  };
}

export function mapUiTaskToUpdateRequest(params: {
  taskId: string;
  studentId: string;
  subject?: string;
  topic?: string;
  questionCount?: number;
  dueDate?: string;
  lessonId?: string;
  topicId?: string;
  unitId?: string;
  targetHours?: number;
  description?: string;
  isCompleted?: boolean;
}): import("@/modules/study-tasks/types/study-task.types").UpdateTaskRequest {
  return {
    taskId: params.taskId,
    studentId: params.studentId,
    lessonId: params.lessonId,
    lessonTitle: params.subject,
    topicId: params.topicId,
    unitId: params.unitId,
    topicTitle: params.topic,
    title: params.subject && params.topic ? `${params.subject} - ${params.topic}` : undefined,
    description: params.description,
    targetHours: params.targetHours,
    targetQuestions: params.questionCount,
    dueDate: params.dueDate,
  };
}
