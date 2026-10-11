# Modül — Auth (Kimlik Doğrulama)

> **Amaç:** Giriş, kayıt, çıkış, token yenileme, şifre sıfırlama ve kullanıcı profil
> endpoint'lerini yönetir. Oturumun tek kaynağı `auth.store`'dur.

**Sorumlu dosyalar**
- `src/modules/auth/services/auth.service.ts`
- `src/modules/auth/hooks/useAuth.ts`
- `src/modules/auth/store/auth.store.ts`
- `src/modules/auth/types/auth.types.ts`
- `src/modules/auth/validators/auth.schema.ts`
- `src/lib/auth-context.tsx`, `src/components/auth-guard.tsx`, `src/lib/auth/token.ts`

---

## Endpoint'ler

| # | Method | Path | Body / Param | Response `data` | Service |
|---|--------|------|--------------|-----------------|---------|
| 1 | POST | `/auth/login` | `{ email, password }` | `AuthResponse` | `login` |
| 2 | POST | `/auth/student` | `StudentRegisterRequest` | `AuthResponse` (201) | `registerStudent` |
| 3 | POST | `/auth/teacher` | `TeacherRegisterRequest` | `AuthResponse` (201) | `registerTeacher` |
| 4 | POST | `/auth/refresh-token` | `{ refreshToken }` | `AuthResponse` | `refreshToken` |
| 5 | POST | `/auth/logout` | `{ refreshToken }` | `{ message }` | `logout` |
| 6 | POST | `/auth/forgot-password/request` | `{ email }` | `{ message }` | `forgotPasswordRequest` |
| 7 | POST | `/auth/forgot-password/verify` | `{ token }` | `{ valid: boolean }` | `forgotPasswordVerify` |
| 8 | POST | `/auth/forgot-password/reset` | `{ token, newPassword }` | `{ message }` | `forgotPasswordReset` |
| 9 | GET | `/auth/profiles/{userId}` | — | `UserProfileResponse` | `getProfile` |
| 10 | PUT | `/auth/profiles` | `UpdateProfileRequest` | `UserProfileResponse` | `updateProfile` |

Rotalar: `endpoints.auth.*`. `registerTeacher` `/auth/teacher`'a gider (`/auth/teachter` deprecated).

---

## Hook'lar (`useAuth`)

| Fonksiyon | Ne yapar |
|-----------|----------|
| `login(email, password)` | `authService.login` → `setAuth(token, refresh, user)` |
| `register(input: RegisterInput)` | `RegisterInput = { name, email, password, phoneNumber, role, code?, organizationCode?, isKvkVerified? }`. role `teacher` ise `/auth/teacher` (`organizationCode?`); değilse `/auth/student` (öğrencide `code` zorunlu) |
| `logout()` | `/auth/logout` → `clearAuth()` → `/login` |
| `forgotPassword(email)` | 1. adım: sıfırlama e-postası ister |
| `verifyResetToken(token)` | 2. adım: token geçerliliği (`boolean`) |
| `resetPassword(token, newPassword)` | 3. adım: yeni şifreyi kaydeder |

