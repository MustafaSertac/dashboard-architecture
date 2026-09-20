import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TeacherActions } from "@/components/teacher/teacher-actions";
import { renderWithProviders } from "@/test/test-utils";

const bulkCompleteMutate = vi.fn();

vi.mock("@/components/tasks/task-modal", () => ({
  TaskModal: () => null,
}));

vi.mock("@/components/teacher/note-modal", () => ({
  NoteModal: () => null,
}));

vi.mock("@/modules/study-tasks/hooks/useStudyTasks", () => ({
  useTodayTasks: () => ({
    data: [
      { id: "t1", status: "pending" },
      { id: "t2", status: "completed" },
    ],
  }),
  useBulkCompleteTasks: () => ({
    mutate: bulkCompleteMutate,
    isPending: false,
  }),
}));

vi.mock("@/lib/auth-context", () => ({
  useAuth: () => ({
    user: { id: "t1", name: "Ahmet", email: "ahmet@edu.com", role: "teacher" },
  }),
}));

describe("TeacherActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Toplu Onayla tamamlanmamis task id'lerini gonderir", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <TeacherActions studentId="s1" viewType="daily" />
    );

    const btn = screen.getByRole("button", { name: /Toplu Onayla/i });
    await user.click(btn);

    expect(bulkCompleteMutate).toHaveBeenCalledWith(
      ["t1"],
      expect.any(Object)
    );
  });
});
