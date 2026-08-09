# ProKocBackend — Frontend Entegrasyon Rehberi

> **Tüm API'ler için eksiksiz referans dokümanı.** Bu dosyayı frontend geliştiriciye verin veya AI prompt olarak kullanın.

---

## 1. Bağlantı Bilgileri

| Bilgi | Değer |
|-------|-------|
| **Base URL (HTTP)** | `http://localhost:5295` |
| **Base URL (HTTPS)** | `https://localhost:7056` |
| **API Version** | `v1.0` — tüm rotalar `/api/v1.0/` altında |
| **Auth Header** | `Authorization: Bearer <accessToken>` |
| **Content-Type** | `application/json` |
| **CORS** | **YOK** — dev proxy kullan veya backend'e CORS ekle |

### CORS Çözümü

**Seçenek A — Vite Dev Proxy (önerilen):**
```javascript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5295',
        changeOrigin: true
      }
    }
  }
})
```

**Seçenek B — Backend'e CORS ekle:**
```csharp
// Program.cs
builder.Services.AddCors(o => o.AddPolicy("dev", b => 
    b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));
app.UseCors("dev");
```

---

## 2. API Response Envelope

**Her endpoint** aynı envelope yapısını kullanır:

```json
// Başarılı yanıt:
{
  "isSuccess": true,
  "data": <DTO veya DTO listesi>
}

// Hatalı yanıt:
{
  "isSuccess": false,
  "error": {
    "code": "ERR_SOMETHING",
    "message": "İnsan tarafından okunabilir açıklama",
    "details": ["opsiyonel", "detaylar"]
  }
}
```

HTTP status code JSON body'de **DEĞİLDİR** — HTTP header'da gelir (200, 201, 400, 404, 409, 500).

**Unhandled exception durumunda** farklı bir yapı:
```json
{
  "traceId": "<trace-id>",
  "message": "<hata mesajı>"
}
```

## PagedResult (sayfalı listeler)
```json
{
  "items": [...],
  "page": 1,
  "pageSize": 10,
  "totalCount": 45,
  "totalPages": 5
}
```

---

## 3. Authentication (JWT)

### Akış

```
1. POST /api/v1.0/auth/login → { accessToken, refreshToken, user }
2. Tüm isteklerde: Authorization: Bearer <accessToken>
3. Token 15 dk.'da expire → POST /api/v1.0/auth/refresh-token → yeni accessToken
4. Çıkış: POST /api/v1.0/auth/logout
```

### Endpoint'ler

| Method | Route | Auth | Request Body | Response `data` |
|--------|-------|------|-------------|----------------|
| POST | `/auth/login` | AllowAnonymous | `{ email, password }` | `AuthResponse` |
| POST | `/auth/student` | AllowAnonymous | `StudentRegisterRequest` | `AuthResponse` (201) |
| POST | `/auth/teachter` | AllowAnonymous | `TeacherRegisterRequest` | `AuthResponse` (201) |
| POST | `/auth/forgot-password` | AllowAnonymous | `{ email, newPassword }` | `{ message }` |
| POST | `/auth/refresh-token` | JWT gerekli | `{ refreshToken }` | `AuthResponse` |
| POST | `/auth/logout` | JWT gerekli | `{ refreshToken }` | `{ message }` |
| GET | `/auth/profiles/{userId}` | JWT gerekli | — | `UserProfileResponse` |
| PUT | `/auth/profiles` | JWT gerekli | `UpdateProfileRequest` | `UserProfileResponse` |

### Auth DTO'lar

```typescript
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfileResponse;
}

interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  role: 0 | 1 | 2; // Admin=0, Teacher=1, Student=2
  avatar?: string;
  isVerified: boolean;
  isKvkVerified: boolean;
  phoneNumber: string;
  gender: 0 | 1; // Male=0, Female=1
}
```

### Auth Hataları

| Error Code | HTTP | Açıklama |
|-----------|------|----------|
| `ERR_VALIDATION_FAILED` | 400 | Eksik/geçersiz alan |
| `ERR_INVALID_CREDENTIALS` | 401 | Hatalı email/şifre |
| `ERR_EMAIL_EXISTS` | 409 | Email zaten kayıtlı |
| `ERR_INVALID_REFRESH_TOKEN` | 400/401 | Refresh token geçersiz/süresi dolmuş |
| `ERR_USER_NOT_FOUND` | 404 | Kullanıcı bulunamadı |

