export type UiUserRole = "admin" | "teacher" | "student";

export const API_ROLE_MAP: Record<number, UiUserRole> = {
  0: "admin",
  1: "teacher",
  2: "student",
} as const;

export const UI_ROLE_TO_API: Record<UiUserRole, number> = {
  admin: 0,
  teacher: 1,
  student: 2,
} as const;

export function roleFromApi(n: number): UiUserRole {
  return API_ROLE_MAP[n] ?? "student";
}

export function roleToApi(r: UiUserRole): number {
  return UI_ROLE_TO_API[r];
}

export type ExamCode = 10 | 11;
export const EXAM_CODE = { TYT: 10, AYT: 11, Both: 12 } as const;

export enum ExamStatus {
  Draft = 0,
  Submitted = 1,
  Completed = 2,
  Archived = 3,
}

export enum Gender {
  Male = 0,
  Female = 1,
}

export function examCodeToExamType(code: number): "TYT" | "AYT" {
  return code === 10 ? "TYT" : "AYT";
}

export function examTypeToExamCode(t: "TYT" | "AYT"): ExamCode {
  return t === "TYT" ? 10 : 11;
}

export type UiExamType = "TYT" | "AYT";

export interface ApiResponse<T> {
  isSuccess: boolean;
  data?: T;
  error?: ApiErrorDetail;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: string[];
}

export interface UnhandledError {
  traceId: string;
  message: string;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
