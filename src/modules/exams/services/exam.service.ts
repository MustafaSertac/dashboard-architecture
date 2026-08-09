import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { PagedResult } from "@/types/common";
import type {
  ExamDTO,
  ExamSummaryDTO,
  CreateExamRequest,
  UpdateExamRequest,
} from "@/modules/exams/types/exam.types";

export const examService = {
  async list(
    studentId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PagedResult<ExamSummaryDTO>> {
    const res = await apiClient.get(endpoints.exams.list, {
      params: { studentId, page, pageSize },
    });
    return res.data.data;
  },

  async getById(id: string, detailed: boolean = false): Promise<ExamDTO | ExamSummaryDTO> {
    const res = await apiClient.get(endpoints.exams.detail(id), {
      params: { detailed },
    });
    return res.data.data;
  },

  async trends(
    studentId: string,
    examCode: number,
    limit: number = 10
  ): Promise<ExamSummaryDTO[]> {
    const res = await apiClient.get(endpoints.exams.trends, {
      params: { studentId, examCode, limit },
    });
    return res.data.data;
  },

  async create(data: CreateExamRequest): Promise<ExamDTO> {
    const res = await apiClient.post(endpoints.exams.create, data);
    return res.data.data;
  },

  async update(id: string, data: UpdateExamRequest): Promise<ExamDTO> {
    const res = await apiClient.put(endpoints.exams.update(id), data);
    return res.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(endpoints.exams.delete(id));
  },
};
