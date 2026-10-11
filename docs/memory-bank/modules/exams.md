# Modül — Exams (Deneme Sınavları)

> **Amaç:** TYT/AYT deneme sonuçlarını listeleme, detay gösterme, net trendleri, öğretmen için
> tüm-öğrenci karşılaştırması, sonuç ekleme/güncelleme/silme.

**Sorumlu dosyalar**
- `src/modules/exams/services/exam.service.ts`
- `src/modules/exams/hooks/useExams.ts`
- `src/modules/exams/mappers/exam.mapper.ts`
- `src/modules/exams/types/exam.types.ts`
- `src/config/exam-config.ts` (TYT/AYT şablonları, `scoreType` bölüm eşlemesi)
- UI: `src/components/exams/*`, `src/components/dashboard/exam-net-trend-card.tsx`

---

## Endpoint'ler

| # | Method | Path | Query / Body | Response `data` | Service |
|---|--------|------|--------------|-----------------|---------|
| 1 | GET | `/exams` | `studentId, page=1, pageSize=10` | `PagedResult<ExamSummaryDTO>` | `list` |
| 2 | GET | `/exams/{id}` | `detailed` | `ExamDTO` (true) / `ExamSummaryDTO` | `getById` |
| 3 | GET | `/exams/trends` | `studentId, examCode, limit=10` | `ExamSummaryDTO[]` | `trends` |
| 4 | GET | `/exams/trends/all` | `examCode, limit=10, teacherId?` | `StudentTrendDTO[]` | `trendsAll` |
| 5 | POST | `/exams` | `CreateExamRequest` | `ExamDTO` (201) | `create` |
| 6 | PUT | `/exams/{id}` | `UpdateExamRequest` | `ExamDTO` | `update` |
| 7 | DELETE | `/exams/{id}` | — | success | `delete` |

`trendsAll`'da `teacherId` opsiyoneldir; verilmezse tüm öğrenciler döner.

> **`PUT /exams/{id}` — zorunlu alanlar:** Backend `UpdateExamRequest`'te `ExamId`, `ExamDate`,
> `ExamName` alanlarını zorunlu tutar. Sadece `status` güncellemesi (analiz tamamlandı toggle)
> bile bu üç alanı göndermek zorundadır; aksi halde `ValidationProblemDetails` (400) döner.
> `ExamResultsTable.handleAnalysisToggle` bu alanları exam kaydından doldurur
> (`examId: exam.id`, `examDate: new Date(exam.date).toISOString()`, `examName: exam.examName || ...`).

---

## Hook'lar

| Hook | Key | Açıklama |
|------|-----|----------|
| `useExamList(studentId)` | `qk.exams.list` | `list` → `mapExamDtoToUi` → `ExamResult[]` |
| `useExamDetail(id, detailed=false)` | `qk.exams.detail` | detay/summary mapper |
| `useExamTrends(studentId, examCode)` | `qk.exams.trends` | tek öğrenci trendi; `enabled: !!studentId`, `placeholderData: keepPreviousData` |
| `useExamTrendsAll(examCode, teacherId?, limit=10)` | `qk.exams.trendsAll` | `StudentTrendDTO[]` → `{studentId,studentName,exams}[]`; `enabled: !!examCode && !!teacherId` |
| `useCreateExam()` | — | başarıda `qk.exams.list(studentId)` invalidate |
| `useUpdateExam()` | — | liste + `qk.exams.detail(id,true)` invalidate |
| `useDeleteExam()` | — | liste invalidate |

---

## Puan Türü (`scoreType`) — Yalnızca AYT

| Değer | Ad | Puanlanan 80 soru (2 bölüm) |
|------:|----|-----------------------------|
| 1 | SAY | Matematik + Fen Bilimleri |
| 2 | EA | Türk Dili ve Edebiyatı – Sosyal Bilimler-1 + Matematik |
| 3 | SÖZ | Türk Dili ve Edebiyatı – Sosyal Bilimler-1 + Sosyal Bilimler-2 |
| 4 | DİL | Desteklenmez (reddedilir) |

