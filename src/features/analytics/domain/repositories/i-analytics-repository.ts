/**
 * IAnalyticsRepository - Contract for analytics operations
 * Handles analytics data calculation and retrieval
 */

import { DayStats, WeeklyStats, MonthlyStats, StudentProgress, AnalyticsResponse } from '../entities/analytics.entity';

export interface IAnalyticsRepository {
  /**
   * Get daily statistics for a student
   */
  getDayStats(studentId: string, date: string): Promise<DayStats | null>;

  /**
   * Get weekly statistics for a student
   */
  getWeeklyStats(studentId: string, weekStart: string): Promise<WeeklyStats | null>;

  /**
   * Get monthly statistics for a student
   */
  getMonthlyStats(studentId: string, month: string, year: number): Promise<MonthlyStats | null>;

  /**
   * Get student progress metrics
   */
  getStudentProgress(studentId: string): Promise<StudentProgress | null>;

  /**
   * Get all students progress (for teachers/admins)
   */
  getAllStudentsProgress(): Promise<StudentProgress[]>;

  /**
   * Get analytics dashboard data for student
   */
  getDashboardAnalytics(studentId: string): Promise<AnalyticsResponse>;

  /**
   * Get teacher dashboard analytics
   */
  getTeacherDashboardAnalytics(teacherId: string): Promise<AnalyticsResponse>;
}
