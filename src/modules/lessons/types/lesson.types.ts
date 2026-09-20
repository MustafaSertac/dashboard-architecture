export interface LessonDTO {
  id: string;
  name: string;
  code: number;
  description?: string;
  isActive: boolean;
  examTypes: number[];
  unitCount: number;
  units?: UnitDTO[];
  createdAt: string;
  updatedAt?: string;
}

export interface UnitDTO {
  id: string;
  lessonCode: number;
  code: number;
  name: string;
  order: number;
  description?: string;
  isActive: boolean;
  examTypes: number[];
  topicCount: number;
  topics?: TopicDTO[];
  createdAt: string;
  updatedAt?: string;
}

export interface TopicDTO {
  id: string;
  unitCode: number;
  topicCode: number;
  name: string;
  order: number;
  description?: string;
  isActive: boolean;
  examTypes: number[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateLessonRequest {
  name: string;
  code: number;
  description?: string;
  examTypes: number[];
}

export interface UpdateLessonRequest {
  name?: string;
  code?: number;
  description?: string;
  examTypes?: number[];
  isActive?: boolean;
}

export interface CreateUnitRequest {
  code: number;
  name: string;
  order: number;
  description?: string;
  examTypes: number[];
}

export interface UpdateUnitRequest {
  code?: number;
  name?: string;
  order?: number;
  description?: string;
  examTypes?: number[];
  isActive?: boolean;
}

export interface CreateTopicRequest {
  topicCode: number;
  name: string;
  order: number;
  description?: string;
  examTypes: number[];
}

export interface UpdateTopicRequest {
  topicCode?: number;
  name?: string;
  order?: number;
  description?: string;
  examTypes?: number[];
  isActive?: boolean;
}
