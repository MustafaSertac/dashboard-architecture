# Modül — Study Tasks (Çalışma Görevleri)

> **Amaç:** Öğrenciye atanan çalışma görevlerinin listelenmesi, oluşturulması/güncellenmesi,
> silinmesi, onaylanması (tekli/toplu), çalışma kaydı ve focus session takibi.

**Sorumlu dosyalar**
- `src/modules/study-tasks/services/study-task.service.ts`
- `src/modules/study-tasks/hooks/useStudyTasks.ts`, `useStudyTimer.ts`
- `src/modules/study-tasks/mappers/study-task.mapper.ts`
- `src/modules/study-tasks/store/study-timer.store.ts`
- `src/modules/study-tasks/types/study-task.types.ts`, `validators/study-task.schema.ts`
- UI: `src/components/tasks/*`, `src/components/dashboard/study-timer-card.tsx`

---

## Endpoint'ler

| # | Method | Path | Param / Body | Response `data` | Service |
|---|--------|------|--------------|-----------------|---------|
| 1 | GET | `/study-tasks/today/{studentId}` | — | `StudyTaskDTO[]` | `today` |
| 2 | GET | `/study-tasks/upcoming/{studentId}` | `limit=5` | `StudyTaskDTO[]` | `upcoming` |
| 3 | GET | `/study-tasks/students/{studentId}` | `startDate, endDate` | `StudyTaskDTO[]` | `byStudentRange` |
| 4 | POST | `/study-tasks` | `CreateTaskRequest` | `StudyTaskDTO` (201) | `create` |
| 5 | PUT | `/study-tasks/update` | `UpdateTaskRequest` | `StudyTaskDTO` | `update` |
| 6 | DELETE | `/study-tasks` | body `{ taskId }` | success | `delete` |
| 7 | POST | `/study-tasks/complete` | `{ taskId }` | `StudyTaskDTO` | `complete` |
| 8 | POST | `/study-tasks/complete/batch` | `{ taskIds }` | `{ completedCount, failedIds }` | `completeBatch` |
| 9 | POST | `/study-tasks/log-study` | `LogTaskStudyRequest` | `StudyTaskDTO` | `logStudy` |
| 10 | POST | `/study-tasks/{taskId}/focus-session` | `{ durationMinutes, startedAt?, endedAt? }` | `FocusSessionDTO` (201) | `createFocusSession` |
| 11 | GET | `/study-tasks/{taskId}/focus-sessions` | `date?` | `FocusSessionDTO[]` | `getFocusSessions` |

> `DELETE /study-tasks` route parametresi değil **body** `{ taskId }` bekler.
> `teacherId` create body'sinde yoktur (JWT claim'den doldurulur).

---

## Hook'lar

| Hook | Açıklama |
|------|----------|
| `useTodayTasks(studentId)` | `qk.tasks.today` → bugünün görevleri |
| `useUpcomingTasks(studentId)` | `qk.tasks.upcoming` |
| `useTasksByRange(studentId, startDate, endDate)` | `qk.tasks.byRange` (tarih aralığı ≤ 90 gün); `placeholderData: keepPreviousData` |
| `useCreateTask()` | başarıda `qk.tasks.allForStudent()` (kök `["tasks"]`) invalidate |
| `useUpdateTask(studentId)` / `useDeleteTask(studentId)` | görevleri invalidate |
| `useCompleteTask(studentId)` | tekli onay |
| `useBulkCompleteTasks(studentId)` | `completeBatch` → `{ completedCount, failedIds }` |
| `useLogStudy(studentId)` | çalışma kaydı |
| `useFocusSessions(taskId, date?)` / `useCreateFocusSession(taskId)` | focus session |

`mq` invalidation notu: `qk.tasks.allForStudent()` kök `["tasks"]` prefix'i döndürür; böylece
today/upcoming/range/focus-session query'leri birlikte tazelenir.

---

## DTO → UI (Mapper)

