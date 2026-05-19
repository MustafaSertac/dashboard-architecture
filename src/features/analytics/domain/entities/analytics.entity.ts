/**
 * Analytics Entity - Analytics Domain
 * Represents student performance analytics and statistics
 */

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

export interface MonthlyStats {
  month: string;
  year: number;
  totalHours: number;
  totalQuestions: number;
  totalCorrect: number;
  totalWrong: number;
  weeks: WeeklyStats[];
}

export interface StudentProgress {
  studentId: string;
  weeklyProgress: number;
  monthlyProgress: number;
  totalTasks: number;
  completedTasks: number;
  totalHours: number;
}

export interface AnalyticsResponse {
  data: any | null;
  success: boolean;
  error?: string;
}
