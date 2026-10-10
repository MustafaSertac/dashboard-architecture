# 04 — En Son Ne Yaptık (Changelog)

> Tarihli çalışma günlüğü, en yeni en üstte. Amaç: yeni oturumda nerede kaldığımızı hızlıca görmek.
> **Bu dosya yalnızca son 10 girişi tutar;** daha eskiler `04-last-work-archive.md` dosyasındadır.

---

## 2026-10-10 (17) — Öğretmen paneli: çıkış yan navigation drawer'a taşındı

Öğretmen düzeninde "Çıkış Yap" artık yan navigasyon drawer'ında (masaüstü sidebar + mobil drawer)
doğrudan görünür.

- `teacher-layout.tsx` — yeni `AccountSection` (avatar + ad/rol + "Çıkış Yap" butonu); masaüstü
  sidebar'ın altındaki dropdown kaldırıldı, yerine `AccountSection` kondu; mobil `Sheet` drawer'a da
  eklendi (brand + kaydırılabilir nav + hesap bölümü). Öğrenci düzeninde zaten mevcuttu.

**Doğrulama:** `npx tsc --noEmit` temiz, `npm run test:run` 121/121, `npm run build` başarılı.

> Aktarım: `modules/teacher.md`.

---

## 2026-10-10 (16) — Öğrenci ders atama + görev formu ders filtresi

Backend `StudentLessons` özelliği frontend'e bağlandı; görev formundaki ders listesi atanan derslerle
sınırlandı.

- **Sözleşme:** `endpoints.studentLessons.*`, `qk.studentLessons.*`, `StudentLessonDTO` /
  `SetStudentLessonsRequest`; `lessonService.getStudentLessons/setStudentLessons/removeStudentLesson/
  getStudentOwnLessons`; hook'lar `useStudentLessons`, `useStudentOwnLessons`, `useSetStudentLessons`,
  `useRemoveStudentLesson`.
- **Öğretmen UI:** `/teacher/students/{studentId}/lessons` (`StudentLessonsView`) — checkbox ile seç,
  "Kaydet" `PUT` replace-all; sidebar öğrenci menüsüne "Dersler" + `StudentHeader` "lessons" tipi.
- **Öğrenci UI:** `/dashboard` "Derslerim" kartı (`MyLessonsCard`).
- **Görev formu:** `TaskModal` "Ders" listesi öğrencinin atanmış dersleriyle sınırlanır
  (`filterLessonsByAssignment`; atama yoksa tüm dersler).
- **Testler:** lesson service (+4), `student-lessons-view.test.tsx` (2), `assigned-lessons.test.ts` (2).

