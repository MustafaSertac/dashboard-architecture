// Analytics-specific types

export interface SubjectStats {
  subject: string;
  totalHours: number;
  totalQuestions: number;
  completedCount: number;
  pendingCount: number;
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

export interface TopicStats {
  topic: string;
  totalQuestions: number;
  totalMistakes: number;
  branches: BranchStats[];
}

export interface CourseStats {
  course: string;
  branches: BranchStats[];
}
