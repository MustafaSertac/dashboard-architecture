# Frontend Güncelleme Rehberi — Backend Tamamlandı

> **Tarih:** 17.08.2026
> **Kapsam:** Bu oturumda backend'e eklenen endpoint/DTO'ların frontend tarafında nasıl karşılanacağı.
> **Muhatap:** Frontend Geliştirme Ekibi
> **Referans:** `FRONTEND_INTEGRATION.md` (tam API sözleşmesi), `docs/BackendTalep.md` (orijinal talepler)

---

## Bu oturumda backend'e eklenenler

| # | Talep | Backend durumu |
|---|-------|----------------|
| #5 | Not/Feedback | ✅ `GET/POST/DELETE /api/v1.0/students/{studentId}/notes` |
| #6 | Toplu görev onaylama | ✅ `POST /api/v1.0/study-tasks/complete/batch` |
| #7 | Toplu sınav trend | ✅ `GET /api/v1.0/exams/trends/all?examCode=&limit=&teacherId=` |
| #8 | Ders bazlı analiz | ✅ `?perSubject=true` + `perSubjectStats` |
| #9 | Forgot-password email | ✅ 3 endpoint (request/verify/reset) + Outlook SMTP |
| #10 | Focus session | ✅ `POST /study-tasks/{taskId}/focus-session` + `GET .../focus-sessions` |
| — | (önceki oturum) | #1 `dueDate`, #3 `correct`+`questionNumbers`, #4 ek alanlar, H-1 `teachter`→`teacher` |

**Not:** #2 (öğretmen-öğrenci listesi) backend'te zaten `GET /teachers/{teacherId}/students` olarak mevcut. Frontend'in `students.listByTeacher`'ı bu rotaya güncellemesi gerekiyor (aşağıda).

---

## Frontend'de yapılacak değişiklikler

### #2 — Öğretmen-öğrenci listesi (route güncelle)

Backend route `GET /api/v1.0/teachers/{teacherId}/students` (geri dönen `TeacherStudentDTO[]` değişmedi).

**Yapılacak:**
- `src/lib/api/endpoints.ts` içinde `students.listByTeacher` → `GET /teachers/{teacherId}/students` olarak güncelle.
- `src/modules/teacher/services/teacher.service.ts` içindeki mock fallback `catch` bloğunu kaldır.
- `src/lib/mock/mock-users.ts` + `src/lib/mock/mock-data.ts` artık güvenle silinebilir.

### #5 — Not/Feedback (mock kaldır)

**Endpoint'ler:**
```
POST   /api/v1.0/students/{studentId}/notes   { category, note }   -> NoteDTO (201)
GET    /api/v1.0/students/{studentId}/notes                          -> NoteDTO[]
DELETE /api/v1.0/students/{studentId}/notes/{noteId}                 -> { message }
```
- `category`: `feedback` | `performance` | `improvement` | `praise`
- `note`: max 2000 karakter
- `teacherId` backend tarafından JWT claim'den doldurulur (body'ye koymaya gerek yok)

**Yapılacak:**
- `src/modules/notes/services/note.service.ts` içindeki simüle `catch` bloklarını (bellek-içi depo + `setTimeout`) kaldır.

### #6 — Toplu görev onaylama (bulk complete)

**Endpoint:**
```
POST /api/v1.0/study-tasks/complete/batch   { taskIds: string[] }
-> { completedCount: number, failedIds: string[] }
```
- `failedIds`: bulunamayan veya zaten tamamlanmış task'ların ID'leri.