- `mapStudyTaskToUi(dto)` → `Task`:
  `id=taskId`, `subject=lessonTitle`, `topic=topicTitle`, `questionCount=targetQuestions`,
  `completedQuestions=totalQuestions`, `status`: `isCompleted ? "completed" :
  (totalQuestions>0 ? "in-progress" : "pending")`.
  **Çalışılan süre (2026-10-10):** DTO'da `studiedHours` kaldırıldı; yerine `studiedMinutes`
  (toplam dakika) + `studiedSeconds` (0-59) gelir. UI `hoursStudied = (studiedMinutes*60 +
  studiedSeconds)/3600` olarak türetilir (görünümler `hoursStudied`'ı kullanmaya devam eder).
- `mapUiTaskFormToCreateRequest` → `CreateTaskRequest` (`taskType` her zaman `0`).
- `mapUiTaskToUpdateRequest` → `UpdateTaskRequest`.

---

## Çalışma Süreölçeri

- `useStudyTimer()`: timer store'daki geçen süreyi `log-study` ile göreve yazar. Backend değerleri
  **topladığı** için yalnızca bu oturumun artırımı gönderilir (`hours = geçen süre/3600`,
  `correctCount/wrongCount/emptyCount = 0`). İyimser olarak sıfırlar; hata olursa geri ekler.
  Tamamlanmış görevde `log-study` `409` döner. (`hoursStudied` DTO'nun
  `studiedMinutes`+`studiedSeconds` alanlarından türetilir.)
- `study-timer.store.ts` (`edc-study-timer`): `taskId`, `isRunning`, `accumulatedSeconds`,
  `segmentStartedAt` persist edilir; sayfa yenilemede çalışmaya devam eder.
- Focus session endpoint'leri service'te hazırdır (`FocusSessionDTO`: `id, taskId, studentId,
  date, durationMinutes, startedAt, endedAt?`).

---

## Akış / Notlar

- `/dashboard/tasks` → Günlük/Haftalık/Aylık sekmeler + `TaskModal`. Öğretmende öğrenci seçici
  (`useTeacherStudents`), öğrencide kendi id'si. **TaskModal "Ders" listesi öğrencinin atanmış
  dersleriyle sınırlıdır** (`filterLessonsByAssignment`; atama yoksa tüm dersler) — 2026-10-10.
- Öğretmen öğrenci detayında (`/teacher/students/{id}/daily`) `TeacherActions` "Toplu Onayla"
  butonu görüntülenen kapsamdaki tamamlanmamış görevleri (`useTasksByRange`) toplayıp
  `useBulkCompleteTasks` çağırır; toast'ta onaylanan/başarısız sayısı gösterilir. Kapsam görünüme göre
  **günlük → seçili gün**, **haftalık → görüntülenen hafta (Pzt–Paz)**, **aylık → görüntülenen ayın
  tamamı**'dır. Görüntülenen tarih `TaskViewDateProvider` ile görünümlerden paylaşılır (2026-10-10).
  Onay sonrası `["tasks"]` invalidate edildiğinden görünüm dinamik güncellenir.
- Hata kodları: `ERR_EMPTY_TITLE`, `ERR_INVALID_TARGET_HOURS`, `ERR_TASK_NOT_FOUND`,
  `ERR_TASK_ALREADY_COMPLETED`, `ERR_EMPTY_TASK_IDS`, `ERR_INVALID_DURATION`.
- **Backend davranış değişiklikleri (2026-10-10):**
  - `log-study` değerleri **toplar** (`StudiedHours += hours`, `CorrectCount += correct` ...).
    Frontend mutlak değer yerine **delta** gönderir (timer + günlük inline edit).
  - Tamamlanmış taska `log-study` → **409 Conflict** (`TaskAlreadyCompleted`). Günlük görünümde
    tamamlanmış görevin "Güncelle" butonu bu yüzden devre dışıdır.
  - `PUT /study-tasks/update` artık `isCompleted` (nullable) kabul eder; `isCompleted=false` ile
    tamamlanmış task geri açılır. Günlük görünümde checkbox toggle: açıkken `complete`, kapalıyken
    `update { isCompleted: false }` kullanır. `isCompleted` verilmezse durum korunur.
  - DTO `targetHours` en fazla 2 ondalığa yuvarlanır.
- **Saat gösterimi (2026-10-10):** `daily-tasks-view.tsx`'te günlük özet "Saat" kartı ve görev
  satırındaki `Saat: X` değeri **2 ondalık** (`toFixed(2)`) gösterilir.
