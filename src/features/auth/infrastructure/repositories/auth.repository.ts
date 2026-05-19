/**
 * AuthRepository - Concrete Implementation
 * Uses localStorage for mock persistence
 * In production, replace with API calls
 */

import { IAuthRepository } from '../../domain/repositories/i-auth-repository';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../../domain/entities/user.entity';

const STORAGE_KEY = 'edu_dashboard_users';
const AUTH_KEY = 'edu_dashboard_auth';

interface StoredUser extends User {
  password: string;
}

export class AuthRepository implements IAuthRepository {
  private defaultUsers: StoredUser[] = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@edu.com',
      role: 'admin',
      password: 'admin123',
    },
    {
      id: '2',
      name: 'Ahmet Hoca',
      email: 'ahmet@edu.com',
      role: 'teacher',
      password: 'teacher123',
    },
    {
      id: '3',
      name: 'Elif Ogrenci',
      email: 'elif@edu.com',
      role: 'student',
      password: 'student123',
    },
    {
      id: '4',
      name: 'Mehmet Ogrenci',
      email: 'mehmet@edu.com',
      role: 'student',
      password: 'student123',
    },
    {
      id: '5',
      name: 'Zeynep Ogrenci',
      email: 'zeynep@edu.com',
      role: 'student',
      password: 'student123',
    },
    {
      id: '6',
      name: 'Burak Yilmaz',
      email: 'burak@edu.com',
      role: 'student',
      password: 'student123',
    },
    {
      id: '7',
      name: 'Selin Kaya',
      email: 'selin@edu.com',
      role: 'student',
      password: 'student123',
    },
  ];

  constructor() {
    this.initializeStorage();
  }

  private initializeStorage(): void {
    if (typeof window === 'undefined') return; // SSR safety

    const storedUsers = localStorage.getItem(STORAGE_KEY);
    if (!storedUsers) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.defaultUsers));
    }
  }

  private getStoredUsers(): StoredUser[] {
    if (typeof window === 'undefined') return this.defaultUsers;

    const storedUsers = localStorage.getItem(STORAGE_KEY);
    return storedUsers ? JSON.parse(storedUsers) : this.defaultUsers;
  }

  private saveUsers(users: StoredUser[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const users = this.getStoredUsers();
    const foundUser = users.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );

    if (!foundUser) {
      return {
        user: null,
        success: false,
        error: 'E-posta veya şifre hatalı',
      };
    }

    const userWithoutPassword = this.excludePassword(foundUser);
    this.setCurrentUser(userWithoutPassword);

    return {
      user: userWithoutPassword,
      success: true,
    };
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const users = this.getStoredUsers();

    // Check if email already exists
    if (users.some((u) => u.email === credentials.email)) {
      return {
        user: null,
        success: false,
        error: 'Bu e-posta adresi zaten kayıtlı',
      };
    }

    const newUser: StoredUser = {
      id: `user_${Date.now()}`,
      name: credentials.name,
      email: credentials.email,
      role: credentials.role,
      password: credentials.password,
    };

    users.push(newUser);
    this.saveUsers(users);

    const userWithoutPassword = this.excludePassword(newUser);
    this.setCurrentUser(userWithoutPassword);

    return {
      user: userWithoutPassword,
      success: true,
    };
  }

  async getCurrentUser(): Promise<User | null> {
    if (typeof window === 'undefined') return null;

    const authData = localStorage.getItem(AUTH_KEY);
    if (!authData) return null;

    try {
      const user = JSON.parse(authData);
      return user;
    } catch {
      return null;
    }
  }

  async logout(): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_KEY);
  }

  async validateUserExists(email: string): Promise<boolean> {
    const users = this.getStoredUsers();
    return users.some((u) => u.email === email);
  }

  private excludePassword(user: StoredUser): User {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private setCurrentUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  }
}
