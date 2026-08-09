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

export interface CreateExamSectionLessonRequest {
  lessonCode: number;
  name: string;
  correct: number;
  wrong: number;
  blank: number;
  topicResults?: {
    topicCode: number;
    name: string;
    wrong: number;
    blank: number;
  }[];
}

export interface CreateExamSectionRequest {
  name: string;
  correct: number;
  wrong: number;
  blank: number;
  lessons: CreateExamSectionLessonRequest[];
}

export interface CreateExamRequest {
  studentId: string;
  examCode: number;
  examName: string;
  examDate: string;
  durationMinutes?: number;
  notes?: string;
  status?: number;
  sections: CreateExamSectionRequest[];
}

export interface UpdateExamRequest {
  studentId?: string;
  examCode?: number;
  examName?: string;
  examDate?: string;
  durationMinutes?: number;
  notes?: string;
  status?: number;
  sections?: CreateExamSectionRequest[];
}
