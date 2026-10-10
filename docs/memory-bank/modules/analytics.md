# Modül — Analytics (Analizler)

> **Amaç:** Öğrencinin haftalık/aylık/yıllık çalışma ve performans kırılımını, ders bazlı
> (`perSubject`) istatistiklerle birlikte sağlar.

**Sorumlu dosyalar**
- `src/modules/analytics/services/analytics.service.ts`
- `src/modules/analytics/hooks/useAnalytics.ts`
- `src/modules/analytics/mappers/analytics.mapper.ts`
- `src/modules/analytics/types/analytics.types.ts`
- UI: `src/components/analytics/weekly-analytics.tsx`, `monthly-analytics.tsx`, `yearly-analytics.tsx`

---

## Endpoint'ler

| # | Method | Path | Query Param | Response `data` | Service |
|---|--------|------|-------------|-----------------|---------|
| 1 | GET | `/analytics/weekly` | `studentId`, `weekStart` | `WeeklyAnalyticsDTO` | `weekly` |
| 2 | GET | `/analytics/monthly` | `studentId`, `year`, `month`, `perSubject` | `MonthlyAnalyticsDTO` | `monthly` |
| 3 | GET | `/analytics/yearly` | `studentId`, `year`, `perSubject` | `MonthlyAnalyticsDTO` | `yearly` |
| 4 | GET | `/analytics/dashboard` | `studentId` | `DashboardOverviewDTO` | `dashboard` |

`perSubject` her zaman `true` gönderilir (hook varsayılanı), böylece response'ta
`perSubjectStats` döner.

---

## Hook'lar

| Hook | Key | Not |
|------|-----|-----|
| `useWeeklyAnalytics(studentId, weekStart)` | `qk.analytics.weekly` | `mapWeeklyAnalytics(dto, weekStart, 7)`; `keepPreviousData` |
| `useMonthlyAnalytics(studentId, year, month, perSubject=true)` | `qk.analytics.monthly` | `mapMonthlyAnalytics`; `keepPreviousData` |
| `useYearlyAnalytics(studentId, year, perSubject=true)` | `qk.analytics.yearly` | `mapMonthlyAnalytics`; `keepPreviousData` |
| `useDashboardOverview(studentId)` | `qk.analytics.dashboard` | `mapDashboardOverview` |

---

## DTO → UI (Mapper)

- `WeeklyAnalyticsDTO`: `weekStart, weekEnd, days[] (subjects/total'lar), weeklyTotals`.
- `MonthlyAnalyticsDTO`: `year, month, summary{totalHours,totalQuestions,completedCount,
  pendingCount}, courses[], perSubjectStats?[]`.
- `PerSubjectStats`: `{ subject, totalHours, totalQuestions, completedCount, pendingCount }`.
- `DashboardOverviewDTO`: `quickStats{totalSolvedQuestions, completedTasks, pendingTasks,
  latestNet?}, recentExams[]`.
- Mapper `perSubjectStats`'ı doğrudan kullanır; response'ta yoksa boş dizi döner.

---

## Akış / Notlar

- Dashboard kartları (`quick-stats-card`, `weekly-progress-card`, `recent-exams-card`,
  `exam-net-trend-card`) bu hook'ları tüketir.
- `/dashboard/analytics` sayfası Haftalık / Aylık / Yıllık sekmelerini render eder; aylık ve
  yıllık bileşenler `perSubjectStats` ile ders bazlı kırılımı gösterir.
- Öğretmen, bir öğrenciyi seçtiğinde aynı component'ler `studentId` prop'u ile çalışır.
- **Saat gösterimi (2026-10-10):** `weekly-analytics.tsx` ve `monthly-analytics.tsx`'te "Toplam Saat"
  değerleri **2 ondalık** (`toFixed(2)`) gösterilir (ör. `2.00`).
- **`weekly-progress-card` (2026-10-10):** Dashboard "Haftalık İlerleme" grafiği yalnızca çözülen
  **soru sayısı**nı (tek `Bar`) gösterir; renkler `var(--chart-N)` (önceki `hsl(var(...))` geçersizdi).
- **Performans (2026-10-10):** Haftalık/aylık/yıllık hook'lar `placeholderData: keepPreviousData`
  kullanır (gezinmede flaş yok). Grafikli kartlar `components/charts/lazy-charts.tsx` üzerinden
  `next/dynamic` (`ssr:false`) ile yüklenir. Global `staleTime` 5 dk (`QueryProvider`).
