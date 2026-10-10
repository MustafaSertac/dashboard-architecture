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
| Auth service | `src/modules/auth/services/auth.service.test.ts` | login, registerStudent (**`code` gönderilir**), **registerTeacher (`/auth/teacher`)**, refreshToken, logout, getProfile, updateProfile, forgot-password 3-adım |
| Teacher service | `src/modules/teacher/services/teacher.service.test.ts` | `GET /teachers/{id}/students`, **addStudent**, **removeStudent** |
| Organization service | `src/modules/organizations/services/organization.service.test.ts` | create, join, me, visibility(PATCH), teachers, codes, teacher-codes, `/teachers/me/codes`, validate |
| Notes service | `src/modules/notes/services/note.service.test.ts` | list/create/delete endpoint + teacherId body'ye konmaz |
| Study-task service | `src/modules/study-tasks/services/study-task.service.test.ts` | today, upcoming(limit), byStudentRange, create, update, delete (body ile), complete, complete/batch, logStudy, focus-session create/get |
| Analytics service | `src/modules/analytics/services/analytics.service.test.ts` | weekly, monthly (?perSubject), yearly (?perSubject), dashboard |
| Exam service | `src/modules/exams/services/exam.service.test.ts` | list, detail(?detailed), trends, trendsAll(?teacherId), create, update, delete |
| Lesson service | `src/modules/lessons/services/lesson.service.test.ts` | list, getById, create, update, delete, getUnits, createUnit, updateUnit, deleteUnit, getTopics, createTopic, updateTopic, deleteTopic, **getStudentLessons, setStudentLessons, removeStudentLesson, getStudentOwnLessons** |
| API client | `src/lib/api/client.test.ts` | ApiError sınıfı, isApiResponse, unwrapEnvelope (envelope doğrulama) |
| Utils | `src/lib/utils.test.ts` | `formatFullName` — split + isim/soyad büyük-küçük harf (Türkçe) |
| StudyTimerCard | `src/components/dashboard/study-timer-card.test.tsx` | duraklatınca geçen süre `logStudy`'ye **delta** olarak yazılır (correct/wrong/empty = 0); görev yoksa uyarı + disabled |
| TaskModal | `src/components/tasks/task-modal.test.tsx` | gerçek ders/ünite/konu seçimi → create request'te gerçek lessonId/unitId/topicId |
| Study-task mapper | `src/modules/study-tasks/mappers/study-task.mapper.test.ts` | DTO'dan doğrudan `dueDate`/`studentId`/`createdAt`; `studiedMinutes`+`studiedSeconds` → `hoursStudied` (fallback yok) |
| Exam mapper | `src/modules/exams/mappers/exam.mapper.test.ts` | topicResults `correct`/`questionNumbers` doğrudan DTO'dan |
| Analytics mapper | `src/modules/analytics/mappers/analytics.mapper.test.ts` | `perSubjectStats` doğrudan kullanılır; yoksa boş array |
| NoteModal | `src/components/teacher/note-modal.test.tsx` | boş not hata toast + başarılı kayıt |
| TeacherActions | `src/components/teacher/teacher-actions.test.tsx` | "Toplu Onayla" haftanın tamamlanmamış task id'lerini gönderir |
| StudentLessonsView | `src/components/teacher/student-lessons-view.test.tsx` | "Kaydet" seçili ders id'lerini (replace-all) gönderir; yeni seçim listeye eklenir |

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
4. Tekrar checkbox'a tıkla ("Iptal Et") → `PUT /study-tasks/update` body'sinde `isCompleted: false`
   gitmeli ve görev tekrar açılmalı

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

### S6 — Toplu onay (görüntülenen kapsam)
1. `/teacher/students/{id}/daily` → "Toplu Onayla"
2. Günlük görünümde **seçili günün** tamamlanmamış görevleri toplanmalı;
   `POST /study-tasks/complete/batch` çağrılmalı, toast'ta onaylanan sayı gösterilmeli
3. Günlük görünümde başka bir güne gezinip "Toplu Onayla" → o günün görevleri onaylanmalı
4. Haftalık görünümde `Önceki/Sonraki Hafta` ile gezinince onaylanan set görüntülenen haftaya (Pzt–Paz) göre değişmeli
5. Aylık görünümde (`/monthly`) "Toplu Onayla" → görüntülenen **ayın tamamındaki** tamamlanmamış
   görevler onaylanmalı; ay gezinmesi onaylanan seti değiştirmeli
