/**
 * IStudentRepository - Contract for student operations
 * Handles student data management from teacher perspective
 */

import { StudentWithStats, StudentNote, CreateStudentNoteInput, StudentResponse } from '../entities/student.entity';

export interface IStudentRepository {
  /**
   * Get student by ID with statistics
   */
  getStudentById(id: string): Promise<StudentWithStats | null>;

  /**
   * Get all students (optionally filtered by teacher)
   */
  getAllStudents(teacherId?: string): Promise<StudentWithStats[]>;

  /**
   * Get teacher's students with statistics
   */
  getTeacherStudents(teacherId: string): Promise<StudentWithStats[]>;

  /**
   * Get student notes added by teacher
   */
  getStudentNotes(studentId: string): Promise<StudentNote[]>;

  /**
   * Add note to student
   */
  addStudentNote(input: CreateStudentNoteInput, teacherId: string): Promise<StudentNote | null>;

  /**
   * Delete student note
   */
  deleteStudentNote(noteId: string): Promise<boolean>;

  /**
   * Get student overview for teacher
   */
  getStudentOverview(studentId: string): Promise<StudentResponse>;
}
