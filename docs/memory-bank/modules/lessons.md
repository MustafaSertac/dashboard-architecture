# Modül — Lessons (Ders / Ünite / Konu)

> **Amaç:** Ders, ünite ve konu kataloğunun tam CRUD'u. Görev formunda (TaskModal) kademeli
> seçim (ders → ünite → konu) için kullanılır. Admin CRUD ekranı henüz yok, service/hook hazır.

**Sorumlu dosyalar**
- `src/modules/lessons/services/lesson.service.ts`
- `src/modules/lessons/hooks/useLessons.ts`
- `src/modules/lessons/types/lesson.types.ts`
- `src/modules/lessons/utils/lesson-name-map.ts` (`canonicalLessonName`)
- UI tüketimi: `src/components/tasks/task-modal.tsx`

---

## Endpoint'ler

### Lessons
| # | Method | Path | Body / Param | Response `data` |
|---|--------|------|--------------|-----------------|
| 1 | GET | `/lessons` | `examType?` | `LessonDTO[]` |
| 2 | GET | `/lessons/{lessonId}` | — | `LessonDTO` |
| 3 | POST | `/lessons` | `CreateLessonRequest` | `LessonDTO` (201) |
| 4 | PUT | `/lessons/{lessonId}` | `UpdateLessonRequest` | `LessonDTO` |
| 5 | DELETE | `/lessons/{lessonId}` | — | success |

### Units
| # | Method | Path | Body | Response `data` |
|---|--------|------|------|-----------------|
| 6 | GET | `/lessons/{lessonId}/units` | — | `UnitDTO[]` |
| 7 | POST | `/lessons/{lessonId}/units` | `CreateUnitRequest` | `UnitDTO` (201) |
| 8 | PUT | `/units/{unitId}` | `UpdateUnitRequest` | `UnitDTO` |
| 9 | DELETE | `/units/{unitId}` | — | success |

### Topics
| # | Method | Path | Body | Response `data` |
|---|--------|------|------|-----------------|
| 10 | GET | `/units/{unitId}/topics` | — | `TopicDTO[]` |
| 11 | POST | `/units/{unitId}/topics` | `CreateTopicRequest` | `TopicDTO` (201) |
| 12 | PUT | `/topics/{topicId}` | `UpdateTopicRequest` | `TopicDTO` |
| 13 | DELETE | `/topics/{topicId}` | — | success |

### StudentLessons (Öğretmen → Öğrenci Ders Atama)
| # | Method | Path | Body | Response `data` |
|---|--------|------|------|-----------------|
| 14 | GET | `/teachers/{teacherId}/students/{studentId}/lessons` | — | `StudentLessonDTO[]` |
| 15 | PUT | `/teachers/{teacherId}/students/{studentId}/lessons` | `{ lessonIds }` | `StudentLessonDTO[]` |
| 16 | DELETE | `/teachers/{teacherId}/students/{studentId}/lessons/{lessonId}` | — | `{ message }` |
| 17 | GET | `/students/{studentId}/lessons` | — | `StudentLessonDTO[]` (öğretmenler arası birleşim) |

- `PUT` **replace-all**: gönderilen liste öğretmenin o öğrenci için atadığı derslerin tamamıdır;
  listede olmayanlar soft-delete, yeniler eklenir; **boş liste** hepsini temizler.
- Öğretmen/öğrenci rolü ve öğrencinin o öğretmene **aktif** `TeacherStudent` bağı doğrulanır;
  pasif/var olmayan ders atanamaz, yinelenen `lessonId` reddedilir.

---

## Hook'lar

| Hook | Açıklama |
|------|----------|
| `useLessons(examType?)` | Tüm dersler; `staleTime` 5 dk |
| `useLesson(id)` | Tek ders |
| `useUnits(lessonId)` | Dersin üniteleri |
| `useTopics(unitId)` | Ünitenin konuları |
| `useCreateLesson / useUpdateLesson / useDeleteLesson` | Ders CRUD; `["lessons"]` invalidate |
| `useCreateUnit / useUpdateUnit / useDeleteUnit` | Ünite CRUD; `["units"]` invalidate |
| `useCreateTopic / useUpdateTopic / useDeleteTopic` | Konu CRUD; `["topics"]` invalidate |
| `useStudentLessons(teacherId, studentId)` | Öğretmenin o öğrenciye atadığı dersler; `qk.studentLessons.byTeacherStudent` |
| `useStudentOwnLessons(studentId)` | Öğrencinin tüm öğretmenlerinden atanmış derslerin birleşimi; `qk.studentLessons.forStudent` |
| `useSetStudentLessons(teacherId, studentId)` | `PUT` replace-all; başarıda ilgili `student-lessons` key'lerini invalidate eder |
| `useRemoveStudentLesson(teacherId, studentId)` | Tek ders atamasını kaldırır; `["student-lessons"]` invalidate |

---

## Akış / Notlar (TaskModal kademeli seçim)

1. Ders listesi `useLessons()` ile backend'den gelir (sabit liste yok).
2. Ders seçilince `useUnits(lessonId)` → `GET /lessons/{id}/units`.
3. Ünite seçilince `useTopics(unitId)` → `GET /units/{id}/topics`.
4. Görev oluştururken gerçek `lessonId` / `unitId` / `topicId` gönderilir
   (`POST /study-tasks` body'sinde).

`LessonDTO`: `id, name, code, description?, isActive, examTypes[], unitCount, units?, ...`.
`UnitDTO` `lessonCode, code, order, topicCount`; `TopicDTO` `unitCode, topicCode, order` taşır.
Kodlar backend'de seed edilmiştir (TÜRKÇE=10 ... DİN KÜLTÜRÜ=19).

---

## Ders Atama UI (2026-10-10)

- **Öğretmen:** `/teacher/students/{studentId}/lessons` sayfası (`StudentLessonsView`) —
  `useLessons()` ile tüm aktif dersler + `useStudentLessons` ile mevcut atamalar gelir; checkbox ile
  seçilir, "Kaydet" `PUT` replace-all çağırır. Sidebar öğrenci-detay menüsüne "Dersler" eklendi.
- **Öğrenci:** `/dashboard` "Derslerim" kartı (`MyLessonsCard`) — `useStudentOwnLessons` ile atanmış
  dersler (birleşim) gösterilir; ad eşlemesi `useLessons()` listesinden yapılır.
- **Görev formu (`TaskModal`):** "Ders" açılır listesi öğrencinin **atanmış dersleriyle** sınırlanır
  (`filterLessonsByAssignment`; `useStudentLessons`/`useStudentOwnLessons`). Atanmış ders yoksa tüm
  derslere düşer. `src/modules/lessons/utils/assigned-lessons.ts`.
- `StudentLessonDTO`: `id, teacherId, studentId, lessonId, lessonCode, lessonName?, createdAt`.
