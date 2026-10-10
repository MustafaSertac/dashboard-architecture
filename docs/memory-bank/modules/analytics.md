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
| `useWeeklyAnalytics(studentId, weekStart)` | `qk.analytics.weekly` | `mapWeeklyAnalytics(dto, weekStart, 7)` |
| `useMonthlyAnalytics(studentId, year, month, perSubject=true)` | `qk.analytics.monthly` | `mapMonthlyAnalytics` |
| `useYearlyAnalytics(studentId, year, perSubject=true)` | `qk.analytics.yearly` | `mapMonthlyAnalytics` |
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
