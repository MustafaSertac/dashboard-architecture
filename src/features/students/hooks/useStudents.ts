import { useQuery } from "@tanstack/react-query";
import { fetchStudents, fetchStudent } from "../services/students.api";
import type { Student } from "../types";

export const useStudents = (options?: Parameters<typeof useQuery<Student[]>>[2]) =>
  useQuery<Student[]>({ queryKey: ['students'], queryFn: fetchStudents, staleTime: 1000 * 60 * 5, ...options });

export const useStudent = (id?: string) =>
  useQuery<Student>({ queryKey: ['student', id], queryFn: () => fetchStudent(id!), enabled: Boolean(id) });
