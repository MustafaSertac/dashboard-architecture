"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "./types";

interface AuthUser extends User {
  password?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database (in real app, this would be in a database)
const STORAGE_KEY = "edu_dashboard_users";
const AUTH_KEY = "edu_dashboard_auth";

const defaultUsers: AuthUser[] = [
  { id: "1", name: "Admin User", email: "admin@edu.com", role: "admin", password: "admin123" },
  { id: "2", name: "Ahmet Hoca", email: "ahmet@edu.com", role: "teacher", password: "teacher123" },
  { id: "3", name: "Ali Ogrenci", email: "ali@edu.com", role: "student", password: "student123" },
  { id: "4", name: "Ayse Ogrenci", email: "ayse@edu.com", role: "student", password: "student123" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize users in localStorage if not exists
    const storedUsers = localStorage.getItem(STORAGE_KEY);
    if (!storedUsers) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
    }

    // Check for existing session
    const authData = localStorage.getItem(AUTH_KEY);
    if (authData) {
      const parsedUser = JSON.parse(authData);
      setUser(parsedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const storedUsers = localStorage.getItem(STORAGE_KEY);
    const users: AuthUser[] = storedUsers ? JSON.parse(storedUsers) : defaultUsers;

    const foundUser = users.find((u) => u.email === email && u.password === password);

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword));
      return { success: true };
    }

    return { success: false, error: "E-posta veya sifre hatali" };
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    const storedUsers = localStorage.getItem(STORAGE_KEY);
    const users: AuthUser[] = storedUsers ? JSON.parse(storedUsers) : defaultUsers;

    // Check if email already exists
    if (users.some((u) => u.email === email)) {
      return { success: false, error: "Bu e-posta adresi zaten kayitli" };
    }

    const newUser: AuthUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      role,
      password,
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
