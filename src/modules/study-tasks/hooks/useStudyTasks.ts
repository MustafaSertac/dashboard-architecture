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
  CreateFocusSessionRequest,
} from "@/modules/study-tasks/types/study-task.types";

export function useTodayTasks(studentId: string) {
  return useQuery({
    queryKey: qk.tasks.today(studentId),
    queryFn: async () => {
      const dtos = await studyTaskService.today(studentId);
      return dtos.map(mapStudyTaskToUi) as Task[];
    },
    enabled: !!studentId,
  });
}

export function useUpcomingTasks(studentId: string) {
  return useQuery({
    queryKey: qk.tasks.upcoming(studentId),
    queryFn: async () => {
      const dtos = await studyTaskService.upcoming(studentId);
      return dtos.map(mapStudyTaskToUi) as Task[];
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
      return dtos.map(mapStudyTaskToUi) as Task[];
    },
    enabled: !!studentId && !!startDate && !!endDate,
  });
}

function invalidateAllTasksForStudent(
  qc: ReturnType<typeof useQueryClient>,
  studentId: string
) {
  qc.invalidateQueries({ queryKey: qk.tasks.allForStudent(studentId) });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTaskRequest) => {
      const dto = await studyTaskService.create(data);
      return mapStudyTaskToUi(dto);
    },
    onSuccess: (_data, variables) => {
      invalidateAllTasksForStudent(queryClient, variables.studentId);
    },
  });
}

export function useUpdateTask(studentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateTaskRequest) => {
      const dto = await studyTaskService.update(data);
      return mapStudyTaskToUi(dto);
    },
    onSuccess: () => {
      invalidateAllTasksForStudent(queryClient, studentId);
    },
  });
}

export function useDeleteTask(studentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeleteTaskRequest) => {
      await studyTaskService.delete(data);
    },
    onSuccess: () => {
      invalidateAllTasksForStudent(queryClient, studentId);
    },
  });
}

export function useCompleteTask(studentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CompleteTaskRequest) => {
      const dto = await studyTaskService.complete(data);
      return mapStudyTaskToUi(dto);
    },
    onSuccess: () => {
      invalidateAllTasksForStudent(queryClient, studentId);
    },
  });
}

export function useLogStudy(studentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LogTaskStudyRequest) => {
      const dto = await studyTaskService.logStudy(data);
      return mapStudyTaskToUi(dto);
    },
    onSuccess: () => {
      invalidateAllTasksForStudent(queryClient, studentId);
    },
  });
}

export function useBulkCompleteTasks(studentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskIds: string[]) => {
      return studyTaskService.completeBatch(taskIds);
    },
    onSuccess: () => {
      invalidateAllTasksForStudent(queryClient, studentId);
    },
  });
}

export function useFocusSessions(taskId: string, date?: string) {
  return useQuery({
    queryKey: ["tasks", "focus-sessions", taskId, date],
    queryFn: () => studyTaskService.getFocusSessions(taskId, date),
    enabled: !!taskId,
  });
}

export function useCreateFocusSession(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFocusSessionRequest) => {
      return studyTaskService.createFocusSession(taskId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", "focus-sessions", taskId],
      });
    },
  });
}
