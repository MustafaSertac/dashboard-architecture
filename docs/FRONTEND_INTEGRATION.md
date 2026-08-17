# Frontend Entegrasyon Durumu ve Backend Eksiklikleri

> **Durum:** Frontend, backend API'ye "gerçekmiş gibi" entegre edildi. Backend'de olmayan alan/endpoint'ler frontend tarafında geçici çözümler (fallback) ile dolduruldu ve kod içinde `BACKEND EKSIK #X` yorumlarıyla işaretlendi.
>
> **Tarih:** 17.08.2026
> **İlgili dokümanlar:** `docs/BackendTalep.md` (backend talepleri), `src/app/FRONTEND_INTEGRATION.md` (tam API rehberi)

---

## 1. Yapılan Entegrasyon Özeti

| Modül | Durum |
|-------|-------|
| Auth (login, register, logout, refresh, profile, forgot-password) | ✅ Gerçek API'ye bağlı |
| Study Tasks (today, upcoming, range, create, update, delete, complete, log-study) | ✅ Gerçek API'ye bağlı |
| Exams (list, detail, trends, create, update) | ✅ Gerçek API'ye bağlı |
| Analytics (weekly, monthly, yearly, dashboard) | ✅ Gerçek API'ye bağlı |
| Lessons / Units / Topics | ⚠️ Service + hook hazır; UI henüz bağlanmadı |
| Teacher öğrenci listesi | ⚠️ Gerçekmiş gibi implement edildi (mock fallback) |
| Notlar (Notes) | ⚠️ Gerçekmiş gibi implement edildi (simüle fallback) |
| Toplu görev onayı (Bulk Complete) | ⚠️ Gerçekmiş gibi implement edildi (per-task fallback) |

### Kaldırılan mock katmanı

- `src/lib/context.tsx` (`AppProvider` + `useApp`) — **silindi**
- `src/lib/student-context.tsx` — artık gerçek `useTeacherStudents` hook'una dayanıyor (mock yok)
- Tüm component'lerdeki `useApp()` / mock import'ları kaldırıldı

