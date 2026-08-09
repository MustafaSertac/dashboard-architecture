# Backend API Eksikleri ve Talepleri

> **Durum:** Frontend entegrasyonu `app/FRONTEND_INTEGRATION.md` dokümantasyonuna göre yapıldı.
> Bu dosya, mevcut backend API'de eksik olan ve frontend'in düzgün çalışması için backend ekibinin eklemesi gereken endpoint ve DTO alanlarını listeler.
>
> **Tarih:** 09.08.2026
> **Muhatap:** Backend Geliştirme Ekibi
> **Önceleme:** Kritik → Yüksek → Orta → Düşük

---

## KRİTİK (Uygulama çalışmaz — en kısa sürede eklenmeli)

### 1. `StudyTaskDTO`'ya `dueDate` alanı eklenmesi

**Endpoint(ler):**
- `GET /api/v1.0/study-tasks/today/{studentId}`
- `GET /api/v1.0/study-tasks/upcoming/{studentId}?limit=5`
- `GET /api/v1.0/study-tasks/students/{studentId}?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd`
- `POST /api/v1.0/study-tasks` (response)
- `PUT /api/v1.0/study-tasks/update` (response)

**Şu anki durum:** `StudyTaskDTO`'da `dueDate` yok. Sadece `CreateTaskRequest`'te `dueDate` gönderiliyor, ama response'da dönmüyor.

**Etkilenen frontend bileşenleri (10 bileşen):**
| Bileşen | Açıklama |
|---------|----------|
| `TodayTasksCard` | Bugünün görevlerini `dueDate === today` filtresiyle bulur |
| `UpcomingTasksCard` | Yaklaşan görevleri `dueDate > today` filtresiyle bulur ve tarihe göre gruplar |
| `WeeklyProgressCard` | Son 7 günün `dueDate`'ine göre bar chart çizer |
| `TaskList` | Görevleri `dueDate`'e göre gruplar ("16 Mayıs 2026" başlığı altında listeler) |
| `DailyTasksView` | Takvimden seçilen güne ait görevleri `isSameDay(dueDate)` ile filtreler |
| `WeeklyTasksView` | Haftalık takvim grid'inde görevleri `dueDate`'e göre hücrelere yerleştirir |
| `MonthlyTasksView` | Aylık takvim grid'inde görevleri `dueDate`'e göre hücrelere yerleştirir ve günlük aggregateler hesaplar |
| `WeeklyAnalytics` | Haftalık analizi `dueDate`'e göre hesaplar ve karşılaştırma haftaları oluşturur |
| Öğretmen öğrenci detay sayfaları | Seçili öğrencinin günlük/haftalık/aylık görevlerini `dueDate` ile görüntüler |

**Talep 1 (Önerilen):**
```typescript
// StudyTaskDTO'ya şu alanı ekleyin:
interface StudyTaskDTO {
  // ... mevcut alanlar ...
  dueDate: string;  // "yyyy-MM-dd" formatında (örn: "2026-08-09")
}
```

**Alternatif Talep 1B:** Eğer `StudyTaskDTO`'ya `dueDate` eklenemezse, her endpoint için response'a `dueDate` eklenmeli.

---

## YÜKSEK (Önemli fonksiyonel eksikler)

### 2. Öğretmen-Öğrenci listesi endpoint'i

**Talep:**
```
GET /api/v1.0/students?teacherId={teacherId:guid}
```
veya
```
GET /api/v1.0/teachers/{teacherId:guid}/students
```

**Şu anki durum:** Öğretmenin kendi öğrencilerini listeleyen bir endpoint yok. Öğretmen panosu (`/teacher`) boş kalıyor.

**Response DTO isteği (öğrenci listesi + istatistikler):**
```typescript
interface TeacherStudentDTO {
  // Temel profil (UserProfileResponse'tan)
  id: string;
  name: string;
  email: string;
  avatar?: string;

  // İstatistikler (backend'de hesaplanırsa N+1'den kurtuluruz)
  weeklyProgress: number;      // Son 7 günün tamamlanma yüzdesi (%0-100)
  totalTasks: number;          // Toplam görev sayısı
  completedTasks: number;      // Tamamlanan görev sayısı
  totalHours: number;          // Toplam çalışma saati
  lastActive: string;          // Son aktivite tarihi (yyyy-MM-dd)
}
```

**Etkilenen bileşenler:** `TeacherDashboardPage`, `StudentList`, tüm `/teacher/students/[studentId]/*` sayfaları, `StudentHeader`

**Not 1:** `lastActive`, öğrencinin son `log-study` veya `complete` işleminin tarihi olabilir.

**Not 2:** Frontend şu an bu veriyi mock (`lib/mock/mock-users.ts`) fallback ile gösteriyor. Backend tamamlandığında tek satır değişiklikle entegre edilebilir.

---

