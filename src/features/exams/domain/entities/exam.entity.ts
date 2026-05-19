/**
 * Exam Entity - Exams Domain
 * Represents exam results and analysis
 */

export type ExamType = 'TYT' | 'AYT';

export interface TopicDetail {
  topicName: string;
  subtopicName?: string;
  questionNumbers: number[];
  correct: number;
  wrong: number;
  empty: number;
}

export interface SubjectResult {
  subjectName: string;
  questionCount: number;
  correct: number;
  wrong: number;
  empty: number;
  net: number;
  topicDetails?: TopicDetail[];
}

export interface ExamResult {
  id: string;
  studentId: string;
  date: string;
  examType: ExamType;
  examName?: string;
  totalCorrect: number;
  totalWrong: number;
  totalEmpty: number;
  totalNet: number;
  subjectResults: SubjectResult[];
  analysisCompleted: boolean;
  createdAt?: string;
}

export interface CreateExamInput {
  studentId: string;
  examType: ExamType;
  examName?: string;
  subjectResults: SubjectResult[];
}

export interface ExamResponse {
  exam: ExamResult | null;
  success: boolean;
  error?: string;
}
