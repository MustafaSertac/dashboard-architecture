import { ApiResponse } from "@/types/common";

export function isApiResponse(data: unknown): data is ApiResponse<unknown> {
  return (
    typeof data === "object" &&
    data !== null &&
    "isSuccess" in data
  );
}

export function unwrapEnvelope<T>(response: ApiResponse<T>): T {
  if (!response.isSuccess || response.error) {
    throw new Error(response.error?.message ?? "Beklenmeyen bir hata olustu");
  }
  return response.data as T;
}
