# 05 — Backend Talepleri (Açık)

> **İlgili kural dosyası:** `07-rules.md` (R4–R6).
>
> **KURAL (değişmez):**
> 1. Bu dosya **yalnızca AÇIK** backend taleplerini tutar. Bir talep tamamlanınca buradan **silinir**.
> 2. Silinen tamamlanan iş, ilgili yerlere **aktarılır**:
>    - ilgili modül dokümanı → `modules/{modül}.md` (ör. `auth.md`, `exams.md`, ...)
>    - `TEST_SENARYOLARI.md` → yeni manuel/otomatik senaryo (gerekiyorsa)
>    - `04-last-work.md` → tarihli changelog girişi
>    - `02-architecture.md` → mimari davranış değişikliği
>    - `03-module-endpoints.md` → endpoint/alan değişikliği
>
> API sözleşmesinin tamamı: `docs/BackendTalep.md`; oturum notları: `FRONTEND_INTEGRATION.md`.

---

## Açık talepler

| # | Talep | Endpoint / Alan | Durum |
|---|-------|-----------------|:-----:|
| **#12** | **Günlük seri (streak)** | `DashboardOverviewDTO.quickStats.currentStreak` / `longestStreak` | ⏳ Backend bekliyor |
| **#13** | **Org görünürlüğünde öğrenci kaldırma** | `GET /teachers/{teacherId}/students` + `DELETE .../{studentId}` | ⏳ Backend bekliyor |

---

## #12 — Günlük seri (streak)

**Neden:** `StudyTimerCard` "Günlük Seri" göstergesi şu an sabit (`7`), hiçbir veriye bağlı değil.

**İstenen:** Yeni endpoint YOK. `GET /analytics/dashboard` yanıtındaki `quickStats`'a iki alan:
```ts
currentStreak: number;   // kesintisiz aktif gün sayısı
longestStreak: number;   // en uzun aktif gün serisi
```

**Aktif gün tanımı:** o gün `POST /study-tasks/log-study` ile >0 saat çalışılmış **veya**
o güne ait en az bir görev tamamlanmış (`isCompleted = true`).

**Kurallar:**
- `currentStreak` bugünü içerir; bugün henüz aktif değilse seri kırılmaz, dünden geriye sayılır.
- Dün de aktif değilse `currentStreak = 0`.
- `longestStreak` tüm geçmiş serilerin en uzunu.

**Uyumluluk:** Route/HTTP değişmez, yalnızca response alanı eklenir → geriye uyumlu.

**Backend entegre olana kadar frontend planı:** İstemci tarafı fallback —
`GET /study-tasks/students/{studentId}?startDate&endDate` (son 90 gün) verisinden seri hesaplama.
Detay: `06-yapilacaklar.md`.

---

## #13 — Org görünürlüğü açıkken öğrenci kaldırma

**Neden:** `canViewAllStudents = true` olan bir öğretmen `GET /teachers/{teacherId}/students` ile
**aynı organizasyondaki tüm öğrencileri** görür. Bu öğrenciler yalnızca görünürlük nedeniyle listededir;
öğretmenle aralarında doğrudan `TeacherStudent` kaydı yoktur. Öğrenci kartındaki "Kaldır" butonu
`DELETE /teachers/{teacherId}/students/{studentId}` çağırınca backend **404 `ERR_ENROLLMENT_NOT_FOUND`**
("Enrollment was not found.") döner ve öğrenci listeden kaybolmaz.

**Gözlemlenen:** `/teacher/students` → bir org öğrencisinde "Kaldır" → 404; liste değişmez.

**İstenen (tercihen A):**
- **A (önerilen):** `TeacherStudentDTO`'ya kaydın kime ait olduğunu belirten alan eklensin
  (`OwnerTeacherId` ve/veya `IsEnrolled: boolean`). Frontend yalnızca kendi kayıtlarında "Kaldır"
  göstersin; böylece yanlış 404 üretilmez.
- **B:** Org görünürlüğüyle listede olan öğrenciler için de kaldırma çalışsın (öğretmene özel
  "gizli/excluded" kaydı ile `GET /teachers/{teacherId}/students` bu kayıtları dışlayacak şekilde
  filtrelenir).

**Mevcut durum (frontend):** Kural gereği liste olduğu gibi gösterilir (istemci filtresi/mock yok);
kaldırma davranışı backend'e bağlıdır. Detay: `modules/organizations.md` (görünürlük kuralı).

---

## Yeni talep şablonu

```
#<no> — <başlık>
Neden:     <mevcut sorun>
İstenen:   <endpoint / alan / davranış>
Sözleşme:  <request/response örneği>
Etki:      <geriye uyumluluk, migration vb.>
Frontend:  <talebi tüketecek hook/component>
```

**Referanslar:** `docs/BackendTalep.md` (tam sözleşme), `FRONTEND_INTEGRATION.md` (oturum notları),
`04-last-work.md` (tamamlananlar).