---

## 4. Enum Değerleri

```typescript
// Sınav tipi
const ExamCode = { TYT: 10, AYT: 11, Both: 12 } as const;

// Sınav durumu
const ExamStatus = { Draft: 0, Submitted: 1, Completed: 2, Archived: 3 } as const;

// Cinsiyet
const Gender = { Male: 0, Female: 1 } as const;

// Kullanıcı rolü (API response'ta bu değerlerle gelir)
const UserRole = { Admin: 0, Teacher: 1, Student: 2 } as const;

// Görev tipi
const TaskType = { Assigned: 0, UnAssigned: 1 } as const;

// JWT claim'deki rol — API response'taki UserRole'dan FARKLI:
// Admin=0 → JWT claim "role"=3
// Teacher=1 → JWT claim "role"=2
// Student=2 → JWT claim "role"=1
```

---

## 5. Tüm Endpoint Kataloğu (39 endpoint)

### 5.1 Lessons

| Method | Route | Body | Response `data` |
|--------|-------|------|----------------|
| GET | `/api/v1.0/lessons?examType=10` | — | `LessonDTO[]` |
| GET | `/api/v1.0/lessons/{lessonId:guid}` | — | `LessonDTO` |
| POST | `/api/v1.0/lessons` | `CreateLessonRequest` | `LessonDTO` (201) |
| PUT | `/api/v1.0/lessons/{lessonId:guid}` | `UpdateLessonRequest` | `LessonDTO` |
| DELETE | `/api/v1.0/lessons/{lessonId:guid}` | — | success |

**CreateLessonRequest:**
```json
{
  "name": "Matematik",
  "code": 11,
  "description": "Matematik dersi",
  "examTypes": [10, 11]
}
```

**LessonDTO:**
```typescript
interface LessonDTO {
  id: string; name: string; code: number; description?: string;
  isActive: boolean; examTypes: number[]; unitCount: number;
  units?: UnitDTO[]; createdAt: string; updatedAt?: string;
}
```

### 5.2 Units

| Method | Route | Body | Response `data` |
|--------|-------|------|----------------|
| GET | `/api/v1.0/lessons/{lessonId:guid}/units` | — | `UnitDTO[]` |
| POST | `/api/v1.0/lessons/{lessonId:guid}/units` | `CreateUnitRequest` | `UnitDTO` (201) |
| PUT | `/api/v1.0/units/{unitId:guid}` | `UpdateUnitRequest` | `UnitDTO` |
| DELETE | `/api/v1.0/units/{unitId:guid}` | — | success |

**CreateUnitRequest:**
```json
{
  "code": 201,
  "name": "Fonksiyonlar",
  "order": 1,
  "description": "Fonksiyonlar ünitesi",
  "examTypes": [10, 11]
}
```

**UnitDTO:**
```typescript
interface UnitDTO {
  id: string; lessonCode: number; code: number; name: string;
  order: number; description?: string; isActive: boolean;
  examTypes: number[]; topicCount: number; topics?: TopicDTO[];
  createdAt: string; updatedAt?: string;
}
```

### 5.3 Topics

| Method | Route | Body | Response `data` |
|--------|-------|------|----------------|
| GET | `/api/v1.0/units/{unitId:guid}/topics` | — | `TopicDTO[]` |
| POST | `/api/v1.0/units/{unitId:guid}/topics` | `CreateTopicRequest` | `TopicDTO` (201) |
| PUT | `/api/v1.0/topics/{topicId:guid}` | `UpdateTopicRequest` | `TopicDTO` |
| DELETE | `/api/v1.0/topics/{topicId:guid}` | — | success |

**CreateTopicRequest:**
```json
{
  "topicCode": 1041,
  "name": "Paragraf",
  "order": 0,
  "description": "Paragraf konusu",
  "examTypes": [10]
}
```

**TopicDTO:**
```typescript
interface TopicDTO {
  id: string; unitCode: number; topicCode: number; name: string;
  order: number; description?: string; isActive: boolean;
  examTypes: number[]; createdAt: string; updatedAt?: string;
}
```

### 5.4 Exams

