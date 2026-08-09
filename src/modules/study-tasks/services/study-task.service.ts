import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type {
  StudyTaskDTO,
  CreateTaskRequest,
  UpdateTaskRequest,
  DeleteTaskRequest,
  CompleteTaskRequest,
  LogTaskStudyRequest,
} from "@/modules/study-tasks/types/study-task.types";

export const studyTaskService = {
  async today(studentId: string): Promise<StudyTaskDTO[]> {
    const res = await apiClient.get(endpoints.studyTasks.today(studentId));
    return res.data.data;
  },

  async upcoming(
    studentId: string,
    limit: number = 5
  ): Promise<StudyTaskDTO[]> {
    const res = await apiClient.get(endpoints.studyTasks.upcoming(studentId), {
      params: { limit },
    });
    return res.data.data;
  },

  async byStudentRange(
    studentId: string,
    startDate: string,
    endDate: string
  ): Promise<StudyTaskDTO[]> {
    const res = await apiClient.get(
      endpoints.studyTasks.byStudentRange(studentId),
      { params: { startDate, endDate } }
    );
    return res.data.data;
  },

  async create(data: CreateTaskRequest): Promise<StudyTaskDTO> {
    const res = await apiClient.post(endpoints.studyTasks.create, data);
    return res.data.data;
  },

  async update(data: UpdateTaskRequest): Promise<StudyTaskDTO> {
    const res = await apiClient.put(endpoints.studyTasks.update, data);
    return res.data.data;
  },

  async delete(data: DeleteTaskRequest): Promise<void> {
    await apiClient.delete(endpoints.studyTasks.delete, { data });
  },

  async complete(data: CompleteTaskRequest): Promise<StudyTaskDTO> {
    const res = await apiClient.post(endpoints.studyTasks.complete, data);
    return res.data.data;
  },

  async logStudy(data: LogTaskStudyRequest): Promise<StudyTaskDTO> {
    const res = await apiClient.post(endpoints.studyTasks.logStudy, data);
    return res.data.data;
  },
};
