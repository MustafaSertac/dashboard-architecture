/**
 * ITeacherRepository - Contract for teacher operations
 * Handles teacher dashboard and management features
 */

import { Teacher, TeacherStats, TeacherDashboard, Activity, TeacherResponse } from '../entities/teacher.entity';

export interface ITeacherRepository {
  /**
   * Get teacher profile
   */
  getTeacherProfile(id: string): Promise<Teacher | null>;

  /**
   * Get teacher statistics
   */
  getTeacherStats(teacherId: string): Promise<TeacherStats | null>;

  /**
   * Get teacher dashboard data
   */
  getTeacherDashboard(teacherId: string): Promise<TeacherDashboard | null>;

  /**
   * Get recent activities of teacher
   */
  getRecentActivities(teacherId: string, limit?: number): Promise<Activity[]>;

  /**
   * Update teacher profile
   */
  updateTeacherProfile(teacherId: string, data: Partial<Teacher>): Promise<TeacherResponse>;

  /**
   * Get overview data for teacher view
   */
  getDashboardOverview(teacherId: string): Promise<TeacherResponse>;
}