6. Onay sonrası görünüm **dinamik** güncellenmeli (görevler "Tamamlandı", manuel yenileme gerekmez)

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
1. `/register` aç → "Öğretmen" seç → form doldur → KVKK onayını işaretle → "Kayıt Ol"
2. `POST /auth/teacher` çağrılmalı (eski `/auth/teachter` değil); body'de `isKvkVerified: true`, `code` **yok**
3. Başarılıysa `/teacher` → öğretmen paneli görünmeli

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

### S21 — Öğrenci kaydı: davet kodu + KVKK
1. `/register` → "Öğrenci" seç → "Davet Kodu" input'u görünmeli; boş bırak → "Davet kodu gerekli"
2. 8 karaktere tamamlanınca `POST /organizations/codes/validate` çağrılmalı; geçerliyse "Kod geçerli"
3. Geçersiz/kullanılmış kod → "Kod geçersiz, kullanılmış veya süresi dolmuş" (kayıt engellenir)
4. KVKK metni görünür; checkbox işaretlenmeden "Kayıt Ol" → "KVKK Aydinlatma Metni'ni kabul etmelisiniz"
5. Geçerli `code` + KVKK onayı ile `POST /auth/student` body'sinde `code` ve `isKvkVerified: true` olmalı

### S22 — Login rol yönlendirmesi (rol değiştirme kapalı)
1. `ahmet@edu.com` / `teacher123` ile giriş → `/teacher`'a yönlenmeli (öğrenci dashboard'una değil)
2. `elif@edu.com` / `student123` ile giriş → `/dashboard`'a yönlenmeli
3. Sidebar/header'da "Rol Değiştir" menüsü **olmamalı**

### S23 — Deneme analiz durumu toggle
1. `/dashboard/exams` → bir sonuç satırında "Tamam/Bekliyor" switch'ini değiştir
2. `PUT /exams/{id}` body'sinde `examId`, `examDate`, `examName`, `status` birlikte gitmeli
3. HTTP 400 (ValidationProblemDetails) **dönmemeli**; switch durumu güncellenmeli

### S24 — Organizasyon oluştur / katıl + görünürlük
1. `/teacher/organization` → org yoksa "Organizasyon Oluştur" → ad gir → oluştur
2. Org başlığı + "Tüm öğrencileri gör" Switch görünmeli; Switch kapat → `PATCH /organizations/me/visibility`
3. Yenile → tercih korunmalı; org öğretmenleri listesi `GET /organizations/{id}/teachers` ile gelmeli
4. Bir öğretmen koduyla `POST /organizations/join` → üyelik oluşmalı

### S25 — Öğrenci kodu üret ve kodla kayıt
1. `/teacher/students` → "Ogrenci Kodu Uret" → dialog'da 8 haneli kod + son geçerlilik + kopyala
2. `POST /teachers/me/codes` çağrılmalı
3. Öğrenci bu kodla `/register` (Öğrenci) üzerinden kayıt olmalı → `POST /auth/student`
4. Org üyesi öğretmende kod `/organizations/{id}/codes` ile de üretilebilmeli

### S26 — Öğretmen kaydı: organizasyon kodu (opsiyonel)
1. `/register` → "Öğretmen" seç → "Organizasyon Kodu (Opsiyonel)" input'u görünmeli
2. Geçerli TeacherJoin kodu girilirse canlı doğrulanmalı ("Kod geçerli")
3. `POST /auth/teacher` body'sinde `organizationCode` olmalı; kodsuz kayıt da başarılı olmalı

### S27 — Öğrenci detay sayfası: sonsuz render döngüsü yok
1. Öğretmen olarak giriş → `/teacher/students` listesinden bir öğrenciye tıkla
2. `/teacher/students/{id}/daily` açılmalı; konsolda **"Maximum update depth exceeded" olmamalı**
3. Sayfa içinde gezin (`weekly`, `monthly`, `exams`, `analytics`) → her geçişte tek seferlik render,
   döngü/sürekli yeniden render olmamalı
4. "Görev Ata" ile TaskModal açılıp kapanabilmeli (dialog portalinde hata olmamalı)

### S28 — Kayıt: ad-soyad normalizasyonu
1. `/register` → "Ad Soyad" alanına `ali veli can` yaz → alandan çık (blur)
2. Alan `Ali Veli CAN` olarak biçimlenmeli (isimler baş harf büyük, soyad tamamen büyük)
3. `ali` yaz → `Ali`; `ayşe nur demir` → `Ayşe Nur DEMİR` (Türkçe karakterler)
4. Kayıt gönderildiğinde `POST /auth/student|teacher` body'sinde `name` biçimlenmiş haliyle gitmeli

