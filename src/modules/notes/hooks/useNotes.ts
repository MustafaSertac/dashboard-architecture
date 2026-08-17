import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/query/keys";
import { noteService } from "@/modules/notes/services/note.service";
import type {
  CreateNoteRequest,
  NoteDTO,
} from "@/modules/notes/types/note.types";

export function useNotes(studentId: string) {
  return useQuery({
    queryKey: qk.notes.list(studentId),
    queryFn: () => noteService.list(studentId),
    enabled: !!studentId,
  });
}

export function useCreateNote(studentId: string, teacherId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNoteRequest): Promise<NoteDTO> => {
      return noteService.create(studentId, teacherId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.notes.list(studentId) });
    },
  });
}

export function useDeleteNote(studentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noteId: string): Promise<void> => {
      await noteService.delete(studentId, noteId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.notes.list(studentId) });
    },
  });
}
