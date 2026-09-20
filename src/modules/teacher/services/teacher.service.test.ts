import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "@/lib/api/client";
import { teacherService } from "@/modules/teacher/services/teacher.service";

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("teacherService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("listByTeacher dogru route'u teacherId ile cagirir", async () => {
    const mockData = [{ id: "1", name: "Elif", email: "elif@edu.com" }];
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: mockData } });

    const result = await teacherService.listByTeacher("teacher-guid");

    expect(apiClient.get).toHaveBeenCalledWith(
      "/teachers/teacher-guid/students"
    );
    expect(result).toEqual(mockData);
  });

  it("addStudent POST /teachers/{teacherId}/students endpoint'ini cagirir", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { isSuccess: true } });

    await teacherService.addStudent("teacher-1", "student-1");

    expect(apiClient.post).toHaveBeenCalledWith(
      "/teachers/teacher-1/students",
      { studentId: "student-1" }
    );
  });

  it("removeStudent DELETE /teachers/{teacherId}/students/{studentId} endpoint'ini cagirir", async () => {
    vi.mocked(apiClient.delete).mockResolvedValue({ data: { isSuccess: true } });

    await teacherService.removeStudent("teacher-1", "student-1");

    expect(apiClient.delete).toHaveBeenCalledWith(
      "/teachers/teacher-1/students/student-1"
    );
  });
});
