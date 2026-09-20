import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "@/lib/api/client";
import { lessonService } from "@/modules/lessons/services/lesson.service";

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("lessonService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("list GET /lessons endpoint'ini cagirir", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: [] } });

    await lessonService.list(10);

    expect(apiClient.get).toHaveBeenCalledWith("/lessons", { params: { examType: 10 } });
  });

  it("list examType olmadan cagirir", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: [] } });

    await lessonService.list();

    expect(apiClient.get).toHaveBeenCalledWith("/lessons", { params: {} });
  });

  it("getById GET /lessons/{id} endpoint'ini cagirir", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: { id: "l1" } } });

    await lessonService.getById("l1");

    expect(apiClient.get).toHaveBeenCalledWith("/lessons/l1");
  });

  it("create POST /lessons endpoint'ini cagirir", async () => {
    const body = { name: "Mat", code: 11, examTypes: [10, 11] };
    vi.mocked(apiClient.post).mockResolvedValue({ data: { data: { id: "l1" } } });

    await lessonService.create(body);

    expect(apiClient.post).toHaveBeenCalledWith("/lessons", body);
  });

  it("update PUT /lessons/{id} endpoint'ini cagirir", async () => {
    vi.mocked(apiClient.put).mockResolvedValue({ data: { data: { id: "l1" } } });

    await lessonService.update("l1", { name: "Matematik" });

    expect(apiClient.put).toHaveBeenCalledWith("/lessons/l1", { name: "Matematik" });
  });

  it("delete DELETE /lessons/{id} endpoint'ini cagirir", async () => {
    vi.mocked(apiClient.delete).mockResolvedValue({ data: { isSuccess: true } });

    await lessonService.delete("l1");

    expect(apiClient.delete).toHaveBeenCalledWith("/lessons/l1");
  });

  it("getUnits GET /lessons/{id}/units endpoint'ini cagirir", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: [] } });

    await lessonService.getUnits("l1");

    expect(apiClient.get).toHaveBeenCalledWith("/lessons/l1/units");
  });

  it("createUnit POST /lessons/{id}/units endpoint'ini cagirir", async () => {
    const body = { code: 201, name: "Fonksiyonlar", order: 1, examTypes: [10] };
    vi.mocked(apiClient.post).mockResolvedValue({ data: { data: { id: "u1" } } });

    await lessonService.createUnit("l1", body);

    expect(apiClient.post).toHaveBeenCalledWith("/lessons/l1/units", body);
  });

  it("updateUnit PUT /units/{id} endpoint'ini cagirir", async () => {
    vi.mocked(apiClient.put).mockResolvedValue({ data: { data: { id: "u1" } } });

    await lessonService.updateUnit("u1", { name: "Limit" });

    expect(apiClient.put).toHaveBeenCalledWith("/units/u1", { name: "Limit" });
  });

  it("deleteUnit DELETE /units/{id} endpoint'ini cagirir", async () => {
    vi.mocked(apiClient.delete).mockResolvedValue({ data: { isSuccess: true } });

    await lessonService.deleteUnit("u1");

    expect(apiClient.delete).toHaveBeenCalledWith("/units/u1");
  });

  it("getTopics GET /units/{id}/topics endpoint'ini cagirir", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: [] } });

    await lessonService.getTopics("u1");

    expect(apiClient.get).toHaveBeenCalledWith("/units/u1/topics");
  });

  it("createTopic POST /units/{id}/topics endpoint'ini cagirir", async () => {
    const body = { topicCode: 1041, name: "Paragraf", order: 0, examTypes: [10] };
    vi.mocked(apiClient.post).mockResolvedValue({ data: { data: { id: "t1" } } });

    await lessonService.createTopic("u1", body);

    expect(apiClient.post).toHaveBeenCalledWith("/units/u1/topics", body);
  });

  it("updateTopic PUT /topics/{id} endpoint'ini cagirir", async () => {
    vi.mocked(apiClient.put).mockResolvedValue({ data: { data: { id: "t1" } } });

    await lessonService.updateTopic("t1", { name: "Cumle" });

    expect(apiClient.put).toHaveBeenCalledWith("/topics/t1", { name: "Cumle" });
  });

  it("deleteTopic DELETE /topics/{id} endpoint'ini cagirir", async () => {
    vi.mocked(apiClient.delete).mockResolvedValue({ data: { isSuccess: true } });

    await lessonService.deleteTopic("t1");

    expect(apiClient.delete).toHaveBeenCalledWith("/topics/t1");
  });
});
