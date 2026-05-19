/**
 * GetCurrentUserUseCase - Business logic for retrieving current user
 */

import { IAuthRepository } from '../repositories/i-auth-repository';
import { User } from '../entities/user.entity';

export class GetCurrentUserUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(): Promise<User | null> {
    try {
      const user = await this.authRepository.getCurrentUser();
      return user;
    } catch (error) {
      // Return null if any error occurs
      return null;
    }
  }
}
