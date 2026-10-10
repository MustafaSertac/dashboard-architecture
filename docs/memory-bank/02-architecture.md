# 02 — Mimari

> Next.js App Router + React Query + Zustand + Axios katmanlı mimari.
> Amaç: API sözleşmesini `modules/*/services` içinde izole etmek, UI'ı DTO'dan
> mapper'lar ile ayrıştırmak ve tüm veri akışını React Query ile yönetmek.

---

## Katmanlar

```
app/ (route + sayfa kompozisyonu)
   │  sayfa, hangi component'i render edeceğini bilir
   ▼
components/ (görsel/UI)
   │  useAuth(), use*() hook'ları ile veri tüketir
   ▼
modules/{domain}/
   ├── hooks/       # React Query useQuery/useMutation sarmalayıcıları
   ├── services/    # API çağrıları (endpoint + DTO) — TEK HTTP katmanı
   ├── mappers/     # DTO → UI modeli dönüşümü
   ├── types/       # DTO/Request tipleri
   ├── store/       # (auth, study-timer) Zustand store'ları
   └── validators/  # Zod şemaları
   ▼
lib/api/ (client, endpoints, envelope, error)
   ▼
Backend (/api/v1.0)
```

**Kural:** Component'ler doğrudan `apiClient` kullanmaz; mutlaka modül hook'u → service zinciri
üzerinden gider. DTO tipleri UI'da kullanılmaz, mapper ile `lib/types.ts` içindeki UI modeline
çevrilir (ör. `ExamDTO → ExamResult`, `StudyTaskDTO → Task`).

---

## API Katmanı (`src/lib/api`)

| Dosya | Görev |
|-------|-------|
| `client.ts` | Axios örneği: `baseURL = env.API_BASE_URL`, JSON header; request/response interceptor'ları |
| `endpoints.ts` | Tüm rota sabitleri (`endpoints.auth.login`, `endpoints.exams.trendsAll`, ...) |
| `envelope.ts` | `isApiResponse()` ve `unwrapEnvelope()` yardımcıları |
| `error.ts` | `ApiError` sınıfı (`code`, `message`, `status`, `details`) + `isApiError()` |

### Envelope

Başarılı: `{ isSuccess: true, data: ... }` — hatalı: `{ isSuccess: false, error: { code, message, details? } }`.
Response interceptor `isSuccess === false` gördüğünde `ApiError` fırlatır. `{ traceId, message }`
şeklindeki unhandled exception yanıtı `ERR_UNHANDLED` olarak normalize edilir.

> **Bilinen açık:** `ValidationProblemDetails` (400, FluentValidation — `{ title, status, errors }`)
> şu an ayrıştırılmıyor; bu yanıtlar `ERR_HTTP_400` generic hatasına düşer. Backend dokümanı
> alan bazlı bu formatı ayrıca parse etmeyi öneriyor (bkz. `src/app/FRONTEND_INTEGRATION.md` §2).

### Token & 401 akışı

- Request interceptor, `useAuthStore.getState().accessToken` varsa `Authorization: Bearer <token>` ekler.
- Access token 15 dk geçerlidir. 401 gelirse:
  1. `isRefreshing` kilidi ile **tek** kez `POST /auth/refresh-token` (AllowAnonymous — Bearer
     gönderilmez) çağrılır.
  2. Bekleyen istekler `failedQueue` içinde tutulur.
  3. Yeni token store'a yazılır, kuyruk serbest bırakılır ve istekler yeniden denenir.
  4. Refresh de başarısızsa `clearAuth()` + `/login`'e yönlendirme.

### Ortam (`src/config/env.ts`)

```
API_BASE_URL      = NEXT_PUBLIC_API_BASE_URL ?? "/api/v1.0"
ACCESS_TOKEN_KEY  = "edc_access_token"
REFRESH_TOKEN_KEY = "edc_refresh_token"
AUTH_USER_KEY     = "edc_current_user"
TOKEN_EXPIRY_MINUTES = 15
```

Dev proxy: `next.config.mjs` → `/api/v1.0/:path*` ⇒ `http://localhost:5295/api/v1.0/:path*`.

---

## Kimlik & Oturum

- `modules/auth/store/auth.store.ts` — Zustand `persist` (`edc-auth-store`). Tutulanlar:
  `user`, `accessToken`, `refreshToken`. `isLoading` rehydrate bitince `false` olur.
  `apiUserToAuthUser()` API `role:number`'ı `UiUserRole`'a çevirir.
