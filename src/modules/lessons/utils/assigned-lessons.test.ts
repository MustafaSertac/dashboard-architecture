import { describe, it, expect } from "vitest";
import { filterLessonsByAssignment } from "@/modules/lessons/utils/assigned-lessons";
import type {
  LessonDTO,
  StudentLessonDTO,
} from "@/modules/lessons/types/lesson.types";

const lessons: LessonDTO[] = [
  { id: "l1", name: "Matematik", code: 11, isActive: true, examTypes: [10], unitCount: 1, createdAt: "" },
  { id: "l2", name: "Fizik", code: 12, isActive: true, examTypes: [10], unitCount: 1, createdAt: "" },
];

const assignment = (lessonId: string): StudentLessonDTO => ({
  id: "sl-" + lessonId,
  teacherId: "t1",
  studentId: "s1",
  lessonId,
  lessonCode: 0,
  createdAt: "",
});

describe("filterLessonsByAssignment", () => {
  it("atama varsa yalnizca atanmis dersleri doner", () => {
    const result = filterLessonsByAssignment(lessons, [assignment("l2")]);
    expect(result.map((l) => l.id)).toEqual(["l2"]);
  });

  it("atama yoksa tum dersleri doner (form kullanilabilir kalsin)", () => {
    const result = filterLessonsByAssignment(lessons, []);
    expect(result.map((l) => l.id)).toEqual(["l1", "l2"]);
  });
});
