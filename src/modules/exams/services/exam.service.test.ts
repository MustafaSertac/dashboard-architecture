import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "@/lib/api/client";
import { examService } from "@/modules/exams/services/exam.service";

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("examService (CRUD + trendler)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("list studentId/page/pageSize param'leri ile cagirir", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: { items: [], page: 1, pageSize: 10, totalCount: 0, totalPages: 0 } } });

    await examService.list("s1", 2, 20);

    expect(apiClient.get).toHaveBeenCalledWith("/exams", {
      params: { studentId: "s1", page: 2, pageSize: 20 },
    });
  });

  it("detail ?detailed param'i ile cagirir", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: { id: "e1" } } });

    await examService.getById("e1", true);

    expect(apiClient.get).toHaveBeenCalledWith("/exams/e1", { params: { detailed: true } });
  });

  it("trends studentId/examCode/limit param'leri ile cagirir", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: [] } });

    await examService.trends("s1", 10, 5);

    expect(apiClient.get).toHaveBeenCalledWith("/exams/trends", {
      params: { studentId: "s1", examCode: 10, limit: 5 },
    });
  });

  it("create POST /exams endpoint'ini cagirir", async () => {
    const body = { studentId: "s1", examCode: 10 as const, examName: "TYT 1", examDate: "2026-08-10T00:00:00Z", sections: [] };
    vi.mocked(apiClient.post).mockResolvedValue({ data: { data: { id: "e1" } } });

    await examService.create(body);

    expect(apiClient.post).toHaveBeenCalledWith("/exams", body);
  });

  it("update PUT /exams/{id} endpoint'ini cagirir", async () => {
    const body = { examName: "TYT 2" };
    vi.mocked(apiClient.put).mockResolvedValue({ data: { data: { id: "e1" } } });

    await examService.update("e1", body);

    expect(apiClient.put).toHaveBeenCalledWith("/exams/e1", body);
  });

  it("delete DELETE /exams/{id} endpoint'ini cagirir", async () => {
    vi.mocked(apiClient.delete).mockResolvedValue({ data: { isSuccess: true } });

    await examService.delete("e1");

    expect(apiClient.delete).toHaveBeenCalledWith("/exams/e1");
  });

  it("trendsAll examCode + limit + teacherId parametreleriyle cagirir", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: [] } });

    await examService.trendsAll(10, 10, "teacher-1");

    expect(apiClient.get).toHaveBeenCalledWith("/exams/trends/all", {
      params: { examCode: 10, limit: 10, teacherId: "teacher-1" },
    });
  });

  it("trendsAll teacherId verilmezse parametreye undefined gider", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: [] } });

    await examService.trendsAll(11);

    expect(apiClient.get).toHaveBeenCalledWith("/exams/trends/all", {
      params: { examCode: 11, limit: 10, teacherId: undefined },
    });
  });
});
