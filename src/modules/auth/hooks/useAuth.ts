"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { authService } from "@/modules/auth/services/auth.service";
import type { UiUserRole } from "@/types/common";
import { roleFromApi } from "@/types/common";

export function useAuth() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setUser = useAuthStore((s) => s.setUser);
  const switchRole = useAuthStore((s) => s.switchRole);
  const accessToken = useAuthStore((s) => s.accessToken);

  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const data = await authService.login({ email, password });

        const authUser = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: roleFromApi(data.user.role),
          avatar: data.user.avatar,
          isVerified: data.user.isVerified,
        };

        setAuth(data.accessToken, data.refreshToken, authUser);
        return { success: true };
      } catch (error: unknown) {
        const msg =
          error instanceof Error
            ? error.message
            : "Giris basarisiz";
        return { success: false, error: msg };
      }
    },
    [setAuth]
  );

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      phoneNumber: string,
      role: UiUserRole
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        let data;
        if (role === "teacher") {
          data = await authService.registerTeacher({
            name,
            email,
            password,
            phoneNumber,
          });
        } else {
          data = await authService.registerStudent({
            name,
            email,
            password,
            phoneNumber,
          });
        }

        const authUser = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: roleFromApi(data.user.role),
          avatar: data.user.avatar,
          isVerified: data.user.isVerified,
        };

        setAuth(data.accessToken, data.refreshToken, authUser);
        return { success: true };
      } catch (error: unknown) {
        const msg =
          error instanceof Error
            ? error.message
            : "Kayit basarisiz";
        return { success: false, error: msg };
      }
    },
    [setAuth]
  );

  const logout = useCallback(async () => {
    try {
      const storedRefreshToken = useAuthStore.getState().refreshToken;
      if (storedRefreshToken) {
        await authService.logout({ refreshToken: storedRefreshToken });
      }
    } catch {
      // ignore logout errors
    }
    clearAuth();
    router.push("/login");
  }, [clearAuth, router]);

  // BACKEND #9 (Dusuk) TAMAMLANDI: 3-adimli sifirlama akisi.
  const forgotPassword = useCallback(
    async (email: string): Promise<{ success: boolean; error?: string }> => {
      try {
        await authService.forgotPasswordRequest({ email });
        return { success: true };
      } catch (error: unknown) {
        const msg =
          error instanceof Error ? error.message : "Sifre sifirlama basarisiz";
        return { success: false, error: msg };
      }
    },
    []
  );

  const verifyResetToken = useCallback(
    async (token: string): Promise<boolean> => {
      try {
        const res = await authService.forgotPasswordVerify({ token });
        return res.valid;
      } catch {
        return false;
      }
    },
    []
  );

  const resetPassword = useCallback(
    async (
      token: string,
      newPassword: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        await authService.forgotPasswordReset({ token, newPassword });
        return { success: true };
      } catch (error: unknown) {
        const msg =
          error instanceof Error ? error.message : "Sifre sifirlama basarisiz";
        return { success: false, error: msg };
      }
    },
    []
  );

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    verifyResetToken,
    resetPassword,
    setUser,
    switchRole,
    accessToken,
  };
}