- `modules/auth/hooks/useAuth.ts` — `login`, `register` (öğrenci/öğretmen), `logout`,
  `forgotPassword`, `verifyResetToken`, `resetPassword`. Başarılı giriş/kayıtta `setAuth`
  çağrılır ve auth store güncellenir.
- `lib/auth-context.tsx` — `useAuth` hook'unu React Context olarak sarar; component'ler
  `useAuth()` ile tüketir. Context değeri `useMemo` ile sabitlenir ve **yalnızca tüketilen alanları**
  (`user`, `isLoading`, login/register/logout/forgot/verify/reset) içerir; `accessToken` değer
  dışında tutulur (2026-10-10) — böylece 15 dk'lık token yenilemesi tüm `useAuth()` tüketicilerini
  yeniden render etmez.
- `components/auth-guard.tsx` — Public path'ler: `/login`, `/register`, `/forgot-password`,
  `/reset-password`. Oturum yoksa `/login`'e; oturum varsa public sayfada role göre
  (`teacher|admin → /teacher`, `student → /dashboard`) yönlendirir. Yükleme sırasında spinner.
- `lib/auth/token.ts` — `decodeJwtPayload`, `isTokenExpired` (Base64url JWT decode).

### Kayıt akışı (2026-09-27 itibarıyla)

- Öğrenci: `POST /auth/student` — **8 haneli davet `code` alanı zorunlu** (alfabe `A-Z` sans
  I/O + `2-9`); 8 karaktere ulaşınca `POST /organizations/codes/validate` ile **canlı doğrulanır**,
  geçerli değilse kayıt engellenir.
- Öğretmen: `POST /auth/teacher` — `code` yok; opsiyonel `organizationCode` (TeacherJoin kodu),
  girilirse canlı doğrulanır.
- **KVKK:** register formunda standart aydınlatma metni + onay checkbox'ı zorunlu;
  onaylanınca `isKvkVerified: true` gönderilir.
- Detay: `docs/memory-bank/modules/auth.md`, `docs/memory-bank/modules/organizations.md`.

### Organizations modülü

- Öğretmen organizasyon oluşturur/katılır, `canViewAllStudents` tercihini değiştirir, öğrenci
  ve öğretmen davet kodu üretir. Kod tek kullanımlık, 8 karakter, `expiresInDays` (varsayılan 7).
- `GET /organizations/me` üye değilse `404`; hook bunu `null`'a çevirir.
- Öğretmenin öğrenci listesi (`GET /teachers/{id}/students`) org üyeliği + `canViewAllStudents`'a
  göre backend tarafından filtrelenir; frontend ek filtre uygulamaz.
- UI: `/teacher/organization` (sidebar) + öğrenci listesinde "Ogrenci Kodu Uret".
- Detay: `docs/memory-bank/modules/organizations.md`.

---

## Veri Çekme Deseni (React Query)

- Query key'leri tek merkezde: `src/lib/query/keys.ts` → `qk.*` (auth, lessons, units, topics,
  exams, tasks, analytics, teacherStudents, notes, organizations).
- Her modül hook'ları `qk` key'i + `service` çağrısı + (varsa) `mapper` ile model döner.
- Mutation'lar `onSuccess`'te ilgili query'leri invalidate eder:
  - Görevler: `qk.tasks.allForStudent()` kök `["tasks"]` prefix'i (today/upcoming/range hepsi).
  - Denemeler: liste + detay; Analitik: ilgili key.
  - Notlar: `qk.notes.list(studentId)`; Öğretmen-öğrenci: `qk.teacherStudents(teacherId)`.
- **Varsayılanlar (`src/providers/QueryProvider.tsx`):** `staleTime` **5 dk**, `retry: 1`,
  `refetchOnWindowFocus: false` (2026-10-10; 30 sn çok agresifti). Ders listesi de 5 dk.
- **`placeholderData: keepPreviousData`** — gezinme/sekme değişiminde skeleton flaşını önler:
  `useTasksByRange`, `useWeeklyAnalytics`/`useMonthlyAnalytics`/`useYearlyAnalytics`, `useExamTrends`.
- `enabled`: id/param hazır değilse query çalışmaz (ör. `!!studentId`). Trend grafiğinde tek-öğrenci
  ve tüm-öğrenci sorguları koşulsuz çağrılır ama `enabled` ile yalnızca aktif mod çalışır
  (`useExamTrendsAll` → `enabled: !!examCode && !!teacherId`).

---

## Rol Bazlı Yönlendirme

