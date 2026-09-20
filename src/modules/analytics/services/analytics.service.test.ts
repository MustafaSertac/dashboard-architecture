import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "@/lib/api/client";
import { analyticsService } from "@/modules/analytics/services/analytics.service";

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("analyticsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("weekly studentId/weekStart param'leri ile cagirir", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: {} } });

    await analyticsService.weekly("s1", "2026-08-03");

    expect(apiClient.get).toHaveBeenCalledWith("/analytics/weekly", {
      params: { studentId: "s1", weekStart: "2026-08-03" },
    });
  });

  it("monthly perSubject=false varsayilan ile cagirir", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: {} } });

    await analyticsService.monthly("s1", 2026, 8);

    expect(apiClient.get).toHaveBeenCalledWith("/analytics/monthly", {
      params: { studentId: "s1", year: 2026, month: 8, perSubject: false },
    });
  });

  it("monthly perSubject=true param'i gonderir", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: {} } });

    await analyticsService.monthly("s1", 2026, 8, true);

    expect(apiClient.get).toHaveBeenCalledWith("/analytics/monthly", {
      params: { studentId: "s1", year: 2026, month: 8, perSubject: true },
    });
  });

  it("yearly perSubject param'i gonderir", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: {} } });

    await analyticsService.yearly("s1", 2026, true);

    expect(apiClient.get).toHaveBeenCalledWith("/analytics/yearly", {
      params: { studentId: "s1", year: 2026, perSubject: true },
    });
  });

  it("dashboard studentId param'i ile cagirir", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: {} } });

    await analyticsService.dashboard("s1");

    expect(apiClient.get).toHaveBeenCalledWith("/analytics/dashboard", {
      params: { studentId: "s1" },
    });
  });
});
