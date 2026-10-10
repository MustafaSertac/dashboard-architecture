# Modül — Organizations (Organizasyon + Kayıt Kodu)

> **Amaç:** Öğretmenlerin organizasyon oluşturması/katılması, organizasyon içi öğrenci
> görünürlük tercihi ve öğrenci/öğretmen davet kodu üretimi. Kod boyutu tek kullanımlıktır.

**Sorumlu dosyalar**
- `src/modules/organizations/services/organization.service.ts`
- `src/modules/organizations/hooks/useOrganizations.ts`
- `src/modules/organizations/types/organization.types.ts`
- Sayfa: `src/app/teacher/organization/page.tsx`
- Kod üret UI: `src/components/teacher/student-list.tsx` (bağımsız/org öğretmeni)
- Register: `src/app/register/page.tsx`

---

## Endpoint'ler

| # | Method | Path | Body / Param | Response `data` |
|---|--------|------|--------------|-----------------|
| 1 | POST | `/organizations` | `{ name }` | `OrganizationDTO` |
| 2 | POST | `/organizations/join` | `{ code }` (TeacherJoin) | `OrganizationDTO` |
| 3 | GET | `/organizations/me` | — | `{ organization, canViewAllStudents }` (üye değilse 404) |
| 4 | PATCH | `/organizations/me/visibility` | `{ canViewAllStudents }` | `{ organization, canViewAllStudents }` |
| 5 | GET | `/organizations/{id}/teachers` | — | `OrganizationTeacherDTO[]` |
| 6 | POST | `/organizations/{id}/codes` | `{ expiresInDays? }` | `RegistrationCodeDTO` (StudentRegistration) |
| 7 | POST | `/organizations/{id}/teacher-codes` | `{ expiresInDays? }` | `RegistrationCodeDTO` (TeacherJoin) |
| 8 | POST | `/organizations/codes/validate` | `{ code }` | `{ valid, type?, organizationId?, teacherId?, expiresAt? }` — AllowAnonymous |
| 9 | POST | `/teachers/me/codes` | `{ expiresInDays? }` | `RegistrationCodeDTO` (StudentRegistration) |

> `expiresInDays` varsayılan **7** (aralık 1–365). Kod = 8 karakter; alfabe `A-Z` (I, O hariç) + `2-9`.

---

## Hook'lar

| Hook | Açıklama |
|------|----------|
| `useMyOrganization()` | `GET /organizations/me`; üye değilse **404** → `null` döner (hata değil) |
| `useOrganizationTeachers(id)` | Org öğretmenleri |
| `useValidateCode(code)` | `enabled` = 8 karakter geçerliyse; kodu harcamadan doğrular |
| `useCreateOrganization()` | Org oluştur; `qk.organizations.me` invalidate |
| `useJoinOrganization()` | Kodla katıl; `me` invalidate |
| `useUpdateVisibility()` | Görünürlük tercihi; `me` invalidate |
| `useGenerateStudentCode(id)` | Org öğrenci kodu üret |
| `useGenerateTeacherCode(id)` | Org öğretmen katılım kodu üret |
| `useGenerateMyStudentCode()` | Bağımsız/org öğretmeni (`/teachers/me/codes`) öğrenci kodu üretir |

---

## Akışlar

### Öğretmen paneli — `/teacher/organization`
- Üye değilse: **Organizasyon Oluştur** (ad) ve **Kodla Katıl** (8 haneli kod) kartları.
- Üyeyse: org adı, **Tüm öğrencileri gör** Switch'i (`PATCH visibility`), org öğretmenleri
  listesi, **Öğrenci Kodu Üret** + **Öğretmen Katılım Kodu Üret**; üretilen kod + son
  geçerlilik + kopyala.

### Öğrenci kodu (bağımsız öğretmen) — `/teacher/students`
- "Ogrenci Kodu Uret" butonu → `POST /teachers/me/codes` → dialog'da kod + `expiresAt` + kopyala.

### Görünürlük kuralı (backend)
`GET /teachers/{id}/students`:
| Durum | Sonuç |
|-------|-------|
| Org üyesi + `canViewAllStudents=true` | Aynı org'daki **tüm öğrenciler** |
| Org üyesi + `false` | Yalnızca kendi `TeacherStudent` kayıtları |
| Org üyesi değil | Yalnızca kendi kayıtları |

Frontend ek bir filtre uygulamaz; sonucu olduğu gibi gösterir.

---

## DTO'lar

```ts
interface OrganizationDTO { id: string; name: string; createdAt: string; }
interface OrganizationTeacherDTO { id: string; teacherId: string; name: string; email: string; avatar?: string; canViewAllStudents: boolean; joinedAt: string; }
interface RegistrationCodeDTO { id: string; code: string; type: number; organizationId?: string | null; teacherId?: string | null; expiresAt: string; createdAt: string; isUsed: boolean; usedAt?: string | null; }
interface ValidateCodeResponse { valid: boolean; type?: number | null; organizationId?: string | null; teacherId?: string | null; expiresAt?: string | null; }
```
`RegistrationCodeType`: `StudentRegistration = 0`, `TeacherJoin = 1`.

---

## Notlar / Hata kodları

- `GET /organizations/me` üye değilse `404 ERR_ORGANIZATION_NOT_FOUND`; hook bunu `null`'a çevirir.
- Hata kodları: `ERR_CODE_NOT_FOUND`, `ERR_CODE_ALREADY_USED`, `ERR_CODE_EXPIRED`,
  `ERR_CODE_TYPE_MISMATCH`, `ERR_ORGANIZATION_NOT_FOUND`, `ERR_NOT_ORGANIZATION_MEMBER`,
  `ERR_TEACHER_ALREADY_IN_ORGANIZATION`, `ERR_*_FAILED` (500).
- Org oluşturan öğretmen otomatik üye olur (`CanViewAllStudents = true`).
