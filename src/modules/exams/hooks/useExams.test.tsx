import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";
import { useExamTrendsAll } from "./useExams";
import { examService } from "@/modules/exams/services/exam.service";
import type { StudentTrendDTO } from "@/modules/exams/types/exam.types";

vi.mock("@/modules/exams/services/exam.service", () => ({
  examService: { trendsAll: vi.fn() },
}));

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return createElement(QueryClientProvider, { client }, children);
}

describe("useExamTrendsAll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exams null/bos olan ogrencileri bos diziye cevirir (query cokmez)", async () => {
    vi.mocked(examService.trendsAll).mockResolvedValue([
      { studentId: "s1", studentName: "Ali", exams: null },
      { studentId: "s2", studentName: "Ayse", exams: [] },
    ] as unknown as StudentTrendDTO[]);

    const { result } = renderHook(() => useExamTrendsAll(10, "teacher-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([
      { studentId: "s1", studentName: "Ali", exams: [] },
      { studentId: "s2", studentName: "Ayse", exams: [] },
    ]);
  });
});