| Method | Route | Body | Response `data` |
|--------|-------|------|----------------|
| GET | `/api/v1.0/exams/trends?studentId=X&examCode=10&limit=10` | — | `ExamSummaryDTO[]` |
| GET | `/api/v1.0/exams/{id}?detailed=false` | — | `ExamSummaryDTO` (summary) |
| GET | `/api/v1.0/exams/{id}?detailed=true` | — | `ExamDTO` (detaylı) |
| GET | `/api/v1.0/exams?studentId=X&page=1&pageSize=10` | — | `PagedResult<ExamSummaryDTO>` |
| POST | `/api/v1.0/exams` | `CreateExamRequest` | `ExamDTO` (201) |
| PUT | `/api/v1.0/exams/{id}` | `UpdateExamRequest` | `ExamDTO` |
| DELETE | `/api/v1.0/exams/{id}` | — | success |

**CreateExamRequest (TYT örneği):**
```json
{
  "studentId": "student-guid-123",
  "examCode": 10,
  "examName": "TYT Deneme 1",
  "examDate": "2026-06-20T10:00:00Z",
  "durationMinutes": 135,
  "notes": "İlk deneme",
  "status": 1,
  "sections": [
    {
      "name": "Türkçe",
      "correct": 30, "wrong": 7, "blank": 3,
      "lessons": [
        {
          "lessonCode": 10, "name": "TÜRKÇE",
          "correct": 30, "wrong": 7, "blank": 3,
          "topicResults": [
            { "topicCode": 1041, "name": "Paragraf", "wrong": 2, "blank": 1 }
          ]
        }
      ]
    },
    {
      "name": "Sosyal Bilimler",
      "correct": 15, "wrong": 3, "blank": 2,
      "lessons": [
        { "lessonCode": 16, "name": "TARİH", "correct": 4, "wrong": 1, "blank": 0 },
        { "lessonCode": 17, "name": "COĞRAFYA", "correct": 4, "wrong": 1, "blank": 0 },
        { "lessonCode": 18, "name": "FELSEFE", "correct": 4, "wrong": 0, "blank": 1 },
        { "lessonCode": 19, "name": "DİN KÜLTÜRÜ", "correct": 3, "wrong": 1, "blank": 1 }
      ]
    },
    {
      "name": "Temel Matematik",
      "correct": 28, "wrong": 8, "blank": 4,
      "lessons": [
        { "lessonCode": 11, "name": "MATEMATİK", "correct": 28, "wrong": 8, "blank": 4 }
      ]
    },
    {
      "name": "Fen Bilimleri",
      "correct": 14, "wrong": 4, "blank": 2,
      "lessons": [
        { "lessonCode": 13, "name": "FİZİK", "correct": 5, "wrong": 2, "blank": 0 },
        { "lessonCode": 14, "name": "KİMYA", "correct": 5, "wrong": 1, "blank": 1 },
        { "lessonCode": 15, "name": "BİYOLOJİ", "correct": 4, "wrong": 1, "blank": 1 }
      ]
    }
  ]
}
```

**CreateExamRequest (AYT örneği — 4 bölümün tamamı zorunlu, 160 soru):**
```json
{
  "studentId": "student-guid-456",
  "examCode": 11,
  "examName": "AYT SAY Denemesi",
  "examDate": "2026-06-27T10:00:00Z",
  "durationMinutes": 180,
  "status": 1,
  "sections": [
    {
      "name": "Türk Dili ve Edebiyatı – Sosyal Bilimler-1",
      "correct": 18, "wrong": 4, "blank": 18,
      "lessons": [
        { "lessonCode": 10, "name": "TÜRKÇE", "correct": 12, "wrong": 2, "blank": 10 },
        { "lessonCode": 16, "name": "TARİH", "correct": 4, "wrong": 1, "blank": 5 },
        { "lessonCode": 17, "name": "COĞRAFYA", "correct": 2, "wrong": 1, "blank": 3 }
      ]
    },
    {
      "name": "Sosyal Bilimler-2",
      "correct": 18, "wrong": 8, "blank": 14,
      "lessons": [
        { "lessonCode": 16, "name": "TARİH", "correct": 5, "wrong": 3, "blank": 3 },
        { "lessonCode": 17, "name": "COĞRAFYA", "correct": 5, "wrong": 2, "blank": 4 },
        { "lessonCode": 18, "name": "FELSEFE", "correct": 6, "wrong": 2, "blank": 4 },
        { "lessonCode": 19, "name": "DİN KÜLTÜRÜ", "correct": 2, "wrong": 1, "blank": 3 }
      ]
    },
    {
      "name": "Matematik",
      "correct": 20, "wrong": 10, "blank": 10,
      "lessons": [
        { "lessonCode": 11, "name": "MATEMATİK", "correct": 15, "wrong": 8, "blank": 7 },
        { "lessonCode": 12, "name": "GEOMETRİ", "correct": 5, "wrong": 2, "blank": 3 }
      ]
    },
    {
      "name": "Fen Bilimleri",
      "correct": 20, "wrong": 10, "blank": 10,
      "lessons": [
        { "lessonCode": 13, "name": "FİZİK", "correct": 7, "wrong": 4, "blank": 3 },
        { "lessonCode": 14, "name": "KİMYA", "correct": 7, "wrong": 3, "blank": 3 },
        { "lessonCode": 15, "name": "BİYOLOJİ", "correct": 6, "wrong": 3, "blank": 4 }
      ]
    }
  ]
}
```