**Yapılacak:**
- `src/modules/study-tasks/hooks/useStudyTasks.ts` (`useBulkCompleteTasks`) ve `study-task.service.ts` (`completeBatch`) içindeki per-task fallback'i kaldır.
- `TeacherActions` "Toplu Onayla" butonuna `useBulkCompleteTasks` bağla (seçili task state'i ile birlikte — kapsam dışı kalmıştı).

### #7 — Toplu sınav trend (all students)

**Endpoint:**
```
GET /api/v1.0/exams/trends/all?examCode=10&limit=10&teacherId=...
-> StudentTrendDTO[]
```
- `teacherId` opsiyonel; verilmezse tüm öğrenciler, verilirse o öğretmenin öğrencileri.
- `StudentTrendDTO = { studentId, studentName, exams: ExamSummaryDTO[] }`

**Yapılacak:**
- `src/components/exams/exam-trends-chart.tsx` içinde "all students" karşılaştırma modunu geri ekle; `endpoints.exams.trendsAll` kullan.

### #8 — Ders bazlı analiz

**Endpoint değişikliği:**
```
GET /api/v1.0/analytics/monthly?studentId=X&year=Y&month=M&perSubject=true
GET /api/v1.0/analytics/yearly?studentId=X&year=Y&perSubject=true
```
- `perSubject=true` ise response'a `perSubjectStats: PerSubjectStats[]` eklenir:
  `{ subject, totalHours, totalQuestions, completedCount, pendingCount }`

**Yapılacak:**
- `useMonthlyAnalytics` / `useYearlyAnalytics` çağrılarına `perSubject=true` query param'ı ekle.
- `MonthlyAnalytics` / `YearlyAnalytics` bileşenlerinde `perSubjectStats`'ı tüket.

### #9 — Forgot-password email akışı

**Yeni akış (3 endpoint):**
```
POST /api/v1.0/auth/forgot-password/request   { email }              -> { message }  (email yoksa bile 200)
POST /api/v1.0/auth/forgot-password/verify    { token }              -> { valid: boolean }
POST /api/v1.0/auth/forgot-password/reset     { token, newPassword } -> { message }
```
- `request` → backend Outlook SMTP üzerinden token içeren link gönderir.
- Link formatı: `{EmailSettings.ResetUrlBase}?token=...` (dev: `http://localhost:3000/reset-password?token=...`)
- Token 30 dk geçerli, tek kullanımlık.

**Yapılacak:**
- `src/app/forgot-password/page.tsx` → önce email girişi + `request`, sonra token doğrulama (`verify`) ve yeni şifre + `reset` akışına böl.
- Eski `POST /auth/forgot-password` (`{email, newPassword}`) **deprecated**; `Deprecation: true` header'ı döner. Geçiş tamamlanınca kaldırılacak.

### #10 — Çalışma sayacı (focus session)

**Endpoint'ler:**
```
POST /api/v1.0/study-tasks/{taskId}/focus-session
     { durationMinutes, startedAt?, endedAt? }   -> FocusSessionDTO (201)

GET  /api/v1.0/study-tasks/{taskId}/focus-sessions?date=yyyy-MM-dd
                                                 -> FocusSessionDTO[]
```
- `FocusSessionDTO = { id, taskId, studentId, date, durationMinutes, startedAt, endedAt? }`
- `studentId` backend tarafından task'tan çözülür.

**Yapılacak:**
- `StudyTimerCard` artık localStorage yerine bu endpoint'leri kullanabilir.

---

## Backend tarafından dikkat edilecekler (deploy)

1. **Migration:** 2 yeni migration uygulanacak (startup'ta otomatik):
   - `AddNotesAndPasswordResetTokens` (UserDb)
   - `AddFocusSessions` (TaskDb)
2. **EmailSettings** (Outlook SMTP) `appsettings.json` veya user-secrets'e eklenmeli:
   ```json
   "EmailSettings": {
     "SmtpHost": "smtp.office365.com",
     "SmtpPort": 587,
     "SmtpUser": "sizin@outlook.com",
     "SmtpPass": "****",
     "FromEmail": "sizin@outlook.com",
     "FromName": "ProKoc",
     "ResetUrlBase": "https://app.prokoc.com/reset-password"
   }
   ```
3. **MailKit** paketi `ProKocCore`'a eklendi (Outlook SMTP gönderimi için).

---

## Fallback kaldırma sırası

Aşağıdaki fallback'ler artık güvenle kaldırılabilir:

1. `teacher.service.ts` → mock fallback (#2)
2. `note.service.ts` → simüle fallback (#5)
3. `study-task.service.ts` / `useStudyTasks.ts` → `completeBatch` per-task fallback (#6)
4. `src/lib/mock/mock-data.ts` + `src/lib/mock/mock-users.ts` → tamamen sil
5. Mapper'lardaki `fallback*` parametreleri (opsiyonel)
