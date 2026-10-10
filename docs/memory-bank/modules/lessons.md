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