**ExamDTO (detaylı — sadece `?detailed=true` ile):**
```typescript
interface ExamDTO {
  id: string; studentId: string; examCode: number; examName: string;
  examDate: string; status: number; durationMinutes?: number; notes?: string;
  totalNet?: number; totalCorrect: number; totalWrong: number; totalBlank: number;
  sections: ExamSectionDTO[]; createdAt: string; updatedAt?: string;
}

interface ExamSectionDTO {
  id: string; name: string; correct: number; wrong: number; blank: number;
  net?: number; lessons: ExamLessonDTO[];
}

interface ExamLessonDTO {
  id: string; lessonCode: number; name: string; correct: number;
  wrong: number; blank: number; net?: number;
  topicResults: ExamTopicResultDTO[];
}

interface ExamTopicResultDTO {
  id: string; topicCode: number; name: string; wrong: number; blank: number;
}
```

**ExamSummaryDTO (summary — `?detailed=false` veya list endpoint'lerde):**
```typescript
interface ExamSummaryDTO {
  id: string; studentId: string; examCode: number; examName: string;
  examDate: string; status: number; durationMinutes?: number;
  totalNet?: number; totalCorrect: number; totalWrong: number; totalBlank: number;
  createdAt: string; updatedAt?: string;
}
```

### 5.5 Study Tasks

| Method | Route | Body | Response `data` |
|--------|-------|------|----------------|
| GET | `/api/v1.0/study-tasks/today/{studentId}` | — | `StudyTaskDTO[]` |
| GET | `/api/v1.0/study-tasks/upcoming/{studentId}?limit=5` | — | `StudyTaskDTO[]` |
| POST | `/api/v1.0/study-tasks` | `CreateTaskRequest` | `StudyTaskDTO` (201) |
| GET | `/api/v1.0/study-tasks/students/{studentId}?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd` | — | `StudyTaskDTO[]` |
| PUT | `/api/v1.0/study-tasks/update` | `UpdateTaskRequest` | `StudyTaskDTO` |
| DELETE | `/api/v1.0/study-tasks` | `DeleteTaskRequest` | success |
| POST | `/api/v1.0/study-tasks/complete` | `CompleteTaskRequest` | `StudyTaskDTO` |
| POST | `/api/v1.0/study-tasks/log-study` | `LogTaskStudyRequest` | `StudyTaskDTO` |

**CreateTaskRequest:**
```json
{
  "studentId": "student-123",
  "lessonId": "lesson-1",
  "lessonTitle": "Matematik",
  "taskType": 0,
  "topicId": "topic-1",
  "unitId": "unit-1",
  "topicTitle": "Fonksiyonlar",
  "title": "Fonksiyon Çalışması",
  "description": "Günlük çalışma",
  "targetHours": 2.0,
  "targetQuestions": 50,
  "dueDate": "2026-08-10"
}
```

**LogTaskStudyRequest:**
```json
{
  "taskId": "guid-here",
  "hours": 1.5,
  "correctCount": 40,
  "wrongCount": 5,
  "emptyCount": 5
}
```

**StudyTaskDTO:**
```typescript
interface StudyTaskDTO {
  taskId: string; lessonId: string; lessonTitle: string;
  topicId: string; topicTitle: string; unitId?: string;
  title: string; description: string; taskType: number;
  targetHours: number; targetQuestions: number;
  studiedHours: number; correctCount: number; wrongCount: number;
  emptyCount: number; totalQuestions: number; net: number;
  successRate: number; isCompleted: boolean; isTargetAchieved: boolean;
}
```

### 5.6 Analytics

| Method | Route | Response `data` |
|--------|-------|----------------|
| GET | `/api/v1.0/analytics/weekly?studentId=X&weekStart=2026-08-03` | `WeeklyAnalyticsDTO` |
| GET | `/api/v1.0/analytics/monthly?studentId=X&year=2026&month=8` | `MonthlyAnalyticsDTO` |
| GET | `/api/v1.0/analytics/yearly?studentId=X&year=2026` | `MonthlyAnalyticsDTO` |
| GET | `/api/v1.0/analytics/dashboard?studentId=X` | `DashboardOverviewDTO` |

**WeeklyAnalyticsDTO:**
```typescript
interface WeeklyAnalyticsDTO {
  weekStart: string; weekEnd: string;
  days: WeeklyDayBreakdown[];
  weeklyTotals: { questions: number; correct: number; hours: number; };
}

interface WeeklyDayBreakdown {
  date: string; dayName: string;
  subjects: { name: string; questions: number; correct: number; hours: number; }[];
  totalQuestions: number; totalCorrect: number; totalHours: number;
}
```

**MonthlyAnalyticsDTO:**
```typescript
interface MonthlyAnalyticsDTO {
  year: number; month: number;
  summary: { totalHours: number; totalQuestions: number; completedCount: number; pendingCount: number; };
  courses: CourseStats[];
}

interface CourseStats {
  course: string;
  branches: { branch: string; totalQuestions: number; totalMistakes: number; topics: TopicStats[]; }[];
}

interface TopicStats { name: string; questions: number; mistakes: number; }
```

**DashboardOverviewDTO:**
```typescript
interface DashboardOverviewDTO {
  studentId: string;
  quickStats: {
    totalSolvedQuestions: number; completedTasks: number;
    pendingTasks: number; latestNet?: number;
  };
  recentExams: ExamSummaryDTO[];
}
```

---

## 6. Ders Kodları ve TYT/AYT Template

Seed edilen resmi ders kodları (ExamDTO'da `lessonCode` olarak kullanılır):

| Code | Name |
|------|------|
| 10 | TÜRKÇE |
| 11 | MATEMATİK |
| 12 | GEOMETRİ |
| 13 | FİZİK |
| 14 | KİMYA |
| 15 | BİYOLOJİ |
| 16 | TARİH |
| 17 | COĞRAFYA |
| 18 | FELSEFE |
| 19 | DİN KÜLTÜRÜ |

### TYT Template (4 bölüm zorunlu — 120 soru)

| Bölüm | Lesson Codes | Soru Sayıları |
|-------|-------------|--------------|
| Türkçe | 10 (TÜRKÇE) | 40 |
| Sosyal Bilimler | 16 (TARİH), 17 (COĞRAFYA), 18 (FELSEFE), 19 (DİN KÜLTÜRÜ) | 5+5+5+5=20 |
| Temel Matematik | 11 (MATEMATİK) | 40 |
| Fen Bilimleri | 13 (FİZİK), 14 (KİMYA), 15 (BİYOLOJİ) | 7+7+6=20 |

### AYT Template (4 bölüm zorunlu — 160 soru)

| Bölüm | Lesson Codes | Soru Sayıları |
|-------|-------------|--------------|
| Türk Dili ve Edebiyatı – Sosyal Bilimler-1 | 10 (TÜRKÇE), 16 (TARİH), 17 (COĞRAFYA) | 24+10+6=40 |
| Sosyal Bilimler-2 | 16 (TARİH), 17 (COĞRAFYA), 18 (FELSEFE), 19 (DİN KÜLTÜRÜ) | 11+11+12+6=40 |
| Matematik | 11 (MATEMATİK), 12 (GEOMETRİ) | 30+10=40 |
| Fen Bilimleri | 13 (FİZİK), 14 (KİMYA), 15 (BİYOLOJİ) | 14+13+13=40 |

**Önemli:** Section `name` alanı birebir yukarıdaki gibi olmalı (örn. `"Türkçe"`, `"Sosyal Bilimler"`, `"Türk Dili ve Edebiyatı – Sosyal Bilimler-1"` — tire ve boşluklar dahil). Doğru/yanlış/boş toplamı belirtilen soru sayılarına eşit olmalı. Her ders için correct+wrong+blank = lesson soru sayısı.

---

## 7. Hata Kodları Kataloğu

### Lessons Hataları

| Code | HTTP | Açıklama |
|------|------|----------|
| `ERR_INVALID_LESSON_ID` | 400 | Geçersiz lesson ID |
| `ERR_INVALID_UNIT_ID` | 400 | Geçersiz unit ID |
| `ERR_INVALID_TOPIC_ID` | 400 | Geçersiz topic ID |
| `ERR_VALIDATION_ERROR` | 400 | Validasyon hatası |
| `ERR_EMPTY_NAME` | 400 | İsim boş olamaz |
| `ERR_INVALID_ORDER_INDEX` | 400 | Sıra negatif olamaz |
| `ERR_INVALID_EXAM_TYPES` | 400 | En az bir exam type seçilmeli |
| `ERR_DUPLICATE_EXAM_TYPE` | 400 | Yinelenen exam type |
| `ERR_LESSON_NOT_FOUND` | 404 | Ders bulunamadı |
| `ERR_UNIT_NOT_FOUND` | 404 | Ünite bulunamadı |
| `ERR_TOPIC_NOT_FOUND` | 404 | Konu bulunamadı |
| `ERR_LESSON_ALREADY_EXISTS` | 409 | Bu isimde ders zaten var |
| `ERR_LESSON_CODE_ALREADY_EXISTS` | 409 | Bu code'da ders zaten var |
| `ERR_UNIT_ALREADY_EXISTS` | 409 | Bu isimde ünite zaten var |
| `ERR_TOPIC_ALREADY_EXISTS` | 409 | Bu isimde konu zaten var |
| `ERR_DATABASE_ERROR` | 500 | Veritabanı hatası |
| `ERR_UNEXPECTED_ERROR` | 500 | Beklenmeyen hata |

### Exams Hataları

| Code | HTTP | Açıklama |
|------|------|----------|
| `ERR_INVALID_EXAM_CODE` | 400 | Geçersiz sınav tipi. Sadece TYT veya AYT seçebilirsiniz. |
| `ERR_INVALID_EXAM_ID` | 400 | Geçersiz exam ID |
| `ERR_INVALID_STUDENT_ID` | 400 | Geçersiz student ID |
| `ERR_MISSING_SECTIONS` | 400 | Eksik bölüm(ler): {sections} |
| `ERR_SECTION_INVALID` | 400 | '{name}' bölümü bu sınav tipi için tanımlı değil |
| `ERR_SECTION_TOTAL_MISMATCH` | 400 | Bölüm toplam soru sayısı eşleşmiyor |
| `ERR_LESSON_NOT_FOUND` | 404 | Ders kodu {code} bulunamadı |
| `ERR_LESSON_EXAM_MISMATCH` | 400 | Ders bu sınav tipi için geçerli değil |
| `ERR_LESSON_NOT_IN_SECTION` | 400 | Ders bu bölümde yer almamalı |
| `ERR_LESSON_COUNT_MISMATCH` | 400 | Ders soru sayısı şablona uymuyor |
| `ERR_TOPIC_NOT_IN_LESSON` | 400 | Konu bu derse ait değil |
| `ERR_TOPIC_LESSON_MISMATCH` | 400 | Konu yanlış/boş toplamı dersle uyuşmuyor |
| `ERR_LESSON_SECTION_MISMATCH` | 400 | Ders toplamı bölümle uyuşmuyor |
| `ERR_EXAM_NOT_FOUND` | 404 | Sınav bulunamadı |
| `ERR_UNEXPECTED_ERROR` | 500 | Beklenmeyen hata |

### Tasks Hataları

| Code | HTTP | Açıklama |
|------|------|----------|
| `ERR_INVALID_ID` | 400 | Geçersiz ID |
| `ERR_VALIDATION_FAILED` | 400 | Validasyon hatası |
| `ERR_INVALID_TARGET_HOURS` | 400 | Hedef saat sıfırdan büyük olmalı |
| `ERR_INVALID_TARGET_QUESTIONS` | 400 | Hedef soru >= 0 olmalı |
| `ERR_INVALID_STUDY_HOURS` | 400 | Çalışma süresi sıfırdan büyük olmalı |
| `ERR_INVALID_QUESTION_COUNTS` | 400 | Soru sayıları negatif olamaz |
| `ERR_EMPTY_TITLE` | 400 | Başlık boş olamaz |
| `ERR_INVALID_DATE_RANGE` | 400 | Tarih aralığı 90 günü geçemez |
| `ERR_TASK_NOT_FOUND` | 404 | Görev bulunamadı |
| `ERR_TASK_ALREADY_COMPLETED` | 409 | Görev zaten tamamlanmış |

### Analytics Hataları

| Code | HTTP | Açıklama |
|------|------|----------|
| `ERR_INVALID_STUDENT_ID` | 400 | Geçersiz student ID |
| `ERR_INVALID_DATE_RANGE` | 400 | Geçersiz tarih aralığı |
| `ERR_UNEXPECTED_ERROR` | 500 | Beklenmeyen hata |

---

## 8. Swagger

**URL:** `http://localhost:5295/swagger` (sadece Development ortamında aktif)

Swagger UI'da "Authorize" butonu ile JWT token girilebilir.
Format: `Bearer <accessToken>`

---

## 9. Frontend Axios/Fetch Helper (TypeScript örneği)

```typescript
const API_BASE = 'http://localhost:5295/api/v1.0';

const api = {
  token: null as string | null,

  async request(method: string, path: string, body?: unknown): Promise<any> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = await res.json();

    if (res.status === 401) {
      // Token expired — try refresh
      this.token = null;
      // TODO: call refresh endpoint, retry request
    }

    if (!json.isSuccess) {
      throw new ApiError(json.error.code, json.error.message, res.status);
    }

    return json.data;
  },

  get(path: string) { return this.request('GET', path); },
  post(path: string, body: unknown) { return this.request('POST', path, body); },
  put(path: string, body: unknown) { return this.request('PUT', path, body); },
  delete(path: string, body?: unknown) { return this.request('DELETE', path, body); },

  // Auth
  async login(email: string, password: string): Promise<AuthResponse> {
    const data = await this.post('/auth/login', { email, password });
    this.token = data.accessToken;
    return data;
  },

  // Lessons
  getLessons(examType?: number) { return this.get(`/lessons${examType ? `?examType=${examType}` : ''}`); },
  getLesson(id: string) { return this.get(`/lessons/${id}`); },
  createLesson(body: CreateLessonRequest) { return this.post('/lessons', body); },

  // Exams
  getExams(studentId: string, page = 1) { return this.get(`/exams?studentId=${studentId}&page=${page}`); },
  getExam(id: string, detailed = false) { return this.get(`/exams/${id}?detailed=${detailed}`); },
  createExam(body: CreateExamRequest) { return this.post('/exams', body); },

  // Tasks
  getTodayTasks(studentId: string) { return this.get(`/study-tasks/today/${studentId}`); },
  logStudy(body: LogTaskStudyRequest) { return this.post('/study-tasks/log-study', body); },

  // Dashboard
  getDashboard(studentId: string) { return this.get(`/analytics/dashboard?studentId=${studentId}`); },
};

class ApiError extends Error {
  constructor(public code: string, message: string, public status: number) {
    super(message);
  }
}
```

---

## 10. Önemli Notlar

1. **Teacher register route'u yanlış yazılmış:** `POST /auth/teachter` — sondaki "teachter" yazımı backend kaynak kodunda böyle. Frontend'te bu URL'yi aynen kullan.

2. **DELETE endpoint'leri body alır:** Task DELETE `/study-tasks` endpoint'i route parametresi yerine body'de `{ taskId: "..." }` bekler. Normalden farklı bir pattern.

3. **Guid formatı:** Route parametreleri Guid tipindedir (`XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX` formatı). Exam ID'leri ise string'dir.

4. **DateOnly formatı:** Query parametrelerinde tarih `yyyy-MM-dd` formatında gönderilmelidir (örn: `?startDate=2026-08-01`).

5. **Net hesaplaması:** Net = Doğru - Yanlış × 0.25. Backend otomatik hesaplar, frontend'in göndermesine gerek yok.

6. **TopicResults isteğe bağlıdır:** ExamLessonRequest'te `topicResults` boş dizi olabilir. Sadece yanlış/boşlar için konu bazında breakdown istenirse doldurulur.

7. **ExamSection name birebir template'le eşleşmeli:** Bölüm adları (örn. "Türkçe", "Sosyal Bilimler", "Matematik") tam olarak template'teki gibi olmalıdır.
