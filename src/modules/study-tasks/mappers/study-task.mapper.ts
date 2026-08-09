import type { Task } from "@/lib/types";
import type { StudyTaskDTO, CreateTaskRequest } from "@/modules/study-tasks/types/study-task.types";

export function mapStudyTaskToUi(dto: StudyTaskDTO): Task {
  const isCompleted = dto.isCompleted;
  const hasProgress = dto.totalQuestions > 0 && !isCompleted;

  return {
    id: dto.taskId,
    studentId: "",
    teacherId: "",
    dueDate: undefined as unknown as string,
    subject: dto.lessonTitle,
    topic: dto.topicTitle,
    questionCount: dto.targetQuestions,
    completedQuestions: dto.totalQuestions,
    correctAnswers: dto.correctCount,
    wrongAnswers: dto.wrongCount,
    hoursStudied: dto.studiedHours,
    status: isCompleted ? "completed" : hasProgress ? "in-progress" : "pending",
    createdAt: "",
    updatedAt: "",
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
    targetHours: 1,
    targetQuestions: params.questionCount,
    dueDate: params.dueDate,
  };
}
