import { describe, it, expect } from "vitest";
import { mapStudyTaskToUi } from "@/modules/study-tasks/mappers/study-task.mapper";
import type { StudyTaskDTO } from "@/modules/study-tasks/types/study-task.types";

const baseDto: StudyTaskDTO = {
  taskId: "t1",
  studentId: "s1",
  dueDate: "2026-08-10",
  createdAt: "2026-08-09T00:00:00Z",
  lessonId: "l1",
  lessonTitle: "Matematik",
  topicId: "top1",
  topicTitle: "Fonksiyonlar",
  title: "Matematik - Fonksiyonlar",
  description: "",
  taskType: 0,
  targetHours: 2,
  targetQuestions: 50,
  studiedHours: 1,
  correctCount: 30,
  wrongCount: 5,
  emptyCount: 15,
  totalQuestions: 40,
  net: 28.75,
  successRate: 80,
  isCompleted: false,
  isTargetAchieved: false,
};

describe("mapStudyTaskToUi", () => {
  it("DTO'daki dueDate'i kullanir", () => {
    const task = mapStudyTaskToUi(baseDto);
    expect(task.dueDate).toBe("2026-08-10");
  });

  it("DTO'daki studentId'yi kullanir", () => {
    const task = mapStudyTaskToUi(baseDto);
    expect(task.studentId).toBe("s1");
  });

  it("DTO'daki createdAt'i kullanir", () => {
    const task = mapStudyTaskToUi(baseDto);
    expect(task.createdAt).toBe("2026-08-09T00:00:00Z");
  });

  it("isCompleted -> status completed", () => {
    const task = mapStudyTaskToUi({ ...baseDto, isCompleted: true });
    expect(task.status).toBe("completed");
  });

  it("totalQuestions > 0 && !isCompleted -> status in-progress", () => {
    const task = mapStudyTaskToUi({ ...baseDto, totalQuestions: 20 });
    expect(task.status).toBe("in-progress");
  });

  it("totalQuestions === 0 && !isCompleted -> status pending", () => {
    const task = mapStudyTaskToUi({ ...baseDto, totalQuestions: 0 });
    expect(task.status).toBe("pending");
  });
});
