"use client";

import { create } from 'zustand';
import { User, UserRole } from '../../types';
import { AuthState, AuthUser, Mode } from '../../slices/auth-types';

const STORAGE_KEY = 'edu_dashboard_users';
const AUTH_KEY = 'edu_dashboard_auth';

const defaultUsers: AuthUser[] = [
  { id: '1', name: 'Admin User', email: 'admin@edu.com', role: 'admin', password: 'admin123' },
  { id: '2', name: 'Ahmet Hoca', email: 'ahmet@edu.com', role: 'teacher', password: 'teacher123' },
  { id: '3', name: 'Elif Ogrenci', email: 'elif@edu.com', role: 'student', password: 'student123' },
  { id: '4', name: 'Mehmet Ogrenci', email: 'mehmet@edu.com', role: 'student', password: 'student123' },
  { id: '5', name: 'Zeynep Ogrenci', email: 'zeynep@edu.com', role: 'student', password: 'student123' },
  { id: '6', name: 'Burak Yilmaz', email: 'burak@edu.com', role: 'student', password: 'student123' },
  { id: '7', name: 'Selin Kaya', email: 'selin@edu.com', role: 'student', password: 'student123' },
];

// AuthState is now defined in lib/store-types/auth.ts

// Auth slice builder
const createAuthSlice = (set: any, get: any) => ({
  mode: 'mock' as Mode,
  setMode: (m: Mode) => set({ mode: m }),
  user: null as User | null,
  isLoading: true,
  init: () => {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEY);
      if (!storedUsers) localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));

      const authData = localStorage.getItem(AUTH_KEY);
      if (authData) set({ user: JSON.parse(authData) });
    } catch (e) {
      // ignore
    } finally {
      set({ isLoading: false });
    }
  },
  login: async (email: string, password: string) => {
    if (get().mode === 'remote') {
      // remote stub: try POST /api/auth/login
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) return { success: false, error: 'Remote auth failed' };
        const user = await res.json();
        set({ user });
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        return { success: true };
      } catch (e) {
        return { success: false, error: 'Remote auth error' };
      }
    }

    const storedUsers = localStorage.getItem(STORAGE_KEY);
    const users: AuthUser[] = storedUsers ? JSON.parse(storedUsers) : defaultUsers;
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      const { password: _p, ...userWithoutPassword } = found;
      set({ user: userWithoutPassword });
      localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword));
      return { success: true };
    }
    return { success: false, error: 'E-posta veya sifre hatali' };
  },
  register: async (name: string, email: string, password: string, role: UserRole) => {
    if (get().mode === 'remote') {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role }),
        });
        if (!res.ok) return { success: false, error: 'Remote register failed' };
        const user = await res.json();
        set({ user });
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        return { success: true };
      } catch (e) {
        return { success: false, error: 'Remote register error' };
      }
    }

    const storedUsers = localStorage.getItem(STORAGE_KEY);
    const users: AuthUser[] = storedUsers ? JSON.parse(storedUsers) : defaultUsers;
    if (users.some((u) => u.email === email)) return { success: false, error: 'Bu e-posta adresi zaten kayitli' };
    const newUser: AuthUser = { id: `user_${Date.now()}`, name, email, role, password };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    const { password: _p, ...userWithoutPassword } = newUser;
    set({ user: userWithoutPassword });
    localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword));
    return { success: true };
  },
  logout: () => {
    set({ user: null });
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch (e) {}
  },
});

export const useAuthStore = create<AuthState>((set: any, get: any) => ({ ...createAuthSlice(set, get) }));