- **Rol değiştirme kaldırıldı:** `switchRole` (store/hook/context) ve dashboard layout'taki
  "Rol Değiştir (Demo)" menüsü silindi. Kullanıcı yalnızca kendi panelinde kalır.
- **Login sonrası:** `login/page.tsx` role göre yönlendirir → `teacher|admin → /teacher`,
  `student → /dashboard`. `roleFromApi` numeric (0/1/2) doğrulandı.
- AuthGuard + sayfa içi kontroller. Örn. `/teacher` sayfası `role === "student"` ise
  `/dashboard`'a atar; `/dashboard/tasks` öğretmende öğrenci seçici dropdown gösterir.
- Öğretmen düzeni `/teacher/layout.tsx` + `StudentProvider` (`lib/student-context.tsx`) —
  seçili öğrenci ve öğretmenin öğrenci listesini (`GET /teachers/{id}/students`) sağlar.
  `StudentProvider` türetilmiş dizileri/context değerini `useMemo` ile sabitler (2026-10-10);
  öğrenci detay `layout.tsx` effect'i `selectedStudent` guard'ı ile tekrar `setState` yapmaz
  (önceki halde `studentsWithStats` her render'da yeni referans olduğu için sonsuz döngü oluşuyordu).
- **`TaskViewDateProvider`** (`lib/task-view-date-context.tsx`) — öğrenci detay `layout.tsx` ve
  **`/dashboard/layout.tsx`** içinde sarılır. `daily/weekly/monthly` görev görünümleri seçili
  tarih/hafta/ayı `setViewDate` ile yayınlar; `TeacherActions` "Toplu Onayla" görüntülenen kapsamın
  görevlerini onaylar: günlükte seçili gün, haftalıkta görüntülenen hafta (`startOfWeek`/`endOfWeek`,
  Pzt–Paz), aylıkta görüntülenen ay (`startOfMonth`/`endOfMonth`) (2026-10-10).

---

## Hata & Yükleme Deneyimi

- `components/ui/error-state.tsx` — `ApiError`'dan status + kod + mesaj gösterir, "Tekrar Dene"
  butonu verir. Dashboard, teacher, analytics, exams component'lerinde yaygın kullanılır.
- Yüklemelerde `Skeleton`; boş durumlarda `Empty` bileşenleri.
- Bildirimler `sonner` toast ile (silme, toplu onay, kayıt hataları...).

---

## Performans (2026-10-10)

- **Lazy grafikler:** Recharts (~500 KB) ağır bir bağımlılık. Grafik kartları (`WeeklyProgressCard`,
  `ExamNetTrendCard`, `ExamTrendsChart`) `src/components/charts/lazy-charts.tsx` üzerinden
  `next/dynamic` (`ssr:false`) ile yüklenir; ilk sayfa JS yükünden çıkarılır, yüklenirken kart
  iskeleti gösterilir. Sayfalar statik import yerine bu modülden tüketir.
- **Prefetch:** Öğrenci listesindeki "Detaylari Gor" butonu `next/link` (`prefetch`) kullanır;
  öğrenci detay rota paketi önden yüklenir (önceki `router.push` rota prefetch'i yapmıyordu).
- **Ölçüm:** `@next/bundle-analyzer` (dev) — `$env:ANALYZE="true"; npm run build`.
- React Query cache varsayılanları ve `keepPreviousData` için yukarıdaki "Veri Çekme Deseni".

## Çalışma Süreölçeri (özel durum)

- `modules/study-tasks/store/study-timer.store.ts` — Zustand `persist` (`edc-study-timer`).
  Aktif `taskId`, `isRunning`, birikmiş saniye, segment başlangıcı tutulur (reload'da korunur).
- `modules/study-tasks/hooks/useStudyTimer.ts` — süre bitince `log-study` ile göreve yazar,
  optimistik olarak elapsed'i sıfırlar, hata olursa geri ekler. Toast ile bilgilendirir.
  Focus session endpoint'leri (`createFocusSession`/`getFocusSessions`) service'te hazırdır.

---

## Test Altyapısı

- `vitest.config.mts` + `src/test/setup.ts` + `src/test/test-utils.tsx`.
- Kapsam: service contract testleri, mapper testleri, component testleri
  (StudyTimerCard, TaskModal, NoteModal, TeacherActions, ErrorState vb.).
- Detay senaryolar: `TEST_SENARYOLARI.md`.
- `npm run lint` şu an çalışmaz (eslint kurulu değil).
