import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StudyTimerCard } from "@/components/dashboard/study-timer-card";
import { renderWithProviders } from "@/test/test-utils";

const focusMutate = vi.fn();

vi.mock("@/modules/study-tasks/hooks/useStudyTasks", () => ({
  useFocusSessions: () => ({ data: [{ durationMinutes: 30 }] }),
  useCreateFocusSession: () => ({ mutate: focusMutate, isPending: false }),
}));

describe("StudyTimerCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("taskId yokken baslat butonu disabled", () => {
    renderWithProviders(<StudyTimerCard />);
    const btn = screen.getByRole("button", { name: /Başlat/i });
    expect(btn).toBeDisabled();
  });

  it("taskId varken baslat butonu enabled", () => {
    renderWithProviders(<StudyTimerCard taskId="t1" />);
    const btn = screen.getByRole("button", { name: /Başlat/i });
    expect(btn).not.toBeDisabled();
  });

  it("bugunun kayitli focus session'lari toplam sureye eklenir", () => {
    renderWithProviders(<StudyTimerCard taskId="t1" />);
    expect(screen.getAllByText("0s 30dk").length).toBeGreaterThan(0);
  });

  it("manuel sure ekleyip sifirlama focus-session olarak kaydedilir", async () => {
    const user = userEvent.setup();
    renderWithProviders(<StudyTimerCard taskId="t1" />);

    const addInput = screen.getByPlaceholderText("Dakika");
    await user.clear(addInput);
    await user.type(addInput, "15");

    const addBtn = screen.getByRole("button", { name: /Ekle/i });
    await user.click(addBtn);

    const resetBtn = screen.getByRole("button", { name: /Sıfırla/i });
    await user.click(resetBtn);

    expect(focusMutate).toHaveBeenCalledWith({ durationMinutes: 15 });
  });
});
