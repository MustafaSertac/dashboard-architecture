# 06 — Yapılacaklar (Açık)

> Yalnızca **açık** işler. Tamamlananlar buradan silinir; ilgili modül dokümanı,
> `TEST_SENARYOLARI.md`, `04-last-work.md`, `02-architecture.md` gibi dosyalara aktarılır.
> Açık backend talepleri: `05-backend-talepleri.md`. Geçmiş: `04-last-work.md`.
> Çalışma kuralları (İLK OKUNUR): `07-rules.md`.
> Son güncelleme: 2026-09-27

---

## P0 — Backend bekleyen

- [ ] **#12 Günlük seri alanları** — `DashboardOverviewDTO.quickStats.currentStreak` /
      `longestStreak`. Detay/takip: `05-backend-talepleri.md`.

## P1 — Frontend (streak)

- [ ] `src/modules/study-tasks/utils/daily-streak.ts` — `computeDailyStreak(tasks, today)`
      (`currentStreak`, `longestStreak`, `activeToday`). Aktif gün = `sum(studiedHours) > 0`
      veya o gün tamamlanmış görev.
- [ ] `src/modules/study-tasks/hooks/useDailyStreak.ts` — son 90 gün task verisi +
      `useTasksByRange`; backend alanı gelince `quickStats.currentStreak`'e geç.
- [ ] `study-timer-card.tsx` — sabit `7` kaldır, `currentStreak` göster (yüklenirken `–`).
- [ ] `dashboard/page.tsx` — `studentId` prop'unu geç.
- [ ] Test: `daily-streak.test.ts` + `study-timer-card.test.tsx` güncelle.

## P1 — Frontend (genel)

- [ ] **`ValidationProblemDetails` parse** — `src/lib/api/client.ts` 400 alan hatalarını
      `ERR_HTTP_400` yerine `errors` sözlüğünden okusun (`FRONTEND_INTEGRATION.md` §2).
- [ ] **eslint kurulumu** — `npm run lint` şu an çalışmıyor (`eslint` devDependency yok).

## P2 — Özellikler

- [ ] **Lessons/Units/Topics admin CRUD UI** — service/hook hazır; yalnızca TaskModal'da kullanılıyor.
- [ ] **Admin kaydı** — register ekranı sadece Öğrenci/Öğretmen sunuyor; admin backend seed gerekiyor.
- [ ] **Focus session UI** — `StudyTimerCard` `log-study` kullanıyor; focus-session
      endpoint'leri service'te hazır, timer akışına bağlanmadı.
- [ ] **StudyTimerCard çoklu görev toplama** — şu an tek görev; birden fazla görevin süresini topla.

## P3 — Dokümantasyon / bakım

- [ ] `05-backend-talepleri.md` — bekleyen talepleri güncelle (yalnızca açık talepler tutulur).
- [ ] `FRONTEND_INTEGRATION.md` / `BackendTalep.md` referanslarını güncel tut.
