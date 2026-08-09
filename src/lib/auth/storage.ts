import { env } from "@/config/env";

export const authStorage = {
  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(env.ACCESS_TOKEN_KEY);
  },

  setAccessToken(token: string): void {
    localStorage.setItem(env.ACCESS_TOKEN_KEY, token);
  },

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(env.REFRESH_TOKEN_KEY);
  },

  setRefreshToken(token: string): void {
    localStorage.setItem(env.REFRESH_TOKEN_KEY, token);
  },

  clear(): void {
    localStorage.removeItem(env.ACCESS_TOKEN_KEY);
    localStorage.removeItem(env.REFRESH_TOKEN_KEY);
    localStorage.removeItem(env.AUTH_USER_KEY);
  },
};
