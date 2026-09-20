import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NoteModal } from "@/components/teacher/note-modal";
import { renderWithProviders } from "@/test/test-utils";

const toastError = vi.fn();
const toastSuccess = vi.fn();

vi.mock("sonner", () => ({
  toast: {
    error: (...args: unknown[]) => toastError(...args),
    success: (...args: unknown[]) => toastSuccess(...args),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock("@/modules/notes/hooks/useNotes", () => ({
  useCreateNote: () => ({
    mutate: vi.fn((_data: unknown, opts?: { onSuccess?: () => void }) => {
      opts?.onSuccess?.();
    }),
    isPending: false,
  }),
}));

vi.mock("@/lib/auth-context", () => ({
  useAuth: () => ({
    user: { id: "t1", name: "Ahmet", email: "ahmet@edu.com", role: "teacher" },
  }),
}));

describe("NoteModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("not girilmeden submit edilirse hata toast gosterir", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <NoteModal open onOpenChange={() => {}} studentId="s1" />
    );

    const saveBtn = screen.getByRole("button", { name: /Kaydet/i });
    await user.click(saveBtn);

    expect(toastError).toHaveBeenCalledWith("Lutfen bir not girin");
  });

  it("not girilirse createNote cagirilir ve toast gosterilir", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <NoteModal open onOpenChange={() => {}} studentId="s1" />
    );

    const textarea = screen.getByPlaceholderText(/Notunuzu buraya yazin/i);
    await user.type(textarea, "Bu bir test notu");

    const saveBtn = screen.getByRole("button", { name: /Kaydet/i });
    await user.click(saveBtn);

    expect(toastSuccess).toHaveBeenCalledWith("Not basariyla eklendi");
  });
});
