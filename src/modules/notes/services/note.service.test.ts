import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "@/lib/api/client";
import { noteService } from "@/modules/notes/services/note.service";

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("noteService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("list dogru endpoint'i cagirir", async () => {
    const notes = [{ id: "n1", studentId: "s1", teacherId: "t1", category: "feedback", note: "iyi", createdAt: "2026-08-17T00:00:00Z" }];
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: notes } });

    const result = await noteService.list("s1");

    expect(apiClient.get).toHaveBeenCalledWith("/students/s1/notes");
    expect(result).toEqual(notes);
  });

  it("create dogru endpoint ve body ile cagirir (teacherId body'ye konmaz)", async () => {
    const created = { id: "n1", studentId: "s1", teacherId: "t1", category: "feedback", note: "iyi", createdAt: "2026-08-17T00:00:00Z" };
    vi.mocked(apiClient.post).mockResolvedValue({ data: { data: created } });

    const result = await noteService.create("s1", "t1", { category: "feedback", note: "iyi" });

    expect(apiClient.post).toHaveBeenCalledWith(
      "/students/s1/notes",
      { category: "feedback", note: "iyi" }
    );
    expect(result).toEqual(created);
  });

  it("delete dogru endpoint'i cagirir", async () => {
    vi.mocked(apiClient.delete).mockResolvedValue({ data: { isSuccess: true } });

    await noteService.delete("s1", "n1");

    expect(apiClient.delete).toHaveBeenCalledWith("/students/s1/notes/n1");
  });
});
