# Frontend Entegrasyon Durumu

> **Durum:** Backend tamamlandı. Tüm fallback'ler (mock/simüle) kaldırıldı, frontend gerçek API'ye tam bağlı.
>
> **Tarih:** 07.09.2026
> **İlgili dokümanlar:** `docs/BackendTalep.md` (API sözleşmesi), `docs/TEST_SENARYOLARI.md` (testler), `src/app/FRONTEND_INTEGRATION.md` (tam API referansı)

---

## 1. Entegrasyon Özeti

| Modül | Durum |
|-------|-------|
| Auth (login, register, logout, refresh, profile, forgot-password 3-adım) | ✅ Gerçek API |
| Study Tasks (today, upcoming, range, create, update, delete, complete, batch, log-study) | ✅ Gerçek API |
| Focus session (create/get) | ✅ Gerçek API |
| Exams (list, detail, trends, trendsAll, create, update, delete) | ✅ Gerçek API |
| Analytics (weekly, monthly, yearly, dashboard, perSubject) | ✅ Gerçek API |
| Teacher öğrenci listesi | ✅ Gerçek API (`GET /teachers/{id}/students`) |
| Teacher öğrenci yönetimi (ekle/kaldır) | ✅ Gerçek API |
| Notlar (Notes) | ✅ Gerçek API |
| Lessons / Units / Topics (TaskModal bağlı) | ✅ Gerçek API (kademeli seçim: ders→ünite→konu) |
| Profil sayfası | ✅ Gerçek API (`GET/PUT /auth/profiles`) |

## 2. Bu Oturumda Yapılan Değişiklikler

### Lessons/Units/Topics entegrasyonu
- `lesson.service.ts` → 13 metod (list, getById, create, update, delete, getUnits, createUnit, updateUnit, deleteUnit, getTopics, createTopic, updateTopic, deleteTopic)
- `useLessons.ts` → 9 mutation hook (create/update/delete lesson/unit/topic)
- `TaskModal` → hardcoded `TYT_SUBJECTS`/`TOPICS_BY_SUBJECT` kaldırıldı; gerçek `useLessons`/`useUnits`/`useTopics` ile kademeli seçim
- `CreateTaskRequest` → gerçek `lessonId`/`unitId`/`topicId` gönderilir

### Teacher öğrenci yönetimi
- `teacher.service.ts` → `addStudent`/`removeStudent` eklendi
- `student-list.tsx` → "Öğrenci Ekle" dialog + "Kaldır" AlertDialog

### Profil sayfası
- Yeni `/dashboard/profile` sayfası → `useProfile`/`useUpdateProfile`
- Sidebar'a "Profil" linki eklendi

### Exam UI tamamlama
- `exam-results-table.tsx` → silme butonu (AlertDialog) + `useDeleteExam`
- Bug fix: `examCode: 0` kaldırıldı (status-only update)

### Direkt entegrasyon temizliği
- `study-task.mapper.ts` → `MapContext`/fallback'ler kaldırıldı; DTO'dan doğrudan
- `study-task.types.ts` → `studentId`/`dueDate`/`createdAt` zorunlu alanlar
- `exam.mapper.ts` → `correct ?? 0`/`questionNumbers ?? []` fallback'leri kaldırıldı
- `analytics.mapper.ts` → courses-derivation fallback kaldırıldı

### Fallback kaldırma (önceki oturum)
- `teacher.service.ts` → mock fallback kaldırıldı
- `note.service.ts` → simüle fallback kaldırıldı
- `useStudyTasks.ts` (`useBulkCompleteTasks`) → per-task fallback kaldırıldı
- `src/lib/mock/mock-data.ts` + `mock-users.ts` → silindi

### Yeni özellik bağlama (önceki oturum)
- **#7** Toplu sınav trend: `useExamTrendsAll` + `ExamTrendsChart` "all students" modu
- **#8** Ders bazlı analiz: `perSubject=true` param + `perSubjectStats` tüketimi
- **#9** Forgot-password 3-adım: `/forgot-password` + `/reset-password`
- **#10** Focus session: `StudyTimerCard` localStorage → focus-session endpoint
- **#6** Toplu Onayla butonu: `useBulkCompleteTasks`
- **H-1** `teachter` → `teacher` düzeltildi

### Loading & Error states
- `src/components/ui/error-state.tsx` (HTTP status + hata kodu + mesaj + "Tekrar Dene")
- Tüm dashboard/task/exam/analytics/teacher component'lerine loading (skeleton) + error (ErrorState)

## 3. Test Altyapısı

- Vitest + @testing-library/react + jsdom kuruldu (`npm run test:run`)
- 15 test dosyası, ~65 test (service + mapper + component)
- Detay: `docs/TEST_SENARYOLARI.md`

## 4. Bilinen Kapsam Dışı

- Lessons/Units/Topics admin CRUD UI (service/hook hazır; TaskModal'a bağlı; ayrı yönetim sayfası yok)
- StudyTimerCard çoklu-görev toplama (tek task'a bağlı)
- `eslint` projede kurulu değil
