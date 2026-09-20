import type { ExamCode, ExamStatus } from "@/types/common";

export interface ExamSectionDTO {
  id: string;
  name: string;
  correct: number;
  wrong: number;
  blank: number;
  net?: number;
  lessons: ExamLessonDTO[];
}

export interface ExamLessonDTO {
  id: string;
  lessonCode: number;
  name: string;
  correct: number;
  wrong: number;
  blank: number;
  net?: number;
  topicResults: ExamTopicResultDTO[];
}

export interface ExamTopicResultDTO {
  id: string;
  topicCode: number;
  name: string;
  wrong: number;
  blank: number;
  correct: number;
  questionNumbers: number[];
}

export interface ExamDTO {
  id: string;
  studentId: string;
  examCode: number;
  examName: string;
  examDate: string;
  status: number;
  durationMinutes?: number;
  notes?: string;
  totalNet?: number;
  totalCorrect: number;
  totalWrong: number;
  totalBlank: number;
  sections: ExamSectionDTO[];
  createdAt: string;
  updatedAt?: string;
}

export interface ExamSummaryDTO {
  id: string;
  studentId: string;
  examCode: number;
  examName: string;
  examDate: string;
  status: number;
  durationMinutes?: number;
  totalNet?: number;
  totalCorrect: number;
  totalWrong: number;
  totalBlank: number;
  createdAt: string;
  updatedAt?: string;
}

// BACKEND #7 (Orta) TAMAMLANDI: GET /exams/trends/all.
export interface StudentTrendDTO {
  studentId: string;
  studentName: string;
  exams: ExamSummaryDTO[];
}

export interface ExamTopicResultRequest {
  topicCode: number;
  name: string;
  correct?: number;
  wrong: number;
  blank: number;
  questionNumbers?: number[];
}

export interface ExamLessonRequest {
  lessonCode: number;
  name: string;
  correct: number;
  wrong: number;
  blank: number;
  topicResults?: ExamTopicResultRequest[];
}

export interface ExamSectionRequest {
  name: string;
  correct: number;
  wrong: number;
  blank: number;
  lessons: ExamLessonRequest[];
}

export interface CreateExamRequest {
  studentId: string;
  examCode: ExamCode;
  examName: string;
  examDate: string;
  durationMinutes?: number;
  notes?: string;
  status?: ExamStatus;
  sections: ExamSectionRequest[];
}

export interface UpdateExamRequest {
  studentId?: string;
  examCode?: ExamCode;
  examName?: string;
  examDate?: string;
  durationMinutes?: number;
  notes?: string;
  status?: ExamStatus;
  sections?: ExamSectionRequest[];
}
