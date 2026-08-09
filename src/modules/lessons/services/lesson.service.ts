import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type {
  LessonDTO,
  UnitDTO,
  TopicDTO,
  CreateLessonRequest,
} from "@/modules/lessons/types/lesson.types";

export const lessonService = {
  async list(examType?: number): Promise<LessonDTO[]> {
    const params = examType !== undefined ? { examType } : {};
    const res = await apiClient.get(endpoints.lessons.list, { params });
    return res.data.data;
  },

  async getById(id: string): Promise<LessonDTO> {
    const res = await apiClient.get(endpoints.lessons.detail(id));
    return res.data.data;
  },

  async create(data: CreateLessonRequest): Promise<LessonDTO> {
    const res = await apiClient.post(endpoints.lessons.create, data);
    return res.data.data;
  },

  async getUnits(lessonId: string): Promise<UnitDTO[]> {
    const res = await apiClient.get(endpoints.units.listByLesson(lessonId));
    return res.data.data;
  },

  async getTopics(unitId: string): Promise<TopicDTO[]> {
    const res = await apiClient.get(endpoints.topics.listByUnit(unitId));
    return res.data.data;
  },
};
