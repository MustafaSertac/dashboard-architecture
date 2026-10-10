# 01 — Proje Özeti

> **Proje:** EduCoach (ProKoc) — Eğitim Koçluk ve Analiz Platformu (Frontend)
> **Tür:** Next.js 16 (App Router) + React 19 + TypeScript panel uygulaması
> **Backend:** .NET Web API — tüm rotalar `/api/v1.0/` altında, JWT tabanlı
> **Son güncelleme:** 2026-09-27

---

## Ne yapar?

Öğretmenlerin öğrencilerini takip ettiği, öğrencilerin ise çalışma görevlerini, deneme
sonuçlarını ve performans analizlerini gördüğü rol tabanlı bir eğitim koçluğu paneli.

Üç rol vardır (API `role` değeri / UI karşılığı):

| API | UI (UiUserRole) | JWT claim `role` |
|-----|-----------------|------------------|
| 0 | `admin` | 3 |
| 1 | `teacher` | 2 |
| 2 | `student` | 1 |

> JWT claim'deki rol değeri API response'undaki `role` değerinden **farklıdır**;
> frontend yalnızca response'taki `role` alanını kullanır (`roleFromApi`).

---

## Temel Yetenekler

- **Kimlik & oturum:** login, öğrenci/öğretmen kaydı, otomatik token yenileme (15 dk), çıkış,
  e-posta doğrulamalı 3 adımlı şifre sıfırlama, profil görüntüleme/güncelleme.
- **Öğrenci dashboard'u:** bugünün görevleri, yaklaşan görevler, hızlı istatistikler,
  son denemeler, deneme net trendi, haftalık ilerleme, çalışma süreölçeri (focus session).
- **Görev yönetimi (study tasks):** günlük/haftalık/aylık görünüm, görev ekle/düzenle/sil,
  tekli ve toplu onaylama, çalışma kaydı (log-study).
- **Deneme analizi (exams):** TYT/AYT sonuç girişi, ders/konu bazlı kırılım, puan türü (AYT),
  net trend grafikleri, öğretmen için tüm öğrenci karşılaştırması (trends/all).
- **Analizler (analytics):** haftalık, aylık, yıllık kırılım + ders bazlı (`perSubject`).
- **Öğretmen paneli:** öğrenci listesi (istatistiklerle), öğrenci ekle/kaldır, öğrenci bazlı
  günlük/haftalık/aylık/deneme/analiz sayfaları, not/feedback ekleme-silme.
- **Organizasyon & davet kodu:** öğretmen organizasyon oluşturur/katılır, "tüm/kendi öğrencilerini
  gör" tercihi, tek kullanımlık öğrenci/öğretmen kayıt kodu üretimi; öğrenci kaydı 8 haneli
  kod + canlı doğrulama ile yapılır.
- **Ders kataloğu (lessons):** ders → ünite → konu kademeli seçimi (görev formunda kullanılır).

---

## Teknoloji Yığını

| Alan | Seçim |
|------|-------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, shadcn/Radix UI |
| Veri | TanStack React Query v5 |
| Global state | Zustand (auth store, study timer store) |
| HTTP | Axios (interceptor'lı `apiClient`) |
| Form/validasyon | react-hook-form + Zod |
| Grafik | Recharts |
| Bildirim | sonner (toast) |
| Test | Vitest + Testing Library + jsdom |

---

## Çalıştırma

```powershell
npm run dev       # http://localhost:3000 (backend http://localhost:5295 beklenir)
npm run build     # production build
npm run test      # vitest (watch)
npm run test:run  # vitest (tek seferlik)
```

- Geliştirmede `next.config.mjs` rewrite proxy'si `/api/v1.0/*` isteklerini
  `http://localhost:5295/api/v1.0/*` adresine yönlendirir (CORS gerekmez).
- Frontend `API_BASE_URL` varsayılanı `/api/v1.0`; production'da
  `NEXT_PUBLIC_API_BASE_URL` ile gerçek backend adresi verilir.
- Testler mock'ludur, backend gerektirmez.

---

## Dizin Haritası (üst düzey)

```
src/
├── app/                  # Next.js route'ları (login, register, dashboard, teacher, ...)
├── components/           # UI (ui/ shadcn, dashboard/, exams/, tasks/, teacher/, analytics/)
├── modules/              # Domain modülleri: service + hooks + mappers + types + store
│   ├── auth/  profile/  analytics/  exams/
│   └── lessons/  notes/  study-tasks/  teacher/  organizations/
├── lib/                  # api client/endpoints, auth-context, student-context, query keys
├── config/               # env, exam-config (TYT/AYT şablonları)
└── types/                # ortak tipler (ApiResponse, ScoreType, UserRole, ...)
```

- **Çalışma kuralları (İLK OKUNUR):** `docs/memory-bank/07-rules.md` (repo kökü `AGENTS.md` yönlendirir).
- Doküman formatı için: `docs/memory-bank/03-module-endpoints.md` (özet) ve
  modül detayları `docs/memory-bank/modules/{modül}.md` (ör. `auth.md`, `exams.md`).
- API sözleşmesi için: `docs/BackendTalep.md` ve `src/app/FRONTEND_INTEGRATION.md`.
