import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/query/keys";
import { examService } from "@/modules/exams/services/exam.service";
import { mapExamDtoToUi } from "@/modules/exams/mappers/exam.mapper";
import type { ExamResult } from "@/lib/types";
import type { CreateExamRequest, UpdateExamRequest } from "@/modules/exams/types/exam.types";

export function useExamList(studentId: string) {
  return useQuery({
    queryKey: qk.exams.list(studentId, 1),
    queryFn: async () => {
      const paged = await examService.list(studentId);
      return paged.items.map(mapExamDtoToUi) as ExamResult[];
    },
    enabled: !!studentId,
  });
}

export function useExamDetail(id: string, detailed: boolean = false) {
  return useQuery({
    queryKey: qk.exams.detail(id, detailed),
    queryFn: async () => {
      const dto = await examService.getById(id, detailed);
      return mapExamDtoToUi(dto) as ExamResult;
    },
    enabled: !!id,
  });
}

export function useExamTrends(studentId: string, examCode: number) {
  return useQuery({
    queryKey: qk.exams.trends(studentId, examCode, 10),
    queryFn: async () => {
      const items = await examService.trends(studentId, examCode);
      return items.map(mapExamDtoToUi) as ExamResult[];
    },
    enabled: !!studentId,
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateExamRequest) => {
      const dto = await examService.create(data);
      return mapExamDtoToUi(dto) as ExamResult;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: qk.exams.list(variables.studentId, 1) });
    },
  });
}

export function useUpdateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
      studentId,
    }: {
      id: string;
      data: UpdateExamRequest;
      studentId: string;
    }) => {
      const dto = await examService.update(id, data);
      return mapExamDtoToUi(dto) as ExamResult;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: qk.exams.list(variables.studentId, 1) });
      queryClient.invalidateQueries({ queryKey: qk.exams.detail(variables.id, true) });
    },
  });
}

export function useDeleteExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, studentId }: { id: string; studentId: string }) => {
      await examService.delete(id);
      return { id, studentId };
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: qk.exams.list(variables.studentId, 1) });
    },
  });
}
