/**
 * IExamRepository - Contract for exam operations
 * Handles exam results storage and retrieval
 */

import { ExamResult, CreateExamInput, ExamResponse } from '../entities/exam.entity';

export interface IExamRepository {
  /**
   * Create and save exam result
   */
  createExam(input: CreateExamInput): Promise<ExamResponse>;

  /**
   * Get exam result by ID
   */
  getExamById(id: string): Promise<ExamResult | null>;

  /**
   * Get all exam results for a student
   */
  getStudentExams(studentId: string): Promise<ExamResult[]>;

  /**
   * Get exam results by date range
   */
  getExamsByDateRange(studentId: string, startDate: string, endDate: string): Promise<ExamResult[]>;

  /**
   * Update exam analysis completion status
   */
  updateExamAnalysis(id: string, analysisCompleted: boolean): Promise<boolean>;

  /**
   * Delete exam result
   */
  deleteExam(id: string): Promise<boolean>;

  /**
   * Get exam statistics for student
   */
  getExamStatistics(studentId: string): Promise<{ totalExams: number; avgNet: number }>;
}
