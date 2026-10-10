import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StudentLessonsView } from "@/components/teacher/student-lessons-view";
import { renderWithProviders } from "@/test/test-utils";

const setMutate = vi.fn();

vi.mock("@/modules/lessons/hooks/useLessons", () => ({
  useLessons: () => ({
    data: [
      { id: "l1", name: "Matematik", isActive: true, examTypes: [10], unitCount: 3 },
      { id: "l2", name: "Fizik", isActive: true, examTypes: [11], unitCount: 2 },
    ],
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
  useStudentLessons: () => ({
    data: [
      {
        id: "sl1",
        teacherId: "t1",
        studentId: "s1",
        lessonId: "l1",
        lessonCode: 11,
        createdAt: "",
      },
    ],
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
  useSetStudentLessons: () => ({ mutate: setMutate, isPending: false }),
}));

vi.mock("@/lib/auth-context", () => ({
  useAuth: () => ({
    user: { id: "t1", name: "Ahmet", email: "a@edu.com", role: "teacher" },
  }),
}));

describe("StudentLessonsView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("kaydedince atanmis ders id'lerini gonderir", async () => {
    const user = userEvent.setup();
    renderWithProviders(<StudentLessonsView studentId="s1" />);

    await user.click(screen.getByRole("button", { name: /Kaydet/i }));

    expect(setMutate).toHaveBeenCalledWith(["l1"], expect.any(Object));
  });

  it("yeni ders secilince listeye eklenir", async () => {
    const user = userEvent.setup();
    renderWithProviders(<StudentLessonsView studentId="s1" />);

    const boxes = screen.getAllByRole("checkbox");
    await user.click(boxes[1]); // l2 (Fizik)

    await user.click(screen.getByRole("button", { name: /Kaydet/i }));

    const ids = setMutate.mock.calls[0][0] as string[];
    expect(ids).toContain("l1");
    expect(ids).toContain("l2");
  });
});
