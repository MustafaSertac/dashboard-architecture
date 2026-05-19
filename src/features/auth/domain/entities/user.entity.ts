/**
 * User Entity - Auth Domain
 * Core user model with role-based access
 */

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  role: UserRole;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  success: boolean;
  error?: string;
}
