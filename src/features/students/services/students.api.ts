import { fetchJson } from "../../../config/api";
import type { Student } from "../types";

export const fetchStudents = async (): Promise<Student[]> => {
  return fetchJson('/api/students');
};

export const fetchStudent = async (id: string): Promise<Student> => {
  return fetchJson(`/api/students/${id}`);
};
