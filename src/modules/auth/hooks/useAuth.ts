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
      role: UiUserRole
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        let data;
        if (role === "teacher") {
          data = await authService.registerTeacher({
            name,
            email,
            password,
          });
        } else {
          data = await authService.registerStudent({
            name,
            email,
            password,
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

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    setUser,
    switchRole,
    accessToken,
  };
}
