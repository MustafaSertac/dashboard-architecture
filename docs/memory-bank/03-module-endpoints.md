# 03 — Modüller ve Endpoint Kataloğu

> Tüm endpoint'ler `/api/v1.0` öneki altındadır; `Authorization: Bearer <accessToken>`
> (login/register/forgot-password/refresh-token/validate-code hariç). Response'lar
> `{ isSuccess, data }` envelope'u ile döner. Bu dosya özet katalogdur; detaylar
> `docs/memory-bank/{modül}.md`.

---

## Modül Özeti

| Modül | Servis | Hook'lar | Endpoint sayısı | Doküman |
|-------|--------|----------|:---:|---------|
| Auth | `auth.service.ts` | `useAuth` | 10 | [auth.md](modules/auth.md) |
| Profile | `profile.service.ts` (auth'u sarar) | `useProfile`, `useUpdateProfile` | 2 | [profile.md](modules/profile.md) |
| Analytics | `analytics.service.ts` | `useWeeklyAnalytics`, `useMonthlyAnalytics`, `useYearlyAnalytics`, `useDashboardOverview` | 4 | [analytics.md](modules/analytics.md) |
| Exams | `exam.service.ts` | `useExamList`, `useExamDetail`, `useExamTrends`, `useExamTrendsAll`, `useCreateExam`, `useUpdateExam`, `useDeleteExam` | 7 | [exams.md](modules/exams.md) |
| Lessons | `lesson.service.ts` | `useLessons`, `useLesson`, `useUnits`, `useTopics`, `useCreate/Update/Delete*`, `useStudentLessons`, `useStudentOwnLessons`, `useSetStudentLessons`, `useRemoveStudentLesson` | 17 | [lessons.md](modules/lessons.md) |
| Notes | `note.service.ts` | `useNotes`, `useCreateNote`, `useDeleteNote` | 3 | [notes.md](modules/notes.md) |
| Study Tasks | `study-task.service.ts` | `useTodayTasks`, `useUpcomingTasks`, `useTasksByRange`, `useCreate/Update/Delete/CompleteTask`, `useBulkCompleteTasks`, `useLogStudy`, `useFocusSessions`, `useCreateFocusSession` | 11 | [study-tasks.md](modules/study-tasks.md) |
| Teacher | `teacher.service.ts` | `useTeacherStudents`, `useAddStudent`, `useRemoveStudent` | 3 | [teacher.md](modules/teacher.md) |
| Organizations | `organization.service.ts` | `useMyOrganization`, `useCreateOrganization`, `useJoinOrganization`, `useUpdateVisibility`, `useOrganizationTeachers`, `useGenerateStudentCode`, `useGenerateTeacherCode`, `useGenerateMyStudentCode`, `useValidateCode` | 9 | [organizations.md](modules/organizations.md) |
| **Toplam** | | | **64** | |

Endpoint tanımları: `src/lib/api/endpoints.ts`
Query key'leri: `src/lib/query/keys.ts`

---

## Hızlı Endpoint Kataloğu

### Auth
```
POST   /auth/login
POST   /auth/student
POST   /auth/teacher
POST   /auth/refresh-token
POST   /auth/logout
POST   /auth/forgot-password/request
POST   /auth/forgot-password/verify
POST   /auth/forgot-password/reset
GET    /auth/profiles/{userId}
PUT    /auth/profiles
```

### Analytics
```
GET    /analytics/weekly?studentId&weekStart
GET    /analytics/monthly?studentId&year&month&perSubject
GET    /analytics/yearly?studentId&year&perSubject
GET    /analytics/dashboard?studentId
```

### Exams
```
GET    /exams?studentId&page&pageSize
GET    /exams/{id}?detailed
GET    /exams/trends?studentId&examCode&limit
GET    /exams/trends/all?examCode&limit&teacherId
POST   /exams
PUT    /exams/{id}
DELETE /exams/{id}
```

### Lessons / Units / Topics
```
GET    /lessons?examType
GET    /lessons/{lessonId}
POST   /lessons
PUT    /lessons/{lessonId}
DELETE /lessons/{lessonId}
GET    /lessons/{lessonId}/units
POST   /lessons/{lessonId}/units
PUT    /units/{unitId}
DELETE /units/{unitId}
GET    /units/{unitId}/topics
POST   /units/{unitId}/topics
PUT    /topics/{topicId}
DELETE /topics/{topicId}
# StudentLessons (ogretmen -> ogrenci ders atama)
GET    /teachers/{teacherId}/students/{studentId}/lessons
PUT    /teachers/{teacherId}/students/{studentId}/lessons   # body: { lessonIds } (replace-all)
DELETE /teachers/{teacherId}/students/{studentId}/lessons/{lessonId}
GET    /students/{studentId}/lessons                         # ogretmenler arasi birlesim
```

### Notes
```
GET    /students/{studentId}/notes
POST   /students/{studentId}/notes
DELETE /students/{studentId}/notes/{noteId}
```

### Study Tasks
```
GET    /study-tasks/today/{studentId}
GET    /study-tasks/upcoming/{studentId}?limit
GET    /study-tasks/students/{studentId}?startDate&endDate
POST   /study-tasks
PUT    /study-tasks/update            # isCompleted (nullable) ile tamamlanmis task acilip kapanabilir
DELETE /study-tasks                 # body: { taskId }
POST   /study-tasks/complete
POST   /study-tasks/complete/batch  # body: { taskIds }
POST   /study-tasks/log-study       # degerleri TOPLAR (delta gonderilir); tamamlanmissa 409
POST   /study-tasks/{taskId}/focus-session
GET    /study-tasks/{taskId}/focus-sessions?date
```

### Teacher / Students
```
GET    /teachers/{teacherId}/students                      # gorunurluk kuralina tabi
POST   /teachers/{teacherId}/students                      # body: { studentId }
DELETE /teachers/{teacherId}/students/{studentId}
POST   /teachers/me/codes                                  # ogrenci kayit kodu uret
```

### Organizations
```
POST   /organizations                          # organizasyon olustur
POST   /organizations/join                     # TeacherJoin koduyla katil
GET    /organizations/me                       # uye olunan org (yoksa 404)
PATCH  /organizations/me/visibility            # { canViewAllStudents }
GET    /organizations/{id}/teachers            # org ogretmenleri
POST   /organizations/{id}/codes               # ogrenci kayit kodu uret
POST   /organizations/{id}/teacher-codes       # ogretmen katilim kodu uret
POST   /organizations/codes/validate           # kodu harcamadan dogrula (AllowAnonymous)
```

---

## Önemli Sözleşme Notları

- **DTO → UI:** Her modül service'i ham DTO döner; hook katmanı mapper ile UI modeline çevirir.
- **JWT claim alanları:** `teacherId` (study-tasks create, notes create) backend tarafından
  JWT'den doldurulur, body'ye konmaz.
- **Öğrenci kaydı:** `POST /auth/student` → `StudentRegisterRequest.code` (8 haneli davet kodu,
  karışmayan alfabe `A-Z` sans I/O ve `2-9`; **frontend zorunlu tutar**) + `isKvkVerified`.
- **Öğretmen kaydı:** `POST /auth/teacher` → `organizationCode?` (TeacherJoin kodu, opsiyonel).
- **Organizasyon görünürlüğü:** `GET /teachers/{id}/students` — org üyesi + `canViewAllStudents`
  ise org geneli, aksi halde yalnızca kendi öğrencileri (kural backend'de).
- **`UserProfileResponse`:** `organizationId?: string | null` alanı eklendi.
- **Kod doğrulama:** `POST /organizations/codes/validate` kodu **harcamaz** (AllowAnonymous); 200 +
  `{ valid, type?, organizationId?, teacherId?, expiresAt? }` döner.
- **`PUT /exams/{id}`:** `examId`, `examDate`, `examName` zorunlu (status-only güncellemede bile).
- **AYT `scoreType`:** Yalnızca AYT için zorunlu (1=SAY, 2=EA, 3=SÖZ; 4=DİL reddedilir).
  TYT'de gönderilmez.
- **DELETE body:** `DELETE /study-tasks` route parametresi değil body `{ taskId }` bekler.
- **Tarih formatı:** Query param'larında `yyyy-MM-dd` (`DateOnly`).
- **`refresh-token` AllowAnonymous:** 401 refresh akışı Bearer header göndermeden çağırır.
- **Hata kodları kataloğu:** `docs/BackendTalep.md` §7 ve `src/app/FRONTEND_INTEGRATION.md` §7.