`src/lib/mock/mock-data.ts` ve `src/lib/mock/mock-users.ts` dosyaları **sadece** `teacher.service.ts` içindeki mock fallback için tutuluyor (aşağıdaki Eksik #2 tamamlandığında silinebilir).

---

## 2. Gerçekmiş Gibi Implement Edilen Backend Eksiklikleri

Aşağıdaki her eksiklik frontend'de kod içinde `BACKEND EKSIK #X` yorumuyla işaretlenmiştir. Backend tamamlandığında yalnızca belirtilen dosyalar güncellenir.

### Eksik #1 — `StudyTaskDTO.dueDate` (KRİTİK)

**Ne yapıldı:** `StudyTaskDTO`'ya `dueDate?: string` eklendi. Mapper `dto.dueDate ?? fallbackDate` kullanıyor. Hook'lar fallback tarih sağlıyor:
- `useTodayTasks` → bugünün tarihi
- `useUpcomingTasks` → bugünün tarihi
- `useTasksByRange` → tek-gün aralığında `startDate`, çoklu-gün aralığında bugün

**Kısıt:** Çoklu-gün aralıklarında (`WeeklyTasksView`, `MonthlyTasksView`, `WeeklyAnalytics`) gün bazlı dağılım backend `dueDate` dönene kadar hatalı çalışır (tüm task'lar aynı güne düşer).

**İşaretli dosyalar:**
- `src/modules/study-tasks/types/study-task.types.ts`
- `src/modules/study-tasks/mappers/study-task.mapper.ts`
- `src/modules/study-tasks/hooks/useStudyTasks.ts`
- `src/components/tasks/weekly-tasks-view.tsx`
- `src/components/tasks/monthly-tasks-view.tsx`
- `src/components/analytics/weekly-analytics.tsx`

**Backend tamamlanınca:** `mapStudyTaskToUi`'de `dto.dueDate` zaten okunuyor; fallback'ler kendiliğinden devre dışı kalır. Ek değişiklik gerekmez.

---

### Eksik #2 — Öğretmen-Öğrenci liste endpoint'i (YÜKSEK)

**Ne yapıldı:** Yeni `src/modules/teacher/` modülü oluşturuldu (`useTeacherStudents`). `teacherService.listByTeacher()` önce `GET /students?teacherId=` dener, 404/405 gelirse `MOCK_USERS` + `mockTasks` ile istatistik üretir.

**İşaretli dosyalar:**
- `src/modules/teacher/services/teacher.service.ts`
- `src/modules/teacher/hooks/useTeacher.ts`
- `src/lib/api/endpoints.ts` (`students.listByTeacher`)
- `src/lib/student-context.tsx`

**Backend tamamlanınca:** `teacher.service.ts` içindeki `catch` bloğu (mock fallback) kaldırılır, `TeacherStudentDTO` response'u doğrudan döner.

---

### Eksik #3 — `ExamTopicResultDTO.correct` ve `questionNumbers` (YÜKSEK)

**Ne yapıldı:** `ExamTopicResultDTO`'ya `correct?` ve `questionNumbers?` eklendi. Mapper `tr.correct ?? 0` ve `tr.questionNumbers ?? []` fallback'i kullanıyor.

**İşaretli dosyalar:**
- `src/modules/exams/types/exam.types.ts`
- `src/modules/exams/mappers/exam.mapper.ts`

**Backend tamamlanınca:** Mapper'daki fallback kendiliğinden gereksiz olur.

---

### Eksik #4 — `StudyTaskDTO.teacherId/studentId/createdAt/updatedAt` (YÜKSEK)

**Ne yapıldı:** `StudyTaskDTO`'ya bu alanlar opsiyonel olarak eklendi. Mapper `dto.studentId ?? ctx.fallbackStudentId`, `dto.createdAt ?? now` fallback'lerini kullanıyor.

**İşaretli dosyalar:**
- `src/modules/study-tasks/types/study-task.types.ts`
- `src/modules/study-tasks/mappers/study-task.mapper.ts`

**Backend tamamlanınca:** Fallback'ler kendiliğinden devre dışı kalır.

---

### Eksik #5 — Not/Feedback endpoint'i (ORTA)

**Ne yapıldı:** Yeni `src/modules/notes/` modülü oluşturuldu (`useNotes`, `useCreateNote`, `useDeleteNote`). `noteService` önce `POST /students/{id}/notes` dener, 404 gelirse bellek-içi depo + `setTimeout(500)` ile simüle eder. `NoteModal` artık gerçek hook'u çağırıyor.

**İşaretli dosyalar:**
- `src/modules/notes/services/note.service.ts`
- `src/modules/notes/hooks/useNotes.ts`
- `src/modules/notes/types/note.types.ts`
- `src/lib/api/endpoints.ts` (`notes.*`)
- `src/components/teacher/note-modal.tsx`

**Backend tamamlanınca:** `note.service.ts` içindeki `catch` blokları kaldırılır.

---

### Eksik #6 — Toplu görev onaylama (Bulk Complete) (ORTA)

**Ne yapıldı:** `useBulkCompleteTasks` hook'u eklendi. Önce `POST /study-tasks/complete/batch` dener, 404/405 gelirse her task için `POST /study-tasks/complete`'i sırayla çağırır.

**İşaretli dosyalar:**
- `src/modules/study-tasks/hooks/useStudyTasks.ts` (`useBulkCompleteTasks`)
- `src/modules/study-tasks/services/study-task.service.ts` (`completeBatch`)
- `src/lib/api/endpoints.ts` (`studyTasks.completeBatch`)

**Not:** `TeacherActions`'taki "Toplu Onayla" butonu şu an hâlâ onClick'sizdir. `useBulkCompleteTasks` bağlanması için `TeacherActions` + seçili task'lara erişim gerekir (kapsam dışı bırakıldı).

---

### Eksik #7 — Toplu sınav trend endpoint'i (ORTA)

**Ne yapıldı:** `endpoints.exams.trendsAll` tanımlandı (`GET /exams/trends/all`). Frontend şu an tek öğrenci trend'ini `useExamTrends` ile çeker; "all students" karşılaştırma modu `ExamTrendsChart`'tan kaldırıldı (tek öğrenci moduna sadeleştirildi).

**İşaretli dosyalar:**
- `src/lib/api/endpoints.ts` (`exams.trendsAll`)
- `src/components/exams/exam-trends-chart.tsx`

**Backend tamamlanınca:** Çok-öğrenci karşılaştırma yeniden eklenebilir.

---

### Eksik #8 — Ders bazlı analiz özeti (ORTA)

**Ne yapıldı:** `MonthlyAnalytics` ve `YearlyAnalytics` artık `useMonthlyAnalytics` / `useYearlyAnalytics` hook'larını kullanıyor. Backend per-subject kırılım dönmediği için `courseStats`/`subjectStats` boş gelebilir.

**İşaretli dosyalar:**
- `src/components/analytics/monthly-analytics.tsx`
- `src/components/analytics/yearly-analytics.tsx`

**Backend tamamlanınca:** `?perSubject=true` query param eklendiğinde veri kendiliğinden dolar.

---

### Eksik #9 — Forgot-password email doğrulama akışı (DÜŞÜK)

**Ne yapıldı:** `/forgot-password` sayfası eklendi; `useAuth().forgotPassword` mevcut `POST /auth/forgot-password` endpoint'ini (`{email, newPassword}`) çağırıyor.

**İşaretli dosyalar:**
- `src/app/forgot-password/page.tsx`
- `src/modules/auth/hooks/useAuth.ts`

**Backend tamamlanınca:** Email doğrulama linki/token akışı eklendiğinde form güncellenir.

---

### Eksik #10 — Çalışma sayacı (Study Timer) (DÜŞÜK)

**Durum:** `StudyTimerCard` hâlâ sadece localStorage'a yazıyor; backend focus-session endpoint'i yok. Değişiklik yapılmadı.

---

### Eksik #11 — Profil resmi (avatar) upload (DÜŞÜK)

**Durum:** Upload endpoint'i yok. Değişiklik yapılmadı.

---

### Hata H-1 — `POST /auth/teachter` yazım hatası

**Durum:** `endpoints.auth.registerTeacher` hâlâ `/auth/teachter` olarak tanımlı (backend kaynak kodundaki yazımla uyumlu). Backend `/auth/teacher` olarak düzeltince güncellenir.

**İşaretli dosya:** `src/lib/api/endpoints.ts`

---

## 3. Backend Tamamlandığında Yapılacak Geçiş

1. `teacher.service.ts` → mock fallback catch bloğunu kaldır
2. `note.service.ts` → simüle catch bloklarını kaldır
3. `study-task.service.ts` → `completeBatch` catch fallback'i hook seviyesinde zaten var; hook'taki try/catch kaldırılabilir
4. `src/lib/mock/mock-data.ts` + `src/lib/mock/mock-users.ts` → silinebilir
5. Mapper'lardaki `fallback*` parametreleri gereksiz kalır (opsiyonel, kaldırılabilir)

## 4. Kapsam Dışı Bırakılanlar

- `TeacherActions` "Toplu Onayla" butonuna `useBulkCompleteTasks` bağlanmadı (seçili task state'i gerekli)
- `Lessons/Units/Topics` UI'ları bağlanmadı (mevcut UI'da kullanılmıyor)
- Zod validator'ları (`auth.schema.ts`, `study-task.schema.ts`) formlara bağlanmadı