### 3. `ExamTopicResultDTO` genişletilmesi

**Endpoint:** `GET /api/v1.0/exams/{id}?detailed=true`, `POST /api/v1.0/exams`

**Şu anki durum:**
```typescript
interface ExamTopicResultDTO {
  id: string;
  topicCode: number;
  name: string;
  wrong: number;
  blank: number;
}
```

**Eksik alanlar:**
- `correct` — UI'da `{correct}D/{wrong}Y/{empty}B` formatında gösteriliyor
- `questionNumbers` — Hangi soruların bu konudan olduğu gösteriliyor (`questionNumbers.join(", ")`)

**Talep:**
```typescript
interface ExamTopicResultDTO {
  // ... mevcut alanlar ...
  correct: number;                    // Bu konudaki doğru sayısı
  questionNumbers?: number[];         // Bu konuya ait soru numaraları (örn: [1, 5, 12])
}
```

**Etkilenen bileşen:** `ExamResultsTable` topic detay satırları.

---

### 4. `StudyTaskDTO` genişletilmesi (ek alanlar)

**Talep — StudyTaskDTO'ya şu alanları ekleyin:**
```typescript
interface StudyTaskDTO {
  // ... mevcut alanlar ...
  teacherId: string;          // Görevi atayan öğretmenin ID'si
  studentId: string;          // Görevin atandığı öğrencinin ID'si
  dueDate: string;            // Bitiş tarihi (yyyy-MM-dd) — Kritik #1 ile aynı
  createdAt: string;          // Oluşturulma tarihi (ISO DateTime)
  updatedAt: string;          // Son güncelleme tarihi (ISO DateTime)
}
```

**Gerekçe:**
- `teacherId`: Öğretmen panelinde "bu görev hangi öğretmen tarafından atandı" bilgisi için
- `studentId`: Öğrenci panelinde birden çok öğrenci varsa filtreleme için
- `dueDate`: Kritik #1'de detaylandırıldı
- `createdAt` / `updatedAt`: Görev sıralama ve "son aktivite" hesaplaması için

---

## ORTA (UX kalitesini artırır)

### 5. Not/Feedback endpoint'i

**Talep:**
```
POST   /api/v1.0/students/{studentId:guid}/notes
GET    /api/v1.0/students/{studentId:guid}/notes
DELETE /api/v1.0/students/{studentId:guid}/notes/{noteId:guid}
```

**İstenen DTO:**
```typescript
// Create
interface CreateNoteRequest {
  category: "feedback" | "performance" | "improvement" | "praise";
  note: string;           // Not içeriği (max 2000 karakter)
}

// Response
interface NoteDTO {
  id: string;
  studentId: string;
  teacherId: string;      // Notu yazan öğretmen (JWT'den alınabilir)
  category: string;
  note: string;
  createdAt: string;      // ISO DateTime
}
```

**Etkilenen bileşen:** `NoteModal` — şu an simüle edilmiş API çağrısı yapıyor (gerçekte hiçbir yere kaydedilmiyor).

---

### 6. Toplu görev onaylama (Bulk Complete)

**Talep:**
```
POST /api/v1.0/study-tasks/complete/batch
```

**İstenen Request Body:**
```json
{
  "taskIds": ["guid-1", "guid-2", "guid-3"]
}
```

**Response:**
```json
{
  "completedCount": 3,
  "failedIds": []
}
```

**Etkilenen bileşen:** `TeacherActions`'taki "Toplu Onayla" butonu — şu an hiçbir onClick handler'ı yok.

---

### 7. Toplu sınav trend endpoint'i

**Talep:**
```
GET /api/v1.0/exams/trends/all?examCode=10&limit=10
```

**Response `data`:**
```typescript
// Her öğrenci için en son N sınavın trend verisi
interface StudentTrendDTO {
  studentId: string;
  studentName: string;
  exams: ExamSummaryDTO[];
}
// Response: StudentTrendDTO[]
```

**Mevcut durum:** `GET /api/v1.0/exams/trends` tek öğrenci için çalışıyor. Öğretmen panelinde "tüm öğrencilerin trend grafiğini karşılaştırma" modu için N tane tek tek çağrı yapmak gerekiyor (N+1 problem).

**Etkilenen bileşen:** `ExamTrendsChart` — "all students" modu.

---

### 8. Aylık/Yıllık Analiz için eksik özet alanı

**Endpoint:** `GET /api/v1.0/analytics/monthly` ve `GET /api/v1.0/analytics/yearly`

**Şu anki durum:** `MonthlyAnalyticsDTO.summary` tek bir aggregate dönüyor:
```typescript
summary: {
  totalHours: number;
  totalQuestions: number;
  completedCount: number;
  pendingCount: number;
}
```