- AYT'de zorunlu; TYT'de gönderilmez (`ERR_SCORE_TYPE_NOT_ALLOWED`).
- `exam-config.ts` → `AYT_SCORE_TYPE_SECTIONS`, `getSectionsForScoreType()`.
- `exam-input-modal.tsx` seçilen puan türüne göre yalnızca ilgili 2 bölümü (80 soru) gösterir/gönderir.
- Response: `scoreCorrect/Wrong/Blank` = puanlanan 80 soru; `totalCorrect/Wrong/Blank` = 160 soru;
  `totalNet` = puan türüne göre 80 soruluk net.

---

## DTO → UI (Mapper)

- `mapExamDtoToUi(dto)`: sections→lessons→topicResults'ı `ExamResult.subjectResults`'a düzler;
  `net` yoksa `correct - wrong*0.25`; `analysisCompleted = status >= Completed`.
- `mapUiExamFormToCreateRequest(...)`: form ders sonuçlarını `sectionName` ile gruplar, bölüm
  toplamlarını hesaplar, `scoreType`'ı **yalnızca AYT'de** ekler, `examDate` ISO'ya çevirir,
  `status` (Completed/Submitted) belirler.

---

## Akış / Notlar

- `/dashboard/exams` → TYT/AYT sekmeleri + `ExamResultsTable`, "Sonuç Ekle" ile `ExamInputModal`.
- Öğretmen panelinde `ExamTrendsChart`, `useExamTrendsAll` ile tüm öğrencileri karşılaştırır.
- **`ExamTrendsChart` line chart (2026-10-10):** tek öğrencide net trend çizgisi, çok öğrencide her
  öğrenci bir çizgi. Renkler `var(--chart-N)` ile verilir; önceki `hsl(var(--chart-N))` geçersizdi
  (`--chart-N` oklch) ve çizgi görünmüyordu. Tek öğrencide y-domain ve nokta vurgusu eklendi.
- **Performans (2026-10-10):** `ExamTrendsChart` tek-öğrenci ve tüm-öğrenci sorgularını koşulsuz
  çağırır ama `enabled` sayesinde yalnızca aktif mod çalışır (önceki `"__none__"` sentinel'i
  `/exams/trends?studentId=__none__` isteği atıyordu). Grafik ayrıca `components/charts/lazy-charts.tsx`
  üzerinden `next/dynamic` ile geç yüklenir.
- **Null/boş dayanıklılık (2026-10-11):** Denemesi olmayan öğrenci için backend `exams: null`
  dönebiliyor; `useExamTrendsAll` bunu `[]`'a çevirir (aksi halde `s.exams.map` atıp query
  hata veriyordu ve tüm karşılaştırma boş kalıyordu). Çok-öğrenci modunda yalnızca denemesi olan
  öğrenciler çizilir; `dataKey` öğrenci adı yerine benzersiz `student-N` (aynı isim/özel karakter
  çizgiyi bozuyordu), ad `name` prop'u ile legend/tooltip'te gösterilir. Y ekseni tüm-öğrenci
  modunda da veri aralığına göre (alt sınır 0'a sabitlenmeden) hesaplanır; net'i 0 olan çizgi eksene
  yapışmaz. Veri yoksa kart metin yerine boş bir line chart çerçevesi (eksen+grid) gösterir,
  üzerine "Henüz yeterli veri yok." yazısı biner.
- Şablon bölüm adları backend ile **birebir** eşleşmeli: `"Türkçe"`, `"Sosyal Bilimler"`,
  `"Temel Matematik"`, `"Fen Bilimleri"`, `"Türk Dili ve Edebiyatı – Sosyal Bilimler-1"` vb.
- Ders kodları (`lessonCode`) `exam-config.ts` `LESSON_CODES` üzerinden eşlenir;
  `canonicalLessonName()` UI adını backend adına çevirir.
