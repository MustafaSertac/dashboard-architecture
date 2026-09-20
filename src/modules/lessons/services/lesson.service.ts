import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type {
  LessonDTO,
  UnitDTO,
  TopicDTO,
  CreateLessonRequest,
  UpdateLessonRequest,
  CreateUnitRequest,
  UpdateUnitRequest,
  CreateTopicRequest,
  UpdateTopicRequest,
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

  async update(id: string, data: UpdateLessonRequest): Promise<LessonDTO> {
    const res = await apiClient.put(endpoints.lessons.update(id), data);
    return res.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(endpoints.lessons.delete(id));
  },

  async getUnits(lessonId: string): Promise<UnitDTO[]> {
    const res = await apiClient.get(endpoints.units.listByLesson(lessonId));
    return res.data.data;
  },

  async createUnit(lessonId: string, data: CreateUnitRequest): Promise<UnitDTO> {
    const res = await apiClient.post(endpoints.units.create(lessonId), data);
    return res.data.data;
  },

  async updateUnit(unitId: string, data: UpdateUnitRequest): Promise<UnitDTO> {
    const res = await apiClient.put(endpoints.units.update(unitId), data);
    return res.data.data;
  },

  async deleteUnit(unitId: string): Promise<void> {
    await apiClient.delete(endpoints.units.delete(unitId));
  },

  async getTopics(unitId: string): Promise<TopicDTO[]> {
    const res = await apiClient.get(endpoints.topics.listByUnit(unitId));
    return res.data.data;
  },

  async createTopic(unitId: string, data: CreateTopicRequest): Promise<TopicDTO> {
    const res = await apiClient.post(endpoints.topics.create(unitId), data);
    return res.data.data;
  },

  async updateTopic(topicId: string, data: UpdateTopicRequest): Promise<TopicDTO> {
    const res = await apiClient.put(endpoints.topics.update(topicId), data);
    return res.data.data;
  },

  async deleteTopic(topicId: string): Promise<void> {
    await apiClient.delete(endpoints.topics.delete(topicId));
  },
};
