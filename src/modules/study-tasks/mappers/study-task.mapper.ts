import type { Task } from "@/lib/types";
import type { StudyTaskDTO, CreateTaskRequest } from "@/modules/study-tasks/types/study-task.types";

interface MapContext {
  // BACKEND EKSIK #1 (Kritik): StudyTaskDTO.dueDate yok.
  // dueDate backend'den gelene kadar cagiran taraf (hook) bir fallback saglar:
  //   - today endpoint'i icin: bugunun tarihi
  //   - upcoming endpoint'i icin: bugun + 1 (kullanici tarafindan filtrelenir)
  //   - byStudentRange icin: query'deki ilgili gun
  fallbackDate?: string;
  // BACKEND EKSIK #4 (Yuksek): studentId/teacherId yok DTO'da.
  // Hook studentId'yi zaten biliyor; onu map context'inde geciriyoruz.
  fallbackStudentId?: string;
}

export function mapStudyTaskToUi(
  dto: StudyTaskDTO,
  ctx: MapContext = {}
): Task {
  const isCompleted = dto.isCompleted;
  const hasProgress = dto.totalQuestions > 0 && !isCompleted;

  // dueDate: backend geliyorsa kullan, yoksa fallback'e dus.
  const dueDate =
    dto.dueDate ??
    ctx.fallbackDate ??
    new Date().toISOString().split("T")[0];

  return {
    id: dto.taskId,
    // BACKEND EKSIK #4: DTO'da studentId yok. Hook cagiran StudentId'yi gecirir.
    studentId: dto.studentId ?? ctx.fallbackStudentId ?? "",
    // BACKEND EKSIK #4: DTO'da teacherId yok. Bos birakilir (UI tarafinda kullanilmiyor).
    teacherId: dto.teacherId ?? "",
    dueDate,
    subject: dto.lessonTitle,
    topic: dto.topicTitle,
    questionCount: dto.targetQuestions,
    completedQuestions: dto.totalQuestions,
    correctAnswers: dto.correctCount,
    wrongAnswers: dto.wrongCount,
    hoursStudied: dto.studiedHours,
    status: isCompleted ? "completed" : hasProgress ? "in-progress" : "pending",
    // BACKEND EKSIK #4: createdAt/updatedAt yok. ISO simdi fallback.
    createdAt: dto.createdAt ?? new Date().toISOString(),
    updatedAt: dto.updatedAt ?? new Date().toISOString(),
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
