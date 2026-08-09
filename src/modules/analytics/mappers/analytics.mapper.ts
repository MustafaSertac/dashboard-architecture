import type { DayStats, SubjectStats, CourseStats as UiCourseStats, BranchStats as UiBranchStats, TopicStats as UiTopicStats } from "@/lib/types";
import type { WeeklyAnalyticsDTO, MonthlyAnalyticsDTO, DashboardOverviewDTO } from "@/modules/analytics/types/analytics.types";
import { mapExamDtoToUi } from "@/modules/exams/mappers/exam.mapper";
import type { ExamResult } from "@/lib/types";

export function mapWeeklyAnalytics(_dto: WeeklyAnalyticsDTO, weekStart: string, daysInWeek: number): DayStats[] {
  return _dto.days.map((day) => ({
    date: day.date,
    questionCount: day.totalQuestions,
    correctCount: day.totalCorrect,
    wrongCount: day.totalQuestions - day.totalCorrect,
    totalHours: day.totalHours,
    targetReached: day.totalQuestions >= 80 && day.totalHours >= 4,
    belowMinimum: !(day.totalQuestions >= 80 && day.totalHours >= 4) && (day.totalQuestions < 50 || day.totalHours < 2),
    inactive: day.totalQuestions === 0 && day.totalHours === 0,
  }));
}

export function mapMonthlyAnalytics(dto: MonthlyAnalyticsDTO): {
  subjectStats: SubjectStats[];
  courseStats: UiCourseStats[];
  summary: MonthlyAnalyticsDTO["summary"];
} {
  const subjectStats: SubjectStats[] = dto.courses.map((course) => ({
    subject: course.course,
    totalHours: 0,
    totalQuestions: course.branches.reduce((s, b) => s + b.totalQuestions, 0),
    completedCount: dto.summary.completedCount,
    pendingCount: dto.summary.pendingCount,
  }));

  const courseStats: UiCourseStats[] = dto.courses.map((course) => ({
    course: course.course,
    branches: course.branches.map((branch) => ({
      branch: branch.branch,
      totalQuestions: branch.totalQuestions,
      totalMistakes: branch.totalMistakes,
      topics: branch.topics.map((topic) => ({
        name: topic.name,
        questions: topic.questions,
        mistakes: topic.mistakes,
      })),
    })),
  }));

  return {
    subjectStats,
    courseStats,
    summary: dto.summary,
  };
}

export function mapDashboardOverview(
  dto: DashboardOverviewDTO
): {
  quickStats: {
    totalSolvedQuestions: number;
    completedTasks: number;
    pendingTasks: number;
    latestNet?: number;
  };
  recentExams: ExamResult[];
} {
  return {
    quickStats: dto.quickStats,
    recentExams: (dto.recentExams ?? []).map(mapExamDtoToUi),
  };
}
