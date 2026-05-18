// Calendar / day / week stats

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
