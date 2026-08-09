import { env } from "@/config/env";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { ApiError } from "@/lib/api/error";
import { ApiResponse, UnhandledError } from "@/types/common";
import { endpoints } from "@/lib/api/endpoints";

export const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });
  failedQueue = [];
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const data = response.data as ApiResponse<unknown>;

    if (data && typeof data === "object" && "isSuccess" in data) {
      if (!data.isSuccess && data.error) {
        throw new ApiError(
          data.error.code,
          data.error.message,
          response.status,
          data.error.details
        );
      }
    }

    const unhandledData = response.data as UnhandledError;
    if (
      unhandledData &&
      "traceId" in unhandledData &&
      !("isSuccess" in unhandledData)
    ) {
      throw new ApiError(
        "ERR_UNHANDLED",
        unhandledData.message ?? "Beklenmeyen sunucu hatasi",
        response.status
      );
    }

    return response;
  },
  async (error: AxiosError<ApiResponse<unknown> | UnhandledError>) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const storedRefreshToken = useAuthStore.getState().refreshToken;
          if (!storedRefreshToken) throw new Error("No refresh token");

          const response = await axios.post(
            `${env.API_BASE_URL}${endpoints.auth.refreshToken}`,
            { refreshToken: storedRefreshToken }
          );

          const authData = response.data as ApiResponse<{
            accessToken: string;
            refreshToken: string;
          }>;

          if (authData.isSuccess && authData.data) {
            const newAccessToken = authData.data.accessToken;
            const newRefreshToken = authData.data.refreshToken;

            useAuthStore.setState({
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            });

            processQueue(null, newAccessToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            return apiClient(originalRequest);
          } else {
            throw new Error("Token refresh failed");
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          useAuthStore.getState().clearAuth();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          throw refreshError;
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    if (error.response) {
      const data = error.response.data;

      if (data && typeof data === "object" && "error" in data && data.error) {
        const apiErr = data.error as { code: string; message: string; details?: string[] };
        throw new ApiError(
          apiErr.code,
          apiErr.message,
          error.response.status,
          apiErr.details
        );
      }

      throw new ApiError(
        `ERR_HTTP_${error.response.status}`,
        error.message,
        error.response.status
      );
    }

    throw error;
  }
);
