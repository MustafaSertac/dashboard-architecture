import { User, UserRole } from '../types';

export type Mode = 'mock' | 'remote';

export type AuthUser = User & { password?: string };

export type AuthState = {
  // mode determines whether to use local mock data or remote API
  mode: Mode;
  setMode: (m: Mode) => void;
  user: User | null;
  isLoading: boolean;
  init: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
};
