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

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export function useTodayTasks(studentId: string) {
  return useQuery({
    queryKey: qk.tasks.today(studentId),
    queryFn: async () => {
      const dtos = await studyTaskService.today(studentId);
      // BACKEND EKSIK #1: dto.dueDate yok. today endpoint'i zaten "bugun" filtresi
      // yaptigi icin dueDate = bugun varsayiyoruz.
      return dtos.map((dto) =>
        mapStudyTaskToUi(dto, {
          fallbackDate: todayISO(),
          fallbackStudentId: studentId,
        })
      ) as Task[];
    },
    enabled: !!studentId,
  });
}

export function useUpcomingTasks(studentId: string) {
  return useQuery({
    queryKey: qk.tasks.upcoming(studentId),
    queryFn: async () => {
      const dtos = await studyTaskService.upcoming(studentId);
      // BACKEND EKSIK #1: dto.dueDate yok. upcoming endpoint'i "gelecek" filtresi
      // yapiyor; UI tarihe gore gruplarken dto.dueDate ?? fallback kullanir.
      return dtos.map((dto) =>
        mapStudyTaskToUi(dto, {
          fallbackDate: todayISO(),
          fallbackStudentId: studentId,
        })
      ) as Task[];
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
      // BACKEND EKSIK #1: dto.dueDate yok. Range query'sinde her task'in hangi
      // gune ait oldugu bilinemiyor. Iki strateji:
      //   (a) Tek gun araligi (startDate === endDate) -> dueDate = startDate
      //   (b) Coklu gun -> dueDate = startDate (UI tarafinda ek filtre yok;
      //       bu yuzden DailyTasksView gibi bilesenler tek gun range ile cagrilmali)
      const fallbackDate = startDate === endDate ? startDate : todayISO();
      return dtos.map((dto) =>
        mapStudyTaskToUi(dto, {
          fallbackDate,
          fallbackStudentId: studentId,
        })
      ) as Task[];
    },
    enabled: !!studentId && !!startDate && !!endDate,
  });
}

function invalidateAllTasksForStudent(
  qc: ReturnType<typeof useQueryClient>,
  studentId: string
) {
  // Hedefli invalidasyon: ["tasks", ...] prefix -> o student'in tum task query'leri.
  qc.invalidateQueries({ queryKey: qk.tasks.allForStudent(studentId) });
  // today/upcoming ozel olarak da invalidasyona dahil (yukaridaki prefix kapsiyor).
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTaskRequest) => {
      const dto = await studyTaskService.create(data);
      return mapStudyTaskToUi(dto, {
        fallbackDate: data.dueDate,
        fallbackStudentId: data.studentId,
      });
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
      return mapStudyTaskToUi(dto, {
        // BACKEND EKSIK #1: dueDate response'ta yok; request'teki dueDate'i kullan.
        fallbackDate: data.dueDate,
        fallbackStudentId: data.studentId ?? studentId,
      });
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
      return mapStudyTaskToUi(dto, { fallbackStudentId: studentId });
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
      return mapStudyTaskToUi(dto, { fallbackStudentId: studentId });
    },
    onSuccess: () => {
      invalidateAllTasksForStudent(queryClient, studentId);
    },
  });
}

// BACKEND EKSIK #6 (Orta): Toplu complete endpoint'i YOK.
// Stub strateji: once studyTaskService.completeBatch cagriliyor;
// backend 404/405 donerse hook catch'te per-task complete'e duser.
export function useBulkCompleteTasks(studentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskIds: string[]) => {
      try {
        await studyTaskService.completeBatch(taskIds);
        return { completedCount: taskIds.length, failedIds: [] as string[] };
      } catch (err) {
        // Backend desteklemiyor -> per-task complete fallback.
        const failedIds: string[] = [];
        for (const taskId of taskIds) {
          try {
            await studyTaskService.complete({ taskId });
          } catch {
            failedIds.push(taskId);
          }
        }
        return {
          completedCount: taskIds.length - failedIds.length,
          failedIds,
        };
      }
    },
    onSuccess: () => {
      invalidateAllTasksForStudent(queryClient, studentId);
    },
  });
}
