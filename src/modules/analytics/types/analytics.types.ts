export interface WeeklyAnalyticsDTO {
  weekStart: string;
  weekEnd: string;
  days: WeeklyDayBreakdown[];
  weeklyTotals: {
    questions: number;
    correct: number;
    hours: number;
  };
}

export interface WeeklyDayBreakdown {
  date: string;
  dayName: string;
  subjects: {
    name: string;
    questions: number;
    correct: number;
    hours: number;
  }[];
  totalQuestions: number;
  totalCorrect: number;
  totalHours: number;
}

export interface TopicStats {
  name: string;
  questions: number;
  mistakes: number;
}

export interface BranchStats {
  branch: string;
  totalQuestions: number;
  totalMistakes: number;
  topics: TopicStats[];
}

export interface CourseStats {
  course: string;
  branches: BranchStats[];
}

export interface MonthlyAnalyticsDTO {
  year: number;
  month: number;
  summary: {
    totalHours: number;
    totalQuestions: number;
    completedCount: number;
    pendingCount: number;
  };
  courses: CourseStats[];
}

export interface DashboardOverviewDTO {
  studentId: string;
  quickStats: {
    totalSolvedQuestions: number;
    completedTasks: number;
    pendingTasks: number;
    latestNet?: number;
  };
  recentExams: import("@/modules/exams/types/exam.types").ExamSummaryDTO[];
}
