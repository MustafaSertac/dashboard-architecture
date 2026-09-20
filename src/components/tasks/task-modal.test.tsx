import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TaskModal } from "@/components/tasks/task-modal";
import { renderWithProviders } from "@/test/test-utils";

const createTaskMutate = vi.fn();

vi.mock("@/modules/study-tasks/hooks/useStudyTasks", () => ({
  useCreateTask: () => ({ mutate: createTaskMutate, isPending: false }),
  useUpdateTask: () => ({ mutate: vi.fn(), isPending: false }),
  useTasksByRange: () => ({ data: [] }),
  useTodayTasks: () => ({ data: [] }),
  useUpcomingTasks: () => ({ data: [] }),
}));

vi.mock("@/modules/teacher/hooks/useTeacher", () => ({
  useTeacherStudents: () => ({ data: [] }),
}));

const mockLessons = [
  { id: "lesson-mat", name: "Matematik", code: 11, isActive: true, examTypes: [10], unitCount: 1, createdAt: "" },
];
const mockUnits = [
  { id: "unit-1", lessonCode: 11, code: 201, name: "Fonksiyonlar", order: 1, isActive: true, examTypes: [10], topicCount: 1, createdAt: "" },
];
const mockTopics = [
  { id: "topic-1", unitCode: 201, topicCode: 1101, name: "Fonksiyon Grafigi", order: 0, isActive: true, examTypes: [10], createdAt: "" },
];

vi.mock("@/modules/lessons/hooks/useLessons", () => ({
  useLessons: () => ({ data: mockLessons, isLoading: false }),
  useUnits: () => ({ data: mockUnits, isLoading: false }),
  useTopics: () => ({ data: mockTopics, isLoading: false }),
}));

vi.mock("@/lib/auth-context", () => ({
  useAuth: () => ({
    user: { id: "teacher-1", name: "Ahmet", email: "ahmet@edu.com", role: "teacher" },
  }),
}));

describe("TaskModal (gerçek veri)", () => {
  it("modal render olur ve ders/ünite/konu alanları görünür", () => {
    renderWithProviders(
      <TaskModal open onOpenChange={() => {}} editingTaskId={null} selectedStudentId="student-1" />
    );

    expect(screen.getByText("Yeni Görev")).toBeInTheDocument();
    expect(screen.getByText("Ders")).toBeInTheDocument();
    expect(screen.getByText("Ünite")).toBeInTheDocument();
    expect(screen.getByText("Konu")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ornegin: 50")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Ekle/i })).toBeInTheDocument();
  });

  it("ders/ünite/konu verileri hook'lardan gelir", () => {
    renderWithProviders(
      <TaskModal open onOpenChange={() => {}} editingTaskId={null} selectedStudentId="student-1" />
    );

    // Select trigger'lar görünür (placeholder metinleri)
    expect(screen.getByText("Ders seç")).toBeInTheDocument();
    expect(screen.getByText("Önce ders seçin")).toBeInTheDocument();
    expect(screen.getByText("Önce ünite seçin")).toBeInTheDocument();
  });
});
