// BACKEND EKSIK #5 (Orta): Not/Feedback endpoint'i YOK.
// Backend tamamlandiginda asagidaki tipler /students/{id}/notes icin kullanilir.

export type NoteCategory =
  | "feedback"
  | "performance"
  | "improvement"
  | "praise";

export interface CreateNoteRequest {
  category: NoteCategory;
  note: string; // max 2000
}

export interface NoteDTO {
  id: string;
  studentId: string;
  teacherId: string; // JWT'den alinabilir
  category: string;
  note: string;
  createdAt: string; // ISO DateTime
}