**Talep:** Ders bazında kırılım eklenmesi (opsiyonel, `?perSubject=true` query parametresiyle):
```typescript
perSubjectStats: {
  subject: string;       // Ders adı
  totalHours: number;
  totalQuestions: number;
  completedCount: number;
  pendingCount: number;
}[];
```

**Etkilenen bileşen:** `MonthlyAnalytics` — `mockMonthlyStats` (ders bazlı `SubjectStats[]`) kaldırıldığında bu veri backend'den gelmeli.

---

## DÜŞÜK (İleride eklenebilir)

### 9. `/auth/forgot-password` için doğrulama akışı

**Mevcut:** `POST /api/v1.0/auth/forgot-password` var, `{email, newPassword}` alıyor. Ama gerçek bir şifre sıfırlama akışı (email doğrulama linki, token bazlı reset) yok.

**Talep:** İleride email doğrulamalı forgot-password akışı eklenecekse, frontend hazır.

---

### 10. Çalışma sayacı (Study Timer) endpoint'i

**Talep (Düşük öncelik):**
```
POST /api/v1.0/study-tasks/{taskId}/focus-session
GET  /api/v1.0/study-tasks/{taskId}/focus-sessions?date=yyyy-MM-dd
```

Şu an `study-timer-card` sadece localStorage'a yazıyor. Backend'de focus session tracking yok.

---

### 11. Profil resmi (avatar) upload

**Talep (Düşük öncelik):**
```
POST /api/v1.0/auth/profiles/avatar    (multipart/form-data)
```

Şu an `UserProfileResponse.avatar` string (URL), ama upload endpoint'i yok.

---

## Backend Hata Düzeltmeleri

### H-1. `POST /auth/teachter` yazım hatası

**Mevcut:** `teachter` (teacher yerine). §10.1'de belirtildiği gibi backend kaynak kodunda bu şekilde.

**Talep:** `POST /auth/teacher` olarak düzeltilsin ve eski URL backward-compatible kalsın (deprecated header ile).

---

## Özet Tablo

| # | Talep | Öncelik | Endpoint(ler) | Tahmini Efor |
|---|-------|---------|---------------|-------------|
| 1 | `StudyTaskDTO.dueDate` | **Kritik** | 5 endpoint | Düşük (1 alan ekleme) |
| 2 | Öğretmen-Öğrenci listesi | **Yüksek** | 1 yeni endpoint | Orta (yeni endpoint + aggregation) |
| 3 | `ExamTopicResultDTO` genişletme | **Yüksek** | 1 endpoint (GET /exams/{id}) | Düşük (2 alan ekleme) |
| 4 | `StudyTaskDTO` ek alanları | **Yüksek** | 5 endpoint | Düşük (4 alan ekleme) |
| 5 | Not/Feedback endpoint | **Orta** | 3 yeni endpoint | Orta |
| 6 | Toplu görev onaylama | **Orta** | 1 yeni endpoint | Düşük |
| 7 | Toplu sınav trend | **Orta** | 1 yeni endpoint | Orta |
| 8 | Ders bazlı analiz özeti | **Orta** | 2 endpoint (query param) | Düşük |
| 9 | Forgot-password akışı | **Düşük** | Mevcut endpoint var | Orta |
| 10 | Focus session tracking | **Düşük** | 2 yeni endpoint | Orta |
| 11 | Avatar upload | **Düşük** | 1 yeni endpoint | Düşük |
| H-1 | "teachter" yazım düzeltmesi | **Düşük** | 1 endpoint rename | Düşük |

---

## Frontend Geçici Çözümler (Backend tamamlanana kadar)

| Eksik | Geçici Çözüm | Ne zaman kalkar |
|-------|-------------|----------------|
| `dueDate` yok | `/study-tasks/today` ve `/study-tasks/students/{id}?startDate&endDate` endpoint'lerinden `dueDate` tahmin edilir; takvim görünümlerinde "Bugün" varsayımı kullanılır | Talep #1 tamamlanınca |
| Öğretmen öğrenci listesi yok | `src/lib/mock/mock-users.ts` fallback'i kullanılır (hardcoded 5 öğrenci) | Talep #2 tamamlanınca |
| `ExamTopicResultDTO.correct` yok | UI'da `correct: 0` varsayılır, topic detay satırında gösterilmez | Talep #3 tamamlanınca |
| Not/Feedback yok | `NoteModal` simüle edilmiş toast gösterir, hiçbir yere kaydetmez | Talep #5 tamamlanınca |
| Toplu onay yok | "Toplu Onayla" butonu pasif (onClick yok) | Talep #6 tamamlanınca |
| Ders bazlı analiz yok | `summary`'den hesaplanan tek aggregate gösterilir | Talep #8 tamamlanınca |
| `switchRole` (demo) | Client-side Zustand store'da `currentUser.role` override edilir, backend çağrısı yapılmaz | Backend'de böyle bir feature planlanmıyor (demo amaçlı) |
