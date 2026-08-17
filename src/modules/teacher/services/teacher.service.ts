import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { TeacherStudentDTO } from "@/modules/teacher/types/teacher.types";
import { MOCK_USERS } from "@/lib/mock/mock-users";
import { mockTasks } from "@/lib/mock/mock-data";
import type { TeacherStudent } from "@/modules/teacher/types/teacher.types";

// BACKEND EKSIK #2 (Yuksek): Ogretmen-ogrenci liste endpoint'i YOK.
// Backend ekleyene kadar mock fallback (MOCK_USERS + mockTasks) kullanilir.
// Backend tamamlandiginda tek satirlik degisiklikle entegre edilebilir:
// service listByTeacher()'i direkt API'dan doner, fallback kaldirilir.
function buildMockTeacherStudents(): TeacherStudentDTO[] {
  const students = MOCK_USERS.filter((u) => u.role === "student");

  return students.map((student) => {
    const studentTasks = mockTasks.filter((t) => t.studentId === student.id);
    const completedTasks = studentTasks.filter(
      (t) => t.status === "completed"
    ).length;
    const totalHours = studentTasks.reduce(
      (sum, t) => sum + (t.hoursStudied || 0),
      0
    );
    const totalQuestions = studentTasks.reduce(
      (sum, t) => sum + t.questionCount,
      0
    );
    const completedQuestions = studentTasks.reduce(
      (sum, t) => sum + (t.completedQuestions || 0),
      0
    );
    const weeklyProgress =
      totalQuestions > 0
        ? Math.round((completedQuestions / totalQuestions) * 100)
        : 0;

    const lastTaskUpdate = studentTasks
      .map((t) => new Date(t.updatedAt).getTime())
      .sort((a, b) => b - a)[0];

    const lastActive = lastTaskUpdate
      ? new Date(lastTaskUpdate).toISOString().split("T")[0]
      : "Aktivite yok";

    return {
      id: student.id,
      name: student.name,
      email: student.email,
      avatar: student.avatar,
      weeklyProgress,
      totalTasks: studentTasks.length,
      completedTasks,
      totalHours,
      lastActive,
    };
  });
}

export const teacherService = {
  async listByTeacher(teacherId: string): Promise<TeacherStudentDTO[]> {
    try {
      const res = await apiClient.get(endpoints.students.listByTeacher, {
        params: { teacherId },
      });
      return res.data.data as TeacherStudentDTO[];
    } catch (err) {
      // BACKEND EKSIK #2: Endpoint yok (404/405) -> mock fallback.
      // Auth store'dan gercek teacherId gelirse bile backend cevap vermedigi
      // icin buraya duser. Backend tamamlandiginda catch kaldirilir.
      return buildMockTeacherStudents();
    }
  },
};
