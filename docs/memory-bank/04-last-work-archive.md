# 04 — En Son Ne Yaptık (Arşiv)

> `04-last-work.md` taşan eski changelog girişleri. En yeni en üstte. Aktif/özet günlük:
> `04-last-work.md` (yalnızca son 10 giriş tutulur).

---

## 2026-10-10 (4) — Toplu onay: aylık görünümde tüm ay

Aylık görünümde "Toplu Onayla" artık görüntülenen **takvim ayının tamamını** onaylar
(günlük/haftalık görünümde hafta kapsamı korunur).

- `teacher-actions.tsx` — kapsam `viewType`'a göre: `monthly` → `startOfMonth`/`endOfMonth`,
  diğerleri → `startOfWeek`/`endOfWeek` (Pzt–Paz). `viewDate` görüntülenen aydan gelir
  (monthly view `currentMonth`'u yayınlar).

**Doğrulama:** `npx tsc --noEmit` temiz, `npm run test:run` 102/102, `npm run build` başarılı.

> Aktarım: `modules/study-tasks.md`, `02-architecture.md`, `TEST_SENARYOLARI.md` (S6).

---

## 2026-10-10 (3) — Toplu onay: görüntülenen haftaya göre

"Toplu Onayla" artık sabit takvim haftası yerine **görüntülenen tarihe göre** haftayı onaylar
(günlük görünümde seçili gün, haftalık görünümde gezinilen hafta, aylıkta görüntülenen ayın haftası).

- **Yeni `src/lib/task-view-date-context.tsx`** — `TaskViewDateProvider` / `useTaskViewDate`
  (`viewDate`, `setViewDate`; `useMemo` ile stabil). `[studentId]/layout.tsx` bu provider'ı sarar.
- `daily-tasks-view.tsx`, `weekly-tasks-view.tsx`, `monthly-tasks-view.tsx` — kendi seçili tarih/
  hafta/ay state'ini `setViewDate` ile yayınlar.
- `teacher-actions.tsx` — hafta `viewDate`'ten hesaplanır (`startOfWeek`/`endOfWeek`, Pzt–Paz);
  `useTasksByRange` query key'i görüntülenen haftaya göre değişir.
- `test-utils.tsx` — `renderWithProviders`'a `TaskViewDateProvider` eklendi.

**Doğrulama:** `npx tsc --noEmit` temiz, `npm run test:run` 102/102, `npm run build` başarılı.

> Aktarım: `modules/study-tasks.md`, `02-architecture.md`, `TEST_SENARYOLARI.md` (S6).

---

## 2026-10-10 (2) — Toplu onay: hafta kapsamı + dinamik güncelleme

Öğretmen "Toplu Onayla" aksiyonu bugünün görevleri yerine **içinde bulunulan haftanın**
görevlerini onaylayacak şekilde güncellendi.

- `teacher-actions.tsx` — `useTodayTasks` yerine `useTasksByRange(studentId, weekStart, weekEnd)`
  (Pzt–Paz) kullanılıyor; tamamlanmamış id'ler hafta üzerinden toplanıyor.
- Onay sonrası `useBulkCompleteTasks` `["tasks"]` prefix'ini invalidate ettiğinden günlük/haftalık
  görünüm otomatik yenilenir (dinamik; manuel refresh gerekmez).
- `teacher-actions.test.tsx` — mock `useTasksByRange`'e çevrildi.

**Doğrulama:** `npx tsc --noEmit` temiz, `npm run test:run` 102/102, `npm run build` başarılı.

> Aktarım: `TEST_SENARYOLARI.md` (S6).

---

## 2026-10-10 — Öğrenci detay sayfasında sonsuz render döngüsü düzeltmesi

`/teacher/students/{studentId}/*` sayfalarında "Maximum update depth exceeded" hatası giderildi.

- **Kök neden:** `StudentProvider` (`src/lib/student-context.tsx`) her render'da `studentsWithStats`
  dizisini yeniden üretiyordu. `layout.tsx` effect'i bu diziye bağlı olduğundan
  `setSelectedStudent` → provider re-render → yeni dizi → effect tekrar = sonsuz döngü.
- **Düzeltme:**
  - `student-context.tsx` — `studentsWithStats` `useMemo([teacherStudents])`; context değeri `useMemo`;
    `setSelectedStudent` referansı `useCallback` ile sabitlendi (stabilite).
  - `[studentId]/layout.tsx` — effect içinde `selectedStudentRef` ile son seçili öğrenci okunur
    (`selectedStudent?.id !== student.id` guard'ı); bağımlılık dizisi **sabit boyutta** tutulur
    (`[studentId, studentsWithStats, setSelectedStudent, router]`) — HMR'de "useEffect deps changed
    size" hatası önlenir. Gereksiz `setState` yapılmıyor.

**Doğrulama:** `npx tsc --noEmit` temiz, `npm run test:run` 102/102, `npm run build` başarılı.

> Aktarım: `modules/teacher.md` (not), `TEST_SENARYOLARI.md` (S27), `02-architecture.md`.

---

## 2026-09-27 (3) — Organization modülü frontend entegrasyonu

Backend'de hazır olan Organization + kayıt-kodu bounded context'i frontend'e bağlandı.

- **Yeni `organizations` modülü:** `types/organization.types.ts`, `services/organization.service.ts`,
  `hooks/useOrganizations.ts`; `endpoints.organizations` + `endpoints.teachers.myCodes`; `qk.organizations.*`.
- **`/teacher/organization` sayfası** (sidebar'a "Organizasyon"): org oluştur/katıl, "Tüm öğrencileri
  gör" Switch'i (`PATCH visibility`), org öğretmenleri, öğrenci + öğretmen kodu üretimi (kopyala).
- **`/teacher/students`:** "Ogrenci Kodu Uret" (`POST /teachers/me/codes`) → kod dialog'u.
- **Register güncellemesi:** öğrenci kodu **8 karakter** (alfabe `A-Z` sans I/O + `2-9`) ve
  `POST /organizations/codes/validate` ile **canlı doğrulama** (zorunlu); öğretmene opsiyonel
  `organizationCode` (TeacherJoin). `useAuth.register` artık `RegisterInput` objesi alır.
- **Auth tipleri/store:** `UserProfileResponse.organizationId`, `AuthUser.organizationId`,
  `TeacherRegisterRequest.organizationCode`.
- **Test:** `organization.service.test.ts` (9 test) eklendi.

**Doğrulama:** `npx tsc --noEmit` temiz, `npm run test:run` 102/102, `npm run build` başarılı
(`/teacher/organization` route'u üretildi). Canlı backend: `teachers/me/codes` 201, `codes/validate` 200,
`organizations/me` üye değilse 404.

> Aktarım: `modules/organizations.md` (yeni), `03` (51→60 endpoint), `02`, `modules/auth.md`,
> `TEST_SENARYOLARI.md` (S24–S26), `01`.

---

## 2026-09-27 (2) — Çalışma kuralları + doküman senkronu

- **`docs/memory-bank/07-rules.md` oluşturuldu** — her oturumda ilk okunan zorunlu akış
  (ilgili testleri koş → build/typecheck → md güncelle → eksikleri yaz → tamamlananı sil/aktar).
- **`AGENTS.md` (repo kökü) oluşturuldu** — agentları `07-rules.md`'ye yönlendirir.
- **`dashboard-architecture.zip` silindi** — mock dönemine ait eski snapshot (uyumsuzdu).
- **`src/app/FRONTEND_INTEGRATION.md` güncellendi:** Vite proxy → Next.js rewrite,
  `/auth/teachter` → `/auth/teacher` (+ deprecated notu), `refresh-token` AllowAnonymous notu,
  endpoint sayısı 39 → 51, `DashboardOverviewDTO`'ya `currentStreak`/`longestStreak` talebi eklendi.
- `01/05/06` dosyalarına kurallara referans eklendi.

**Doğrulama:** `npx tsc --noEmit` temiz, `npm run test:run` 93/93, `npm run build` başarılı.

---

## 2026-09-27 — Auth/Register/Exam düzeltmeleri

**Öğrenci kaydına davet kodu (`code`)** — backend sözleşmesi (`FRONTEND_INTEGRATION.md` §3)
6 haneli davet kodu istiyordu; tamamlandı.
- `src/modules/auth/types/auth.types.ts` — `StudentRegisterRequest.code: string` (zorunlu);
  `avatar?`, `gender?`, `isKvkVerified?`. `TeacherRegisterRequest`'te `code` yok.
- `src/modules/auth/hooks/useAuth.ts` — `register(..., code?, isKvkVerified?)`.
- `src/app/register/page.tsx` — "Davet Kodu" input'u yalnızca öğrencide; `^\d{6}$` doğrulaması.
- `src/modules/auth/services/auth.service.test.ts` — `code` gönderimi doğrulanır.

**KVKK onayı** — register ekranına standart aydınlatma metni + zorunlu checkbox eklendi;
onay `isKvkVerified: true` olarak gönderilir (`register/page.tsx`, `useAuth`, `auth-context`).

**Rol değiştirme kapatıldı + role göre yönlendirme** — `switchRole` store/hook/context'ten ve
`dashboard-layout`'taki demo menüden kaldırıldı. `login/page.tsx` artık role göre yönlendirir
(teacher/admin → `/teacher`, student → `/dashboard`). Backend doğrulaması: `ahmet@edu.com`
→ `user.role: 1`, `elif@edu.com` → `user.role: 2` (numeric, doğru).

**Login ekranı temizliği** — "Demo Hesaplar" kartı ve sidebar'daki avatar/kullanıcı bloğu
kaldırıldı; sidebar'a "Çıkış Yap" butonu, mobil header dropdown'ına Profil + Çıkış Yap kondu.

**Exam status 400 hatası** — analiz tamamlandı toggle'ı yalnızca `status` gönderiyordu ve backend
`ExamId/ExamDate/ExamName` zorunlu tutuyordu. `exam-results-table.tsx::handleAnalysisToggle`
bu alanları ekleyecek şekilde düzeltildi; `UpdateExamRequest`'e `examId` eklendi.

**Backend login 500** — `POST /auth/login` tüm seed hesaplarda `ERR_LOGIN_FAILED` (500) veriyordu;
backend düzeldi, doğrulandı. (Geçici blokerdi; talep listesine eklenip kapatıldı.)

**Dokümantasyon** — `docs/BackendTalep.md` yanlışlıkla silinmişti, `git checkout` ile geri
getirildi ve `#12` streak alanları yeniden eklendi. Memory-bank kuruldu; "talep dosyası
yalnızca açık talepleri tutar, tamamlananlar ilgili modül/dokümanlara aktarılır" kuralı yazıldı.

**Doğrulama:** `npx tsc --noEmit` temiz, auth service testleri 10/10 geçti.

> Bu oturumun tamamlanan maddeleri ilgili yerlere dağıtıldı: `auth.md`, `exams.md`,
> `TEST_SENARYOLARI.md` (S21–S23), `02-architecture.md`, `03-module-endpoints.md`.

---

## 2026-09-20 — Dokümantasyon tazeleme (commit `2c398e7`)

- `FRONTEND_INTEGRATION.md` (memory-bank) ve `src/app/FRONTEND_INTEGRATION.md` güncellendi:
  - Öğrenci/öğretmen register request DTO'ları (öğrencide `code`) dokümante edildi.
  - FluentValidation (`ValidationProblemDetails`) uyarısı eklendi.
  - `scoreType` (AYT) hata kodları ve puanlama açıklamaları eklendi.
  - Auth/Notes/Teachers/Tasks hata katalogları genişletildi.

---

## 2026-08-17 — Backend entegrasyon oturumu

`FRONTEND_INTEGRATION.md`'de listelenen backend eklemeleri frontend'e bağlandı:

| # | İş | Durum |
|---|----|-------|
| #2 | Öğretmen-öğrenci listesi → `GET /teachers/{teacherId}/students` | ✅ |
| #5 | Not/Feedback → `GET/POST/DELETE /students/{id}/notes` | ✅ |
| #6 | Toplu görev onayı → `POST /study-tasks/complete/batch` | ✅ |
| #7 | Toplu sınav trendi → `GET /exams/trends/all` | ✅ |
| #8 | Ders bazlı analiz → `?perSubject=true` + `perSubjectStats` | ✅ |
| #9 | Forgot-password 3 adımlı e-posta akışı | ✅ |
| #10 | Focus session endpoint'leri | ✅ (service hazır) |
| H-1 | `teachter` → `teacher` rota düzeltmesi | ✅ |

Ayrıca:
- Tüm mock/simüle fallback'ler kaldırıldı; `src/lib/mock/*` silindi.
- Direct entegrasyon temizliği: mapper fallback'leri kaldırıldı, DTO alanları zorunlu kılındı.
- `ErrorState` + loading `Skeleton` state'leri yaygınlaştırıldı.
- Vitest altyapısı kuruldu (service + mapper + component contract testleri).
- Lessons/Units/Topics service + hook'ları eklendi; TaskModal gerçek ders seçimine geçti.
- Profil sayfası (`/dashboard/profile`) ve öğretmen öğrenci ekle/kaldır akışı eklendi.

---

## 2026-09-20 öncesi (özet)

- Render güncellemeleri ve UI düzenlemeleri (`++`, `++++` commit'leri).
- `no mock data` (commit `863cdba`): mock veri katmanının kaldırılması.
