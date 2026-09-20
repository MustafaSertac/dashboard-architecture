import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "@/lib/api/client";
import { studyTaskService } from "@/modules/study-tasks/services/study-task.service";

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("studyTaskService (CRUD)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("today /study-tasks/today/{studentId} endpoint'ini cagirir", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: [] } });

    await studyTaskService.today("s1");

    expect(apiClient.get).toHaveBeenCalledWith("/study-tasks/today/s1");
  });

  it("upcoming limit param'i ile cagirir", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: [] } });

    await studyTaskService.upcoming("s1", 7);

    expect(apiClient.get).toHaveBeenCalledWith("/study-tasks/upcoming/s1", { params: { limit: 7 } });
  });

  it("byStudentRange startDate/endDate param'leri ile cagirir", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: [] } });

    await studyTaskService.byStudentRange("s1", "2026-08-01", "2026-08-31");

    expect(apiClient.get).toHaveBeenCalledWith("/study-tasks/students/s1", {
      params: { startDate: "2026-08-01", endDate: "2026-08-31" },
    });
  });

  it("create POST /study-tasks endpoint'ini cagirir", async () => {
    const body = { studentId: "s1", lessonId: "", lessonTitle: "Mat", taskType: 0, topicId: "", topicTitle: "Fonk", title: "Mat - Fonk", description: "", targetHours: 1, targetQuestions: 10, dueDate: "2026-08-10" };
    vi.mocked(apiClient.post).mockResolvedValue({ data: { data: { taskId: "t1", ...body } } });

    await studyTaskService.create(body);

    expect(apiClient.post).toHaveBeenCalledWith("/study-tasks", body);
  });

  it("update PUT /study-tasks/update endpoint'ini cagirir", async () => {
    const body = { taskId: "t1", title: "Yeni baslik" };
    vi.mocked(apiClient.put).mockResolvedValue({ data: { data: { taskId: "t1" } } });

    await studyTaskService.update(body);

    expect(apiClient.put).toHaveBeenCalledWith("/study-tasks/update", body);
  });

  it("delete DELETE /study-tasks endpoint'ini body ile cagirir (kritik)", async () => {
    vi.mocked(apiClient.delete).mockResolvedValue({ data: { isSuccess: true } });

    await studyTaskService.delete({ taskId: "t1" });

    expect(apiClient.delete).toHaveBeenCalledWith("/study-tasks", { data: { taskId: "t1" } });
  });

  it("complete POST /study-tasks/complete endpoint'ini cagirir", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { data: { taskId: "t1", isCompleted: true } } });

    await studyTaskService.complete({ taskId: "t1" });

    expect(apiClient.post).toHaveBeenCalledWith("/study-tasks/complete", { taskId: "t1" });
  });

  it("logStudy POST /study-tasks/log-study endpoint'ini cagirir", async () => {
    const body = { taskId: "t1", hours: 1.5, correctCount: 40, wrongCount: 5, emptyCount: 5 };
    vi.mocked(apiClient.post).mockResolvedValue({ data: { data: { taskId: "t1" } } });

    await studyTaskService.logStudy(body);

    expect(apiClient.post).toHaveBeenCalledWith("/study-tasks/log-study", body);
  });
});

describe("studyTaskService (batch + focus)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("completeBatch dogru endpoint ve body ile cagirir", async () => {
    const resp = { completedCount: 2, failedIds: [] };
    vi.mocked(apiClient.post).mockResolvedValue({ data: { data: resp } });

    const result = await studyTaskService.completeBatch(["t1", "t2"]);

    expect(apiClient.post).toHaveBeenCalledWith(
      "/study-tasks/complete/batch",
      { taskIds: ["t1", "t2"] }
    );
    expect(result).toEqual(resp);
  });

  it("createFocusSession dogru endpoint'i cagirir", async () => {
    const session = { id: "f1", taskId: "t1", studentId: "s1", date: "2026-08-17", durationMinutes: 25 };
    vi.mocked(apiClient.post).mockResolvedValue({ data: { data: session } });

    const result = await studyTaskService.createFocusSession("t1", { durationMinutes: 25 });

    expect(apiClient.post).toHaveBeenCalledWith(
      "/study-tasks/t1/focus-session",
      { durationMinutes: 25 }
    );
    expect(result).toEqual(session);
  });

  it("getFocusSessions tarih param'i ile cagirir", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: [] } });

    await studyTaskService.getFocusSessions("t1", "2026-08-17");

    expect(apiClient.get).toHaveBeenCalledWith(
      "/study-tasks/t1/focus-sessions",
      { params: { date: "2026-08-17" } }
    );
  });
});
