import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StudyTimerCard } from "@/components/dashboard/study-timer-card";
import { renderWithProviders } from "@/test/test-utils";
import { qk } from "@/lib/query/keys";
import { useStudyTimerStore } from "@/modules/study-tasks/store/study-timer.store";
import type { Task } from "@/lib/types";

const logStudyMutate = vi.fn();

vi.mock("@/modules/study-tasks/hooks/useStudyTasks", () => ({
  useLogStudy: () => ({ mutate: logStudyMutate, isPending: false }),
}));

vi.mock("@/lib/auth-context", () => ({
  useAuth: () => ({
    user: {
      id: "student-1",
      name: "Ogrenci",
      email: "o@edu.com",
      role: "student",
    },
  }),
}));

const baseTask: Task = {
  id: "t1",
  studentId: "student-1",
  teacherId: "",
  dueDate: "2026-08-10",
  subject: "Matematik",
  topic: "Fonksiyonlar",
  questionCount: 50,
  targetHours: 2,
  completedQuestions: 10,
  correctAnswers: 8,
  wrongAnswers: 1,
  emptyAnswers: 1,
  hoursStudied: 1,
  status: "in-progress",
  createdAt: "2026-08-09T00:00:00Z",
  updatedAt: "2026-08-09T00:00:00Z",
};

function resetTimerStore() {
  useStudyTimerStore.setState({
    taskId: null,
    taskLabel: null,
    isRunning: false,
    accumulatedSeconds: 0,
    segmentStartedAt: null,
    hasHydrated: true,
  });
}

describe("StudyTimerCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetTimerStore();
  });

  it("gorev yokken baslat butonu disabled", () => {
    renderWithProviders(<StudyTimerCard tasks={[]} />);
    const btn = screen.getByRole("button", { name: /Başlat/i });
    expect(btn).toBeDisabled();
  });

  it("gorev yoksa uyari ve Gorev Olustur butonu gorunur", () => {
    renderWithProviders(<StudyTimerCard tasks={[]} />);
    expect(
      screen.getAllByText("Önce bir görev oluşturmalısın").length
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: /Görev Oluştur/i })
    ).toHaveAttribute("href", "/dashboard/tasks");
  });

  it("secilen gorevin adi gorunur", () => {
    renderWithProviders(<StudyTimerCard tasks={[baseTask]} />);
    expect(screen.getByText("Matematik")).toBeInTheDocument();
    expect(screen.getByText("Fonksiyonlar")).toBeInTheDocument();
  });

  it("duraklatinca gecen sure logStudy ile goreve yazilir", async () => {
    const user = userEvent.setup();
    const { queryClient } = renderWithProviders(
      <StudyTimerCard tasks={[baseTask]} />
    );

    queryClient.setQueryData(qk.tasks.today("student-1"), [baseTask]);

    act(() => {
      useStudyTimerStore.setState({
        taskId: "t1",
        taskLabel: "Matematik - Fonksiyonlar",
        isRunning: true,
        accumulatedSeconds: 0,
        segmentStartedAt: Date.now() - 60_000,
      });
    });

    await user.click(screen.getByRole("button", { name: /Duraklat/i }));

    expect(logStudyMutate).toHaveBeenCalledTimes(1);
    const payload = logStudyMutate.mock.calls[0][0];
    expect(payload).toMatchObject({
      taskId: "t1",
      correctCount: 8,
      wrongCount: 1,
      emptyCount: 1,
    });
    expect(payload.hours).toBeGreaterThan(1);
  });
});
