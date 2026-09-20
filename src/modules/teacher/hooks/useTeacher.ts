import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/query/keys";
import { teacherService } from "@/modules/teacher/services/teacher.service";
import type { TeacherStudent } from "@/modules/teacher/types/teacher.types";

export function useTeacherStudents(teacherId: string | undefined | null) {
  return useQuery({
    queryKey: qk.teacherStudents(teacherId ?? "anonymous"),
    queryFn: async () => {
      const dtos = await teacherService.listByTeacher(teacherId ?? "");
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

export function useAddStudent(teacherId: string | undefined | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (studentId: string) =>
      teacherService.addStudent(teacherId ?? "", studentId),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: qk.teacherStudents(teacherId ?? "anonymous"),
      }),
  });
}

export function useRemoveStudent(teacherId: string | undefined | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (studentId: string) =>
      teacherService.removeStudent(teacherId ?? "", studentId),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: qk.teacherStudents(teacherId ?? "anonymous"),
      }),
  });
}
