import create from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";

type Mode = "mock" | "remote";

interface AuthState {
  user: User | null;
  token?: string;
  mode: Mode;
  login: (user: User, token?: string) => void;
  logout: () => void;
  setMode: (m: Mode) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: undefined,
      mode: "mock",
      login: (user: User, token?: string) => set({ user, token }),
      logout: () => set({ user: null, token: undefined }),
      setMode: (mode: Mode) => set({ mode }),
    }),
    { name: "app_auth" }
  )
);