**Doğrulama:** `npx tsc --noEmit` temiz, `npm run test:run` 121/121, `npm run build` başarılı
(`/teacher/students/[studentId]/lessons` route'u üretildi).

> Aktarım: `modules/lessons.md`, `modules/study-tasks.md`, `03-module-endpoints.md`,
> `TEST_SENARYOLARI.md` (S30), `FRONTEND_INTEGRATION.md` §5.10.

---

## 2026-10-10 (15) — Frontend performans iyileştirmeleri (istek/render/bundle)

Kapsamlı performans turu: gereksiz istekler, gereksiz re-render'lar, cache ayarı, bundle boyutu
ve rota prefetch'i iyileştirildi.

- **Gereksiz istekler (A1):** `exam-trends-chart.tsx` iki trend sorgusunu (tek öğrenci + tüm
  öğrenciler) koşulsuz çağırıyordu; `"__none__"` sentinel'i ile `/exams/trends?studentId=__none__`
  isteği atılıyordu. Artık mod bazında yalnızca ilgili sorgu çalışır; sentinel kaldırıldı.
  `useExamTrendsAll` → `enabled: !!examCode && !!teacherId`.
- **Re-render (A2):** `AuthProvider` context değeri `useMemo` ile sabitlendi ve değerden
  `accessToken` çıkarıldı; 15 dk'lık token yenilemesi artık tüm `useAuth()` tüketicilerini yeniden
  render etmiyor (kimse context'ten `accessToken`/`setUser` tüketmiyordu).
- **Cache (A3):** global `staleTime` 30 sn → 5 dk; `useTasksByRange`, weekly/monthly/yearly
  analytics ve `useExamTrends`'a `placeholderData: keepPreviousData` (gezinmede skeleton flaşı yok).
- **Bundle (A4):** Recharts (~500 KB) dashboard/exams grafikleri `next/dynamic` (`ssr:false`) ile
  lazy yükleniyor — yeni `src/components/charts/lazy-charts.tsx` + kart iskeleti.
- **Prefetch (A5):** `student-list.tsx` "Detaylari Gor" butonu `router.push` yerine `next/link`
  (`prefetch`) kullanır; öğrenci detay rota paketi önden yüklenir.
- **Ölçüm (A0):** `@next/bundle-analyzer` (dev) eklendi; `ANALYZE=true` ile çalışır.

**Doğrulama:** `npx tsc --noEmit` temiz, `npm run test:run` 119/119, `npm run build` başarılı.

> Aktarım: `02-architecture.md`, `modules/exams.md`, `modules/analytics.md`,
> `modules/study-tasks.md`, `modules/teacher.md`, `01-proje-ozeti.md`, `06-yapilacaklar.md`,
> `07-rules.md`.

---

## 2026-10-10 (14) — Aylık Analiz "Toplam Saat" 2 ondalık

`/dashboard/analytics` → Aylık Analiz özet kartındaki "Toplam Saat" ham değer yerine 2 ondalık
gösterilir (ör. `2.00`).

- `monthly-analytics.tsx` — `{totals.totalHours}` → `{totals.totalHours.toFixed(2)}`
  (haftalık analizde de zaten `toFixed(2)`).

**Doğrulama:** `npx tsc --noEmit` temiz, `npm run test:run` 113/113, `npm run build` başarılı.

> Aktarım: `modules/analytics.md`.

---

## 2026-10-10 (13) — `/dashboard/tasks` çökme düzeltmesi (TaskViewDateProvider)

Öğrenci `/dashboard/tasks` sayfası `DailyTasksView` render ettiğinde
`"useTaskViewDate must be used within TaskViewDateProvider"` hatası alınıyordu (provider yalnızca
öğretmen öğrenci-detay layout'unda vardı).

- **`src/app/dashboard/layout.tsx`** — `TaskViewDateProvider` eklendi; tüm dashboard sayfaları kapsanır.

**Doğrulama:** `npx tsc --noEmit` temiz, `npm run test:run` 113/113, `npm run build` başarılı.

> Aktarım: `02-architecture.md`.

---

## 2026-10-10 (12) — Task modülü backend değişiklikleri frontend'e bağlandı

Backend'de yapılan Task değişiklikleri (toplama, isCompleted, 409, targetHours) frontend'e uyarlandı.

- **log-study artık toplar:** `useStudyTimer` ve günlük inline edit artık **delta** gönderir
  (timer: `hours = geçen süre/3600`, counts 0; inline edit: yeni değer − mevcut değer). Değişiklik yoksa
  istek atılmaz.
- **`isCompleted` (nullable):** `UpdateTaskRequest`'e eklendi + mapper aktarır. Günlük görünümde
  checkbox toggle: pending → `complete`; completed → `update { isCompleted: false }` (geri açma).
- **Tamamlanmış göreve log-study → 409:** günlük görünümde "Güncelle" butonu tamamlanmış görevde
  devre dışı (başlıkla bilgilendirir).
- **`targetHours` 2 ondalık:** backend; frontend değişikliği gerekmez.
- **Tip/sözleşme:** `LogTaskStudyRequest` artırım notu, `UpdateTaskRequest.isCompleted`,
  `FRONTEND_INTEGRATION.md` §5.5 güncellendi.
- **Testler:** timer payload (delta) + mapper `isCompleted` testleri güncellendi/eklendi.

**Doğrulama:** `npx tsc --noEmit` temiz, `npm run test:run` 113/113, `npm run build` başarılı.

> Aktarım: `modules/study-tasks.md`, `03-module-endpoints.md`, `TEST_SENARYOLARI.md` (S2, S29).

---

## 2026-10-10 (11) — Haftalık görev takvimi: Pazartesi–Pazar

`weekly-tasks-view.tsx` haftayı **Pazartesi'den Pazar'a (7 gün)** gösterir; her görev kendi
`dueDate` hücresine dağıtılır. Bu davranış zaten mevcuttu (doğrulandı).

- Yanıltıcı/eski "backend dueDate dönmüyor, tüm görevler tek hücrede" yorumu kaldırıldı.
- `weekEnd` `useMemo([currentWeekStart])` ile stabilize edildi (gereksiz yeniden hesaplama önlendi).

**Doğrulama:** `npx tsc --noEmit` temiz, `npm run test:run` 111/111, `npm run build` başarılı.

---

## 2026-10-10 (10) — Haftalık İlerleme grafiği: sadece soru sayısı

Dashboard "Haftalık İlerleme" kartı (`weekly-progress-card.tsx`) sadeleştirildi ve düzeltildi.

- "Doğru" çubuğu ve `dogru` verisi kaldırıldı; yalnızca çözülen **soru sayısı** çubuğu kaldı.
- Renkler `hsl(var(--chart-1))` → `var(--chart-1)` (geçersizdi, çubuk görünmüyordu); tooltip
  `var(--card)`/`var(--border)`/`var(--foreground)`.

**Doğrulama:** `npx tsc --noEmit` temiz, `npm run test:run` 111/111, `npm run build` başarılı.

> Aktarım: `modules/analytics.md`, `06-yapilacaklar.md` (geçersiz chart renkleri maddesi kapatıldı).

---

## 2026-10-10 (9) — Saat gösterimi 2 ondalıklı

Çalışılan süre saat olarak kalır, ancak **2 ondalık basamak** gösterilir (ör. `2.12 saat`).

- `weekly-analytics.tsx` — Haftalık Analiz'deki tüm saat gösterimleri `.toFixed(1)` → `.toFixed(2)`
  (özet kartı, ders hücreleri, tfoot Toplam Saat, haftalar arası karşılaştırma).
- `daily-tasks-view.tsx` — günlük özet "Saat" kartı ve görev satırındaki `Saat: X` → `toFixed(2)`.

**Doğrulama:** `npx tsc --noEmit` temiz, `npm run test:run` 111/111, `npm run build` başarılı.

> Aktarım: `modules/study-tasks.md`, `modules/analytics.md`.

---

## 2026-10-10 (8) — StudyTaskDTO: studiedHours → studiedMinutes/studiedSeconds

Backend `StudyTaskDTO`'da saat (`double studiedHours`) kaldırıldı; yerine **toplam dakika**
(`studiedMinutes`) + **kalan saniye** (`studiedSeconds`, 0-59) geldi. Frontend uyarlandı.

- `study-task.types.ts` — `studiedHours` yerine `studiedMinutes` + `studiedSeconds`.
- `study-task.mapper.ts` — UI `hoursStudied = (studiedMinutes*60 + studiedSeconds)/3600` olarak
  türetilir; görünümler `hoursStudied`'ı kullanmaya devam eder (davranış değişmez).
- `study-task.mapper.test.ts` — yeni alanlar + dönüşüm testleri.
- `src/app/FRONTEND_INTEGRATION.md` — `StudyTaskDTO` snippet'i güncellendi.

> Not: `log-study` request'i (`LogTaskStudyRequest.hours`, double) **değişmedi**; entity/DB değişmedi.

**Doğrulama:** `npx tsc --noEmit` temiz, `npm run test:run` 111/111, `npm run build` başarılı.

> Aktarım: `modules/study-tasks.md`.

---

## 2026-10-10 (7) — Kayıt: ad-soyad normalizasyonu

Register "Ad Soyad" alanı boşluğa göre split edilip biçimlendirilir: son parça **soyad** (tamamı
büyük harf), önceki parçalar **isim** (ilk harf büyük, kalanı küçük; `tr-TR`).

- **Yeni `formatFullName`** — `src/lib/utils.ts` (`toTitleCase` yardımcı + `formatFullName`).
- `register/page.tsx` — alan `onBlur`'da ve submit'te `formatFullName` uygular; request'e biçimlenmiş
  `name` gider.
- **Test:** `src/lib/utils.test.ts` (7 test).

**Doğrulama:** `npx tsc --noEmit` temiz, `npm run test:run` 109/109, `npm run build` başarılı.

> Aktarım: `modules/auth.md`, `TEST_SENARYOLARI.md` (S28 + otomatik test satırı).

---

## 2026-10-10 (6) — Deneme trend grafiği düzgün line chart

`ExamTrendsChart` (öğretmen/öğrenci deneme sayfaları) çizgisi görünmüyordu; düzgün line chart'a
çevrildi.

- **Kök neden:** çizgi rengi `hsl(var(--chart-1))` şeklindeydi; `--chart-N` değerleri `oklch(...)`
  olduğu için `hsl(oklch(...))` geçersizdi → çizgi (`stroke`) render edilmiyordu.
- `exam-trends-chart.tsx` — renkler `var(--chart-N)`'e çevrildi; tek öğrenci modunda y-domain
  otomatik hesaplanır, nokta/aktif nokta vurgusu; çok öğrenci modunda her öğrenci bir çizgi
  (`connectNulls`); eksen/tooltip geçerli CSS değişkenleriyle.

**Doğrulama:** `npx tsc --noEmit` temiz, `npm run test:run` 102/102, `npm run build` başarılı.

> Aktarım: `modules/exams.md`. Not: aynı `hsl(var(--chart-N))` deseni `weekly-progress-card.tsx`
> (BarChart) ve tooltip stillerinde de var; ayrı iş olarak düzeltilebilir.

---

## 2026-10-10 (5) — Toplu onay: günlük görünümde seçili gün

Günlük görünümde "Toplu Onayla" artık yalnızca **seçili günün** görevlerini onaylar (önceki hafta
kapsamı daraltıldı). Kapsam görünüme göre: `daily` → seçili gün, `weekly` → görüntülenen hafta
(Pzt–Paz), `monthly` → görüntülenen ay.

- `teacher-actions.tsx` — kapsam hesabı `viewType`'a göre dallandırıldı (`viewDate` günlük görünümde
  seçili günü ifade eder).

**Doğrulama:** `npx tsc --noEmit` temiz, `npm run test:run` 102/102, `npm run build` başarılı.

> Aktarım: `modules/study-tasks.md`, `02-architecture.md`, `TEST_SENARYOLARI.md` (S6).

---

## Sıradaki İşler

Açık iş listesi tek yerde: **`06-yapilacaklar.md`**. (Bu dosya yalnızca tarihli geçmiş/changelog tutar;
açık talepler `05-backend-talepleri.md` ve görevler `06-yapilacaklar.md`.)

> 2026-10-10 (5) ve öncesi girişler arşive taşındı: **`04-last-work-archive.md`**.
