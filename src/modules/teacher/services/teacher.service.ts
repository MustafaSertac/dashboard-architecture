import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { TeacherStudentDTO } from "@/modules/teacher/types/teacher.types";

export const teacherService = {
  async listByTeacher(teacherId: string): Promise<TeacherStudentDTO[]> {
    const res = await apiClient.get(endpoints.students.listByTeacher(teacherId));
    return res.data.data as TeacherStudentDTO[];
  },

  async addStudent(teacherId: string, studentId: string): Promise<void> {
    await apiClient.post(endpoints.students.add(teacherId), { studentId });
  },

  async removeStudent(teacherId: string, studentId: string): Promise<void> {
    await apiClient.delete(endpoints.students.remove(teacherId, studentId));
  },
};
