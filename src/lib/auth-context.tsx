"use client";

import { createContext, useContext, useMemo, ReactNode } from "react";
import { useAuth as useAuthHook } from "@/modules/auth/hooks/useAuth";
import type { User } from "@/lib/types";
import type { RegisterInput } from "@/modules/auth/types/auth.types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (input: RegisterInput) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyResetToken: (token: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    verifyResetToken,
    resetPassword,
  } = useAuthHook();

  // Context degeri yalnizca gercekten tuketilen alanlardan olusturulur ve
  // `useMemo` ile sabitlenir. `accessToken` bu degerin disinda tutulur; boylece
  // 15 dk'lik token yenilemesi tum `useAuth()` tuketicilerini yeniden render etmez.
  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      register,
      logout,
      forgotPassword,
      verifyResetToken,
      resetPassword,
    }),
    [
      user,
      isLoading,
      login,
      register,
      logout,
      forgotPassword,
      verifyResetToken,
      resetPassword,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
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
