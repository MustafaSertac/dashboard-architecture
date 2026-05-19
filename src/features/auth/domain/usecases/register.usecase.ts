/**
 * RegisterUseCase - Business logic for user registration
 * Handles validation, duplicate check, and user creation
 */

import { IAuthRepository } from '../repositories/i-auth-repository';
import { RegisterCredentials, AuthResponse } from '../entities/user.entity';

export class RegisterUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(credentials: RegisterCredentials): Promise<AuthResponse> {
    // Validation - Name
    if (!credentials.name?.trim()) {
      return {
        user: null as any,
        success: false,
        error: 'Ad gereklidir',
      };
    }

    // Validation - Email
    if (!credentials.email?.trim()) {
      return {
        user: null as any,
        success: false,
        error: 'E-posta gereklidir',
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      return {
        user: null as any,
        success: false,
        error: 'Geçerli bir e-posta girin',
      };
    }

    // Validation - Password
    if (!credentials.password) {
      return {
        user: null as any,
        success: false,
        error: 'Şifre gereklidir',
      };
    }

    if (credentials.password.length < 6) {
      return {
        user: null as any,
        success: false,
        error: 'Şifre en az 6 karakter olmalıdır',
      };
    }

    // Validation - Password match
    if (credentials.password !== credentials.confirmPassword) {
      return {
        user: null as any,
        success: false,
        error: 'Şifreler eşleşmiyor',
      };
    }

    // Check if user already exists
    try {
      const userExists = await this.authRepository.validateUserExists(credentials.email);
      if (userExists) {
        return {
          user: null as any,
          success: false,
          error: 'Bu e-posta adresi zaten kayıtlı',
        };
      }
    } catch (error) {
      return {
        user: null as any,
        success: false,
        error: 'Kontrol sırasında hata oluştu',
      };
    }

    try {
      // Delegate to repository
      const result = await this.authRepository.register(credentials);
      return result;
    } catch (error) {
      return {
        user: null as any,
        success: false,
        error: 'Kayıt sırasında hata oluştu',
      };
    }
  }
}
