// RBAC User Roles
export type UserRole = "admin" | "teacher" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Mock Exam Types
export type ExamType = "TYT" | "AYT";

export interface ExamResult {
  id: string;
  studentId: string;
  date: string;
  examType: ExamType;
  correct: number;
  wrong: number;
  empty: number;
  net: number;
  analysisCompleted: boolean;
  topics?: TopicResult[];
}

export interface TopicResult {
  subject: string;
  topic: string;
  correct: number;
  wrong: number;
  net: number;
}

// Task Module Types
export interface Task {
  id: string;
  studentId: string;
  teacherId: string;
  dueDate: string;
  subject: string;
  topic: string;
  questionCount: number;
  completedQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  hoursStudied: number;
  status: "pending" | "in-progress" | "completed";
  createdAt: string;
  updatedAt: string;
}

// Calendar Types
export interface DayStats {
  date: string;
  questionCount: number;
  correctCount: number;
  wrongCount: number;
  totalHours: number;
  targetReached: boolean;
  belowMinimum: boolean;
  inactive: boolean;
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  totalHours: number;
  totalQuestions: number;
  days: DayStats[];
}

// Analytics Types
export interface SubjectStats {
  subject: string;
  totalHours: number;
  totalQuestions: number;
  completedCount: number;
  pendingCount: number;
}

export interface TopicStats {
  topic: string;
  totalQuestions: number;
  totalMistakes: number;
  branches: BranchStats[];
}

export interface BranchStats {
  branch: string;
  totalQuestions: number;
  totalMistakes: number;
  topics: {
    name: string;
    questions: number;
    mistakes: number;
  }[];
}

export interface CourseStats {
  course: string;
  branches: BranchStats[];
}

// Filter Types
export type FilterStatus = "all" | "completed" | "pending";

// Subject and Topic Data
export const TYT_SUBJECTS = [
  "Turkce",
  "Matematik",
  "Fizik",
  "Kimya",
  "Biyoloji",
  "Tarih",
  "Cografya",
  "Felsefe",
] as const;

export const AYT_SUBJECTS = [
  "Matematik",
  "Fizik",
  "Kimya",
  "Biyoloji",
  "Edebiyat",
  "Tarih",
  "Cografya",
  "Felsefe",
] as const;

export const TOPICS_BY_SUBJECT: Record<string, string[]> = {
  Turkce: [
    "Sozcukte Anlam",
    "Cumle Yorumu",
    "Paragraf",
    "Dil Bilgisi",
    "Anlatim Bozukluklari",
  ],
  Matematik: [
    "Temel Kavramlar",
    "Sayilar",
    "Fonksiyonlar",
    "Polinomlar",
    "Trigonometri",
    "Logaritma",
    "Diziler",
    "Limit ve Turev",
    "Integral",
  ],
  Fizik: [
    "Kuvvet ve Hareket",
    "Enerji",
    "Elektrik",
    "Manyetizma",
    "Optik",
    "Dalgalar",
  ],
  Kimya: [
    "Atom ve Periyodik Sistem",
    "Kimyasal Baglar",
    "Mol Kavrami",
    "Gazlar",
    "Cozeltiler",
    "Reaksiyonlar",
  ],
  Biyoloji: [
    "Hucre",
    "Canlilar",
    "Genetik",
    "Ekoloji",
    "Sistemler",
  ],
  Tarih: [
    "Ilk Caglar",
    "Orta Cag",
    "Osmanli",
    "Inkilap Tarihi",
    "Cagdas Dunya",
  ],
  Cografya: [
    "Fiziki Cografya",
    "Beseri Cografya",
    "Turkiye Cografyasi",
    "Bolge Cografyasi",
  ],
  Felsefe: [
    "Felsefeye Giris",
    "Bilgi Felsefesi",
    "Varlik Felsefesi",
    "Ahlak Felsefesi",
  ],
  Edebiyat: [
    "Edebi Bilgiler",
    "Donemler",
    "Edebi Turler",
    "Divan Edebiyati",
    "Halk Edebiyati",
  ],
};
