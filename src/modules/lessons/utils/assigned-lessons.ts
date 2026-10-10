import type { LessonDTO, StudentLessonDTO } from "@/modules/lessons/types/lesson.types";

/**
 * Gorev formundaki ders listesini ogrencinin atanmis dersleriyle sinirlar.
 * Atanmis ders yoksa (bos liste) tum derslere duser ki form kullanilabilir kalsin.
 */
export function filterLessonsByAssignment(
  lessons: LessonDTO[],
  assigned: StudentLessonDTO[]
): LessonDTO[] {
  const assignedIds = new Set(assigned.map((a) => a.lessonId));
  if (assignedIds.size === 0) return lessons;
  return lessons.filter((l) => assignedIds.has(l.id));
}
