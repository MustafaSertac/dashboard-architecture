import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type {
  CreateNoteRequest,
  NoteDTO,
} from "@/modules/notes/types/note.types";

// BACKEND EKSIK #5 (Orta): Not/Feedback endpoint'i YOK.
// Backend ekleyene kadar simulated fallback (setTimeout + bellek-içi depo).
// Backend tamamlandiginda catch bloklari kaldirilir.

// Bellek-ici not deposu (sadece mock fallback icin).
const memoryNotes = new Map<string, NoteDTO[]>();

function generateId(): string {
  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const noteService = {
  async list(studentId: string): Promise<NoteDTO[]> {
    try {
      const res = await apiClient.get(endpoints.notes.list(studentId));
      return res.data.data as NoteDTO[];
    } catch {
      // BACKEND EKSIK #5: endpoint yok -> mock.
      return memoryNotes.get(studentId) ?? [];
    }
  },

  async create(
    studentId: string,
    teacherId: string,
    data: CreateNoteRequest
  ): Promise<NoteDTO> {
    try {
      const res = await apiClient.post(endpoints.notes.create(studentId), data);
      return res.data.data as NoteDTO;
    } catch {
      // BACKEND EKSIK #5: endpoint yok -> simulate.
      await new Promise((resolve) => setTimeout(resolve, 500));
      const note: NoteDTO = {
        id: generateId(),
        studentId,
        teacherId,
        category: data.category,
        note: data.note,
        createdAt: new Date().toISOString(),
      };
      const arr = memoryNotes.get(studentId) ?? [];
      arr.push(note);
      memoryNotes.set(studentId, arr);
      return note;
    }
  },

  async delete(studentId: string, noteId: string): Promise<void> {
    try {
      await apiClient.delete(endpoints.notes.delete(studentId, noteId));
    } catch {
      // BACKEND EKSIK #5: endpoint yok -> mock.
      const arr = memoryNotes.get(studentId) ?? [];
      memoryNotes.set(
        studentId,
        arr.filter((n) => n.id !== noteId)
      );
    }
  },
};