### S29 — Çalışma kaydı toplama (delta), tamamlanmış görev ve geri açma
1. Bir görevde süreölçerle çalışıp duraklat → `POST /study-tasks/log-study` body'sinde `hours`
   **yalnızca geçen süre (delta)**, `correctCount/wrongCount/emptyCount=0` olmalı
2. Aynı göreve ikinci kez kayıt → süre/soru sayıları önceki değere **eklenmeli** (sıfırlanmamalı)
3. Günlük görünümde görevi "Onayla" ile tamamla → o görevin "Güncelle" butonu **devre dışı** olmalı
4. Tamamlanmış göreve `log-study` → backend **409** (`TaskAlreadyCompleted`); UI engelliyor
5. Tamamlanmış görevin checkbox'ı ("Iptal Et") → `PUT /study-tasks/update` `isCompleted:false` ile
   görev tekrar açılmalı
6. `targetHours` response'ta en fazla 2 ondalık dönmeli

### S30 — Öğretmen → öğrenci ders atama
1. Öğretmen olarak `/teacher/students/{id}/lessons` (sidebar "Dersler") → tüm aktif dersler
   checkbox'lı listelenmeli; mevcut atamalar işaretli gelmeli
2. Birkaç ders seç → "Kaydet" → `PUT /teachers/{teacherId}/students/{studentId}/lessons`
   body'sinde `lessonIds` (seçili id'ler) gitmeli; toast başarılı
3. "Tümünü Seç" + "Temizle" çalışmalı; boş liste ile kaydet tüm atamaları temizlemeli
4. Öğrenci olarak `/dashboard` → "Derslerim" kartında atanmış dersler görünmeli
5. `GET /students/{studentId}/lessons` öğrencinin tüm öğretmenlerinin atadığı derslerin birleşimini dönmeli

### S31 — Performans: lazy grafik + gereksiz istek yok
1. `/dashboard` açılırken grafik kartları (`Haftalık İlerleme`, `Deneme Net Grafiği`) önce kart
   iskeletiyle görünmeli, ardından grafik yüklenmeli (Recharts `next/dynamic` ile geç yüklenir).
2. `/dashboard/exams` → TYT/AYT sekmesi değiştirilirken önceki grafik korunmalı (skeleton flaşı yok;
   `keepPreviousData`).
3. Öğretmen `/teacher/students/{id}/exams` → **tek öğrenci** modunda ağ sekmesinde yalnızca
   `GET /exams/trends?studentId=...` görünmeli; `GET /exams/trends/all` **istenmemeli**
   (ve `studentId=__none__` gibi sentinel istek olmamalı).
4. `/teacher` (tüm öğrenciler) modunda yalnızca `GET /exams/trends/all?...` istenmeli.
5. Öğrenci listesinde bir karta hover → ağ sekmesinde `/teacher/students/{id}/daily` rota paketi
   önden yüklenmeli (Next.js `Link prefetch`).

---

## 3. Bilinen Kapsam Dışı / Notlar

- **Lessons/Units/Topics admin CRUD UI** yok — service/hook hazır, TaskModal'a bağlı; ders/ünite/konu
  yönetimi için ayrı sayfa yok. (Öğretmen→öğrenci **ders atama** UI'ı vardır: S30.)
- **StudyTimerCard** dashboard'da bugünün görevlerine bağlı; seçili görev gösterilir, birden fazla görevde dropdown ile seçim yapılır, görev yoksa uyarı + "Görev Oluştur" butonu çıkar
- **ExamTrendsChart** "all students" modu teacher dashboard'da gösteriliyor; tek öğrenci modu `studentId` prop'u ile
- **Register sayfası** sadece Öğrenci/Öğretmen seçeneği sunar; Admin kaydı UI'dan yapılamaz (backend seed gerekir). Öğrenci kaydında 6 haneli **davet kodu** ve **KVKK onayı** zorunludur
- **Rol değiştirme yok:** `switchRole` kaldırıldı; kullanıcı yalnızca kendi panelinde kalır, girişte role göre yönlendirilir
- `npm run lint` çalışmıyor — `eslint` projede kurulu değil (`devDependencies`'e eklenebilir)
