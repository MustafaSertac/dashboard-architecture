import { z } from "zod";

export const createTaskSchema = z.object({
  studentId: z.string().min(1),
  subject: z.string().min(1, "Ders secimi zorunludur"),
  topic: z.string().min(1, "Konu secimi zorunludur"),
  questionCount: z.number().min(1, "Soru sayisi 1'den az olamaz"),
  dueDate: z.string().min(1, "Tarih secimi zorunludur"),
});

export const logStudySchema = z.object({
  taskId: z.string().min(1),
  hours: z.number().min(0.1, "Calisma suresi 0'dan buyuk olmalidir"),
  correctCount: z.number().min(0),
  wrongCount: z.number().min(0),
  emptyCount: z.number().min(0),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type LogStudyFormData = z.infer<typeof logStudySchema>;