`setAuth` başarılı işlem sonrası `AuthUser`'ı store'a yazar. Hata durumunda
`{ success: false, error }` döner (toast/uyarı UI'da gösterilir).

---

## Kayıt Akışı (`/register`)

Öğrenci (`role = "student"`):
```ts
interface StudentRegisterRequest {
  name: string;
  email: string;
  password: string;
  code: string;          // 8 haneli davet kodu — frontend'de ZORUNLU
  avatar?: string;
  gender?: 0 | 1;
  phoneNumber?: string;
  isKvkVerified?: boolean;
}
```
- Kod alfabesi: `A-Z` (I, O hariç) + `2-9`; 8 karakter. UI'da büyük harfe çevrilir.
- **Canlı doğrulama:** 8 karaktere ulaşınca `POST /organizations/codes/validate` çağrılır;
  geçerliyse "Kod geçerli", aksi halde "Kod geçersiz/kullanılmış/süresi dolmuş" gösterilir.
- Doğrulama: boş → "Davet kodu gerekli"; geçersiz/doğrulanmamış → kayıt engellenir.
- Backend `code`'u opsiyonel kabul eder; frontend iş kuralı gereği **zorunlu** tutar.

Öğretmen (`role = "teacher"`):
```ts
interface TeacherRegisterRequest {
  name: string; email: string; password: string;
  organizationCode?: string;   // TeacherJoin kodu — OPSİYONEL
  avatar?: string; gender?: 0 | 1; phoneNumber?: string; isKvkVerified?: boolean;
}
```
- `code` alanı **yoktur**; bunun yerine opsiyonel `organizationCode` (TeacherJoin) gönderilir.
- Girildiyse canlı doğrulanır ve tip `TeacherJoin (1)` olmalıdır.

### KVKK onayı (kayıt ekranı)

- Register formunda standart **KVKK Aydınlatma Metni** (kaydırılabilir metin) gösterilir.
- Kullanıcı "okudum ve kabul ediyorum" **checkbox**'ını işaretlemeden kayıt olamaz
  ("KVKK Aydinlatma Metni'ni kabul etmelisiniz").
- Onay verilince request'e `isKvkVerified: true` olarak gönderilir (backend alanı).

### Ad-soyad normalizasyonu (`formatFullName`, 2026-10-10)

- Register "Ad Soyad" alanı boşluğa göre split edilir; **son parça soyad**, önceki parçalar isim.
- İsim parçaları: ilk harf büyük, kalanı küçük (Türkçe `tr-TR`). Soyad: **tamamı büyük harf**.
  Örn. `"ali veli can"` → `"Ali Veli CAN"`, `"ali"` → `"Ali"`.
- `src/lib/utils.ts` içindeki `formatFullName` kullanılır; input `onBlur`'da ve submit'te uygulanır.

---

## Rol & Yönlendirme

- **Rol değiştirme kaldırıldı.** `switchRole` store/hook/context'ten ve dashboard
  layout'taki "Rol Değiştir (Demo)" menüsünden silindi. Kullanıcı yalnızca kendi panelinde kalır.
- **Login sonrası yönlendirme:** `role === "teacher" || "admin"` → `/teacher`; `student` → `/dashboard`.
- `roleFromApi` **numeric** (0=admin, 1=teacher, 2=student) doğrulandı; string enum değil.
  (Backend: `ahmet@edu.com` → `user.role: 1`, `elif@edu.com` → `user.role: 2`.)

---

## Token Yaşam Döngüsü

- `AuthResponse = { accessToken, refreshToken, user }` → `auth.store` `persist` (`edc-auth-store`).
- Access token 15 dk; 401 sonrası `apiClient` interceptor'ı otomatik `refresh-token` çağırır
  (detay: `02-architecture.md`).
- `updateProfile` sonrası `useUpdateProfile` (`profile` modülü) ilgili query'yi invalidate eder.

---

## Notlar

- `UserProfileResponse` alanları: `id, name, email, role(0|1|2), organizationId?, avatar?,
  isVerified, isKvkVerified, phoneNumber, gender(0|1)`. `organizationId` auth store'a
  (`AuthUser`) da yazılır.
- `role` API'da number; UI'da `roleFromApi` ile `UiUserRole`'a çevrilir.
- `AuthGuard` oturumsuz kullanıcıyı `/login`'e, oturumluyu role göre panele yönlendirir.
- **Login 401 (2026-10-11):** Hatalı girişte backend `401 ERR_INVALID_CREDENTIALS` döner. `apiClient`
  interceptor'ı `refreshToken` yokken refresh denemez (detay: `02-architecture.md`); hata
  `{ success: false, error }` olarak login UI'a ulaşır ve gerçek mesaj gösterilir. `login/page.tsx`
  spinner'ı response gelince durur.
- Hata kodları: `ERR_VALIDATION_FAILED`, `ERR_INVALID_CREDENTIALS`, `ERR_EMAIL_EXISTS`,
  `ERR_INVALID_REFRESH_TOKEN`, `ERR_USER_NOT_FOUND`.
