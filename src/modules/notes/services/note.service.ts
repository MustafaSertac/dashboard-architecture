import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type {
  CreateNoteRequest,
  NoteDTO,
} from "@/modules/notes/types/note.types";

// BACKEND #5 (Orta) TAMAMLANDI: Not/Feedback endpoint'i.
// teacherId backend tarafindan JWT claim'den doldurulur; body'ye konmaz.
export const noteService = {
  async list(studentId: string): Promise<NoteDTO[]> {
    const res = await apiClient.get(endpoints.notes.list(studentId));
    return res.data.data as NoteDTO[];
  },

  async create(
    studentId: string,
    _teacherId: string,
    data: CreateNoteRequest
  ): Promise<NoteDTO> {
    const res = await apiClient.post(endpoints.notes.create(studentId), data);
    return res.data.data as NoteDTO;
  },

  async delete(studentId: string, noteId: string): Promise<void> {
    await apiClient.delete(endpoints.notes.delete(studentId, noteId));
  },
};
