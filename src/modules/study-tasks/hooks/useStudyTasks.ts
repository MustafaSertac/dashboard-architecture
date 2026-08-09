import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/query/keys";
import { studyTaskService } from "@/modules/study-tasks/services/study-task.service";
import { mapStudyTaskToUi } from "@/modules/study-tasks/mappers/study-task.mapper";
import type { Task } from "@/lib/types";
import type {
  CreateTaskRequest,
  UpdateTaskRequest,
  DeleteTaskRequest,
  CompleteTaskRequest,
  LogTaskStudyRequest,
} from "@/modules/study-tasks/types/study-task.types";

export function useTodayTasks(studentId: string) {
  return useQuery({
    queryKey: qk.tasks.today(studentId),
    queryFn: async () => {
      const dtos = await studyTaskService.today(studentId);
      return dtos.map(mapStudyTaskToUi);
    },
    enabled: !!studentId,
  });
}

export function useUpcomingTasks(studentId: string) {
  return useQuery({
    queryKey: qk.tasks.upcoming(studentId),
    queryFn: async () => {
      const dtos = await studyTaskService.upcoming(studentId);
      return dtos.map(mapStudyTaskToUi);
    },
    enabled: !!studentId,
  });
}

export function useTasksByRange(
  studentId: string,
  startDate: string,
  endDate: string
) {
  return useQuery({
    queryKey: qk.tasks.byRange(studentId, startDate, endDate),
    queryFn: async () => {
      const dtos = await studyTaskService.byStudentRange(
        studentId,
        startDate,
        endDate
      );
      return dtos.map(mapStudyTaskToUi);
    },
    enabled: !!studentId && !!startDate && !!endDate,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTaskRequest) => {
      const dto = await studyTaskService.create(data);
      return mapStudyTaskToUi(dto);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: qk.tasks.today(variables.studentId),
      });
      queryClient.invalidateQueries({
        queryKey: qk.tasks.upcoming(variables.studentId),
      });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateTaskRequest) => {
      const dto = await studyTaskService.update(data);
      return mapStudyTaskToUi(dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeleteTaskRequest) => {
      await studyTaskService.delete(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CompleteTaskRequest) => {
      const dto = await studyTaskService.complete(data);
      return mapStudyTaskToUi(dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useLogStudy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LogTaskStudyRequest) => {
      const dto = await studyTaskService.logStudy(data);
      return mapStudyTaskToUi(dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
