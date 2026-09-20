# Test Senaryoları

> Frontend entegrasyonunun doğrulanması için otomatik (Vitest) ve manuel (E2E) test senaryoları.
>
> **Otomatik testler:** `npm run test:run` ile çalışır (Vitest + Testing Library, mock'lu — backend gerektirmez).
> **Manuel senaryolar:** Backend canlıyken (`http://localhost:5295`) tarayıcı üzerinden doğrulanır.

---

## 1. Otomatik Testler (Vitest)

### Kapsam

| Katman | Test dosyası | Doğrulanan |
|---|---|---|
| Auth service | `src/modules/auth/services/auth.service.test.ts` | login, registerStudent, **registerTeacher (`/auth/teacher`)**, refreshToken, logout, getProfile, updateProfile, forgot-password 3-adım |
| Teacher service | `src/modules/teacher/services/teacher.service.test.ts` | `GET /teachers/{id}/students`, **addStudent**, **removeStudent** |
| Notes service | `src/modules/notes/services/note.service.test.ts` | list/create/delete endpoint + teacherId body'ye konmaz |
| Study-task service | `src/modules/study-tasks/services/study-task.service.test.ts` | today, upcoming(limit), byStudentRange, create, update, delete (body ile), complete, complete/batch, logStudy, focus-session create/get |
| Analytics service | `src/modules/analytics/services/analytics.service.test.ts` | weekly, monthly (?perSubject), yearly (?perSubject), dashboard |
| Exam service | `src/modules/exams/services/exam.service.test.ts` | list, detail(?detailed), trends, trendsAll(?teacherId), create, update, delete |
| Lesson service | `src/modules/lessons/services/lesson.service.test.ts` | list, getById, create, update, delete, getUnits, createUnit, updateUnit, deleteUnit, getTopics, createTopic, updateTopic, deleteTopic |
| API client | `src/lib/api/client.test.ts` | ApiError sınıfı, isApiResponse, unwrapEnvelope (envelope doğrulama) |
| StudyTimerCard | `src/components/dashboard/study-timer-card.test.tsx` | duraklatınca geçen süre `logStudy` ile göreve yazılır; görev yoksa uyarı + disabled |
| TaskModal | `src/components/tasks/task-modal.test.tsx` | gerçek ders/ünite/konu seçimi → create request'te gerçek lessonId/unitId/topicId |
| Study-task mapper | `src/modules/study-tasks/mappers/study-task.mapper.test.ts` | DTO'dan doğrudan `dueDate`/`studentId`/`createdAt` (fallback yok) |
| Exam mapper | `src/modules/exams/mappers/exam.mapper.test.ts` | topicResults `correct`/`questionNumbers` doğrudan DTO'dan |
| Analytics mapper | `src/modules/analytics/mappers/analytics.mapper.test.ts` | `perSubjectStats` doğrudan kullanılır; yoksa boş array |
| NoteModal | `src/components/teacher/note-modal.test.tsx` | boş not hata toast + başarılı kayıt |
| TeacherActions | `src/components/teacher/teacher-actions.test.tsx` | "Toplu Onayla" tamamlanmamış task id'lerini gönderir |

### Çalıştırma

```powershell
npm run test:run       # tek seferlik
npm test               # watch modunda
```

---

## 2. Manuel E2E Senaryoları (Backend canlı)

> Ön koşul: backend `http://localhost:5295` üzerinde çalışıyor, `npm run dev` ile frontend `http://localhost:3000` üzerinde.

### S1 — Öğrenci girişi ve dashboard
1. `/login` aç → `elif@edu.com` / `student123` ile giriş yap
2. `/dashboard` yüklenmeli → loading (skeleton) görünüp veri gelmeli
3. "Bugünün Görevleri", "Son Denemeler", "Deneme Net Grafiği" kartları gerçek API verisiyle dolmalı
4. "Süreölçer" bugünün ilk görevine bağlı çalışmalı (görev yoksa disabled)

### S2 — Görev oluşturma ve tamamlama
1. `/dashboard/tasks` → "Görev Ekle" (öğretmen/admin) → form doldur → "Ekle"
2. Yeni görev listeye gerçek API'den düşmeli
3. Checkbox ile "Onayla" → task `complete` endpoint'i çağırmalı

### S3 — Deneme sonucu ekleme
1. `/dashboard/exams` → "Sonuç Ekle" → TYT formunu doldur → "Kaydet"
2. `POST /exams` çağrılmalı, sonuç tabloya yansımalı

### S4 — Öğretmen paneli
1. `/login` → `ahmet@edu.com` / `teacher123` ile giriş yap
2. `/teacher` → öğrenci listesi **gerçek** `GET /teachers/{id}/students` endpoint'inden gelmeli (mock değil)
3. "Öğrenci Net Trend Karşılaştırması" kartı tüm öğrencilerin trendini göstermeli

### S5 — Not ekleme
1. `/teacher/students/{id}/daily` → "Not Ekle" → kategori + not yaz → "Kaydet"
2. `POST /students/{id}/notes` çağrılmalı (artık simüle değil)

### S6 — Toplu onay
1. `/teacher/students/{id}/daily` → "Toplu Onayla"
2. `POST /study-tasks/complete/batch` çağrılmalı, toast'ta onaylanan sayı gösterilmeli

### S7 — Şifre sıfırlama (email akışı)
1. `/forgot-password` → email gir → "Sıfırlama Bağlantısı Gönder"
2. `POST /auth/forgot-password/request` → "gönderildi" ekranı
3. Email'deki `/reset-password?token=...` linkini aç
4. Token doğrulanmalı (`verify`) → yeni şifre gir → `reset`
5. Yeni şifre ile `/login` başarılı olmalı

### S8 — Hata gösterimi (404/400)
1. Geçersiz bir studentId ile bir sayfaya gir (örn. URL'de `students/999` detay sayfası)
2. Backend'den dönen hata (404/400) `ErrorState` bileşeninde kod + mesaj olarak gösterilmeli

### S9 — Ders bazlı analiz
1. `/dashboard/analytics` → "Aylık Analiz" → ders bazlı kırılım gerçek `perSubjectStats` verisiyle dolmalı
2. `?perSubject=true` query param'ının gittiğini network sekmesinden doğrula

### S10 — Çalışma sayacı (focus session)
1. `/dashboard` → bugünün görevine bağlı "Süreölçer" çalıştır → sıfırla
2. `POST /study-tasks/{taskId}/focus-session` çağrılmalı (localStorage artık kullanılmıyor)

### S11 — Öğretmen kaydı (yeni rota)
1. `/register` aç → "Öğretmen" seç → form doldur → "Kayıt Ol"
2. `POST /auth/teacher` çağrılmalı (eski `/auth/teachter` değil)
3. Başarılıysa `/dashboard` → öğretmen paneli görünmeli

### S12 — Token refresh (15 dk oturum)
1. `/dashboard` açık iken 15+ dk bekle (veya token'ı manuel geçersiz kıl)
2. Bir API çağrısı yapıldığında 401 dönmeli → interceptor otomatik `POST /auth/refresh-token` çağırmalı
3. Yeni token ile istek tekrarlanmalı; oturum düşmemeli
4. Refresh token da geçersizse → `/login`'e yönlendirme

### S13 — Not silme
1. `/teacher/students/{id}/daily` → bir notun "Sil" butonuna tıkla
2. `DELETE /students/{studentId}/notes/{noteId}` çağrılmalı
3. Not listeden kaybolmalı

### S14 — Yıllık ders bazlı analiz
1. `/dashboard/analytics` → "Yıllık Analiz" sekmesi
2. Network sekmesinde `GET /analytics/yearly?studentId=X&year=2026&perSubject=true` görünmeli
3. Response'ta `perSubjectStats` array'i olmalı; UI'da ders bazlı kırılım olarak render edilmeli

### S15 — Toplu onay kısmi başarısızlık
1. `/teacher/students/{id}/daily` → 3 görev var, birini önce "Onayla" ile tamamla
2. "Toplu Onayla" → kalan 2 görev için `POST /study-tasks/complete/batch` çağrılmalı
3. Backend zaten tamamlanmış görevi `failedIds`'e düşürmeli; toast'ta "2 onaylandı, 1 başarısız" görünmeli

### S16 — Focus session kalıcılığı
1. `/dashboard` → "Süreölçer" ile 25 dk çalış → sıfırla (kaydet)
2. Sayfayı yenile → "Tamamlanan" kartında 25 dk görünmeli (backend'den geliyor)
3. `GET /study-tasks/{taskId}/focus-sessions?date=today` çağrılmalı

### S17 — Gerçek ders/konu ile görev oluşturma
1. `/teacher/students/{id}/daily` → "Görev Ata"
2. Ders dropdown'ı backend'den `GET /lessons` ile gelmeli (sabit liste değil)
3. Ders seç → Ünite dropdown'ı `GET /lessons/{id}/units` ile gelmeli
4. Ünite seç → Konu dropdown'ı `GET /units/{id}/topics` ile gelmeli
5. Network sekmesinde `POST /study-tasks` body'sinde gerçek `lessonId`/`unitId`/`topicId` olmalı

### S18 — Öğrenci ekle/kaldır
1. `/teacher/students` → "Ekle" butonu → studentId gir → "Ekle"
2. `POST /teachers/{teacherId}/students` çağrılmalı
3. Yeni öğrenci listeye düşmeli
4. Öğrenci kartındaki "Kaldır" butonuna tıkla → onay → `DELETE /teachers/{teacherId}/students/{studentId}`

### S19 — Profil güncelleme
1. `/dashboard/profile` → form yüklü (mevcut bilgiler)
2. Ad/telefon değiştir → "Kaydet"
3. `PUT /auth/profiles` çağrılmalı
4. Toast başarılı; sayfa yenilendiğinde güncel bilgiler görünmeli

### S20 — Deneme silme
1. `/dashboard/exams` → bir sınavın çöp kutusu ikonuna tıkla
2. "Sinavi Sil" onay dialogu → "Sil"
3. `DELETE /exams/{id}` çağrılmalı
4. Sınav listeden kaybolmalı

---

## 3. Bilinen Kapsam Dışı / Notlar

- **Lessons/Units/Topics admin CRUD UI** yok — service/hook hazır, TaskModal'a bağlı; ders/ünite/konu yönetimi için ayrı sayfa yok
- **StudyTimerCard** dashboard'da bugünün görevlerine bağlı; seçili görev gösterilir, birden fazla görevde dropdown ile seçim yapılır, görev yoksa uyarı + "Görev Oluştur" butonu çıkar
- **ExamTrendsChart** "all students" modu teacher dashboard'da gösteriliyor; tek öğrenci modu `studentId` prop'u ile
- **Register sayfası** sadece Öğrenci/Öğretmen seçeneği sunar; Admin kaydı UI'dan yapılamaz (backend seed gerekir)
- `npm run lint` çalışmıyor — `eslint` projede kurulu değil (`devDependencies`'e eklenebilir)
