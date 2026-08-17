import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/query/keys";
import { teacherService } from "@/modules/teacher/services/teacher.service";
import type { TeacherStudent } from "@/modules/teacher/types/teacher.types";

export function useTeacherStudents(teacherId: string | undefined | null) {
  return useQuery({
    queryKey: qk.teacherStudents(teacherId ?? "anonymous"),
    queryFn: async () => {
      const dtos = await teacherService.listByTeacher(teacherId ?? "");
      // DTO -> UI tipi (User + istatistikler)
      return dtos.map(
        (dto) =>
          ({
            id: dto.id,
            name: dto.name,
            email: dto.email,
            avatar: dto.avatar,
            role: "student" as const,
            weeklyProgress: dto.weeklyProgress,
            totalTasks: dto.totalTasks,
            completedTasks: dto.completedTasks,
            totalHours: dto.totalHours,
            lastActive: dto.lastActive,
          }) as TeacherStudent
      );
    },
    enabled: !!teacherId,
  });
}
