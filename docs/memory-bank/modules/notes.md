# Modül — Notes (Öğrenci Notları / Feedback)

> **Amaç:** Öğretmenin bir öğrenci için kategori bazlı not/geri bildirim eklemesi, listelemesi
> ve silmesi. `teacherId` backend tarafından JWT claim'den çözülür, body'ye konmaz.

**Sorumlu dosyalar**
- `src/modules/notes/services/note.service.ts`
- `src/modules/notes/hooks/useNotes.ts`
- `src/modules/notes/types/note.types.ts`
- UI: `src/components/teacher/note-modal.tsx`

---

## Endpoint'ler

| # | Method | Path | Body | Response `data` |
|---|--------|------|------|-----------------|
| 1 | GET | `/students/{studentId}/notes` | — | `NoteDTO[]` |
| 2 | POST | `/students/{studentId}/notes` | `{ category, note }` | `NoteDTO` (201) |
| 3 | DELETE | `/students/{studentId}/notes/{noteId}` | — | `{ message }` |

`category`: `feedback` | `performance` | `improvement` | `praise`.
`note`: en fazla 2000 karakter. Boş/kategori/uzunluk doğrulaması backend'de FluentValidation
ile yapılır ve `ValidationProblemDetails` (400) döner — envelope/`ERR_` kodu gelmez.

---

## Hook'lar

| Hook | Açıklama |
|------|----------|
| `useNotes(studentId)` | `qk.notes.list(studentId)` ile notları çeker |
| `useCreateNote(studentId, teacherId)` | `create`; başarıda notları invalidate eder |
| `useDeleteNote(studentId)` | `delete(noteId)`; başarıda notları invalidate eder |

---

## Akış / Notlar

- `noteService.create(studentId, _teacherId, data)` — `_teacherId` imzada vardır ama
  **body'ye konmaz**; yalnızca `{ category, note }` gönderilir (JWT claim yeterli).
- `NoteDTO`: `{ id, studentId, teacherId, category, note, createdAt }`.
- UI: öğretmen öğrenci detay sayfasından `NoteModal` ile ekler, not listesinden siler.
- Öğrenci bulunamazsa `ERR_STUDENT_NOT_FOUND`, not yoksa `ERR_NOTE_NOT_FOUND` döner.
