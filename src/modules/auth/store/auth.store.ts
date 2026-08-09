import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UiUserRole } from "@/types/common";
import { roleFromApi } from "@/types/common";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UiUserRole;
  avatar?: string;
  isVerified: boolean;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  setAuth: (
    accessToken: string,
    refreshToken: string,
    user: AuthUser
  ) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
  setUser: (user: AuthUser) => void;
  switchRole: (role: UiUserRole) => void;
}

function apiUserToAuthUser(apiUser: {
  id: string;
  name: string;
  email: string;
  role: number;
  avatar?: string;
  isVerified?: boolean;
}): AuthUser {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    role: roleFromApi(apiUser.role),
    avatar: apiUser.avatar,
    isVerified: apiUser.isVerified ?? false,
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: true,

      setAuth: (accessToken, refreshToken, user) =>
        set({ accessToken, refreshToken, user, isLoading: false }),

      setLoading: (loading) => set({ isLoading: loading }),

      clearAuth: () =>
        set({ user: null, accessToken: null, refreshToken: null, isLoading: false }),

      setUser: (user) => set({ user }),

      switchRole: (role) =>
        set((state) => {
          if (!state.user) return {};
          return { user: { ...state.user, role } };
        }),
    }),
    {
      name: "edc-auth-store",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setLoading(false);
        }
      },
    }
  )
);

export { apiUserToAuthUser };
