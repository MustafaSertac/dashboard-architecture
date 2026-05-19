/**
 * ITaskRepository - Contract for task operations
 * Handles CRUD operations for study tasks
 */

import { Task, CreateTaskInput, UpdateTaskInput, TaskResponse } from '../entities/task.entity';

export interface ITaskRepository {
  /**
   * Create new task assigned by teacher
   */
  createTask(input: CreateTaskInput, teacherId: string): Promise<TaskResponse>;

  /**
   * Get task by ID
   */
  getTaskById(id: string): Promise<Task | null>;

  /**
   * Get all tasks for a student
   */
  getStudentTasks(studentId: string): Promise<Task[]>;

  /**
   * Get all tasks assigned by teacher
   */
  getTeacherTasks(teacherId: string): Promise<Task[]>;

  /**
   * Update task
   */
  updateTask(id: string, input: UpdateTaskInput): Promise<TaskResponse>;

  /**
   * Delete task
   */
  deleteTask(id: string): Promise<boolean>;

  /**
   * Get tasks by date range
   */
  getTasksByDateRange(studentId: string, startDate: string, endDate: string): Promise<Task[]>;
}
