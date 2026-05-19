/**
 * LoginUseCase - Business logic for user login
 * Handles validation, repository calls, and response formatting
 */

import { IAuthRepository } from '../repositories/i-auth-repository';
import { LoginCredentials, AuthResponse } from '../entities/user.entity';

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthResponse> {
    // Validation
    if (!credentials.email?.trim()) {
      return {
        user: null as any,
        success: false,
        error: 'E-posta gereklidir',
      };
    }

    if (!credentials.password) {
      return {
        user: null as any,
        success: false,
        error: 'Şifre gereklidir',
      };
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      return {
        user: null as any,
        success: false,
        error: 'Geçerli bir e-posta girin',
      };
    }

    try {
      // Delegate to repository
      const result = await this.authRepository.login(credentials);
      return result;
    } catch (error) {
      return {
        user: null as any,
        success: false,
        error: 'Giriş sırasında hata oluştu',
      };
    }
  }
}
