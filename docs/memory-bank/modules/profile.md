# Modül — Profile (Kullanıcı Profili)

> **Amaç:** Giriş yapan kullanıcının profil bilgilerini görüntüleme ve güncelleme.
> Auth modülünün profil endpoint'lerini ince bir katman olarak sarar.

**Sorumlu dosyalar**
- `src/modules/profile/services/profile.service.ts`
- `src/modules/profile/hooks/useProfile.ts`
- `src/modules/profile/types/profile.types.ts` (auth tiplerini re-export eder)
- Sayfa: `src/app/dashboard/profile/page.tsx`

---

## Endpoint'ler

| # | Method | Path | Body / Param | Response `data` | Service |
|---|--------|------|--------------|-----------------|---------|
| 1 | GET | `/auth/profiles/{userId}` | — | `UserProfileResponse` | `profileService.getProfile` |
| 2 | PUT | `/auth/profiles` | `UpdateProfileRequest` | `UserProfileResponse` | `profileService.updateProfile` |

Her iki fonksiyon da doğrudan `authService.getProfile` / `authService.updateProfile`
referanslarıdır (`src/modules/profile/services/profile.service.ts`).

---

## Hook'lar

| Hook | Ne yapar |
|------|----------|
| `useProfile(userId)` | `qk.auth.profile(userId)` key'i ile profili çeker (`enabled: !!userId`) |
| `useUpdateProfile()` | `{ userId, data }` alır; başarıda `qk.auth.profile(userId)` invalidate eder |

`UpdateProfileRequest`: `name?`, `email?`, `phoneNumber?`, `gender?`, `avatar?`.

---

## Akış / Notlar

- Profil sayfası formu `useProfile(user.id)` ile doldurulur; kaydet `useUpdateProfile` çağırır
  → `PUT /auth/profiles` → toast başarı → ilgili query invalidate.
- `UserProfileResponse` auth modülü ile aynıdır (tekrar kullanılır).
