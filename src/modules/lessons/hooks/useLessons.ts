import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/query/keys";
import { lessonService } from "@/modules/lessons/services/lesson.service";

export function useLessons(examType?: number) {
  return useQuery({
    queryKey: qk.lessons.list(examType),
    queryFn: () => lessonService.list(examType),
    staleTime: 5 * 60 * 1000,
  });
}

export function useLesson(id: string) {
  return useQuery({
    queryKey: qk.lessons.detail(id),
    queryFn: () => lessonService.getById(id),
    enabled: !!id,
  });
}

export function useUnits(lessonId: string) {
  return useQuery({
    queryKey: qk.units.list(lessonId),
    queryFn: () => lessonService.getUnits(lessonId),
    enabled: !!lessonId,
  });
}

export function useTopics(unitId: string) {
  return useQuery({
    queryKey: qk.topics.list(unitId),
    queryFn: () => lessonService.getTopics(unitId),
    enabled: !!unitId,
  });
}
