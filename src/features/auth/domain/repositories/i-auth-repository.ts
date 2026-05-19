/**
 * IAuthRepository - Contract for authentication operations
 * Implementation will handle localStorage, API calls, etc.
 * NO concrete implementations here - interface only
 */

import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../entities/user.entity';

export interface IAuthRepository {
  /**
   * Authenticate user with email and password
   */
  login(credentials: LoginCredentials): Promise<AuthResponse>;

  /**
   * Register new user
   */
  register(credentials: RegisterCredentials): Promise<AuthResponse>;

  /**
   * Get current authenticated user
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Logout current user
   */
  logout(): Promise<void>;

  /**
   * Validate if user exists
   */
  validateUserExists(email: string): Promise<boolean>;
}
