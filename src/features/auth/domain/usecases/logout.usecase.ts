/**
 * LogoutUseCase - Business logic for user logout
 */

import { IAuthRepository } from '../repositories/i-auth-repository';

export class LogoutUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(): Promise<void> {
    try {
      await this.authRepository.logout();
    } catch (error) {
      // Even if logout fails, we might want to clear local state
      // Throw error to let caller decide how to handle
      throw new Error('Çıkış sırasında hata oluştu');
    }
  }
}
