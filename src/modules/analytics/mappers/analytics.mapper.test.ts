import { describe, it, expect } from "vitest";
import { mapMonthlyAnalytics } from "@/modules/analytics/mappers/analytics.mapper";
import type { MonthlyAnalyticsDTO } from "@/modules/analytics/types/analytics.types";

describe("mapMonthlyAnalytics", () => {
  it("perSubjectStats dogrudan kullanir", () => {
    const dto: MonthlyAnalyticsDTO = {
      year: 2026,
      month: 8,
      summary: { totalHours: 10, totalQuestions: 100, completedCount: 5, pendingCount: 2 },
      courses: [],
      perSubjectStats: [
        { subject: "Matematik", totalHours: 6, totalQuestions: 60, completedCount: 3, pendingCount: 1 },
        { subject: "Fizik", totalHours: 4, totalQuestions: 40, completedCount: 2, pendingCount: 1 },
      ],
    };

    const result = mapMonthlyAnalytics(dto);

    expect(result.subjectStats).toHaveLength(2);
    expect(result.subjectStats[0].subject).toBe("Matematik");
    expect(result.subjectStats[0].totalHours).toBe(6);
  });

  it("perSubjectStats yoksa bos array doner", () => {
    const dto: MonthlyAnalyticsDTO = {
      year: 2026,
      month: 8,
      summary: { totalHours: 10, totalQuestions: 100, completedCount: 5, pendingCount: 2 },
      courses: [
        {
          course: "Matematik",
          branches: [
            {
              branch: "Temel",
              totalQuestions: 60,
              totalMistakes: 10,
              topics: [{ name: "Fonksiyonlar", questions: 30, mistakes: 5 }],
            },
          ],
        },
      ],
    };

    const result = mapMonthlyAnalytics(dto);
    expect(result.subjectStats).toEqual([]);
  });
});
