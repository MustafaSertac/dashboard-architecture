import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/query/keys";
import { lessonService } from "@/modules/lessons/services/lesson.service";
import type {
  CreateLessonRequest,
  UpdateLessonRequest,
  CreateUnitRequest,
  UpdateUnitRequest,
  CreateTopicRequest,
  UpdateTopicRequest,
} from "@/modules/lessons/types/lesson.types";

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

export function useCreateLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLessonRequest) => lessonService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lessons"] }),
  });
}

export function useUpdateLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLessonRequest }) =>
      lessonService.update(id, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["lessons"] });
      qc.invalidateQueries({ queryKey: qk.lessons.detail(variables.id) });
    },
  });
}

export function useDeleteLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => lessonService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lessons"] }),
  });
}

export function useCreateUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, data }: { lessonId: string; data: CreateUnitRequest }) =>
      lessonService.createUnit(lessonId, data),
    onSuccess: (_data, variables) =>
      qc.invalidateQueries({ queryKey: qk.units.list(variables.lessonId) }),
  });
}

export function useUpdateUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ unitId, data }: { unitId: string; data: UpdateUnitRequest }) =>
      lessonService.updateUnit(unitId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["units"] }),
  });
}

export function useDeleteUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (unitId: string) => lessonService.deleteUnit(unitId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["units"] }),
  });
}

export function useCreateTopic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ unitId, data }: { unitId: string; data: CreateTopicRequest }) =>
      lessonService.createTopic(unitId, data),
    onSuccess: (_data, variables) =>
      qc.invalidateQueries({ queryKey: qk.topics.list(variables.unitId) }),
  });
}

export function useUpdateTopic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ topicId, data }: { topicId: string; data: UpdateTopicRequest }) =>
      lessonService.updateTopic(topicId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["topics"] }),
  });
}

export function useDeleteTopic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (topicId: string) => lessonService.deleteTopic(topicId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["topics"] }),
  });
}
