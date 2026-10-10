# Modül — Teacher (Öğretmen / Öğrenci İlişkisi)

> **Amaç:** Öğretmenin öğrenci listesini istatistiklerle görüntülemesi, öğrenci eklemesi ve
> kaldırması. Öğretmen panelinin tüm öğrenci-bazlı sayfaları bu liste üzerine kurulur.

**Sorumlu dosyalar**
- `src/modules/teacher/services/teacher.service.ts`
- `src/modules/teacher/hooks/useTeacher.ts`
- `src/modules/teacher/types/teacher.types.ts`
- `src/lib/student-context.tsx` (`StudentProvider` / `useStudentContext`)
- UI: `src/app/teacher/page.tsx`, `src/app/teacher/students/*`, `src/components/teacher/*`

---

## Endpoint'ler

| # | Method | Path | Body | Response `data` | Service |
|---|--------|------|------|-----------------|---------|
| 1 | GET | `/teachers/{teacherId}/students` | — | `TeacherStudentDTO[]` | `listByTeacher` |
| 2 | POST | `/teachers/{teacherId}/students` | `{ studentId }` | `{ message }` (201) | `addStudent` |
| 3 | DELETE | `/teachers/{teacherId}/students/{studentId}` | — | success | `removeStudent` |

> #2 için doğru rota `/teachers/{teacherId}/students` (eski `/students?teacherId=` değil).

---

## Hook'lar

| Hook | Açıklama |
|------|----------|
| `useTeacherStudents(teacherId)` | `qk.teacherStudents(teacherId)`; `TeacherStudentDTO[]` → `TeacherStudent[]` |
| `useAddStudent(teacherId)` | `addStudent`; başarıda öğrenci listesini invalidate eder |
| `useRemoveStudent(teacherId)` | `removeStudent`; başarıda listeyi invalidate eder |

---

## DTO / UI

`TeacherStudentDTO`:
```ts
{
  id, name, email, avatar?,
  weeklyProgress,   // %0-100 (son 7 gün)
  totalTasks, completedTasks, totalHours,
  lastActive        // yyyy-MM-dd
}
```
Hook bunu `TeacherStudent` (`User` + istatistikler, `role: "student"`) modeline çevirir.

---

## Akış / Notlar

- `StudentProvider` (`/teacher/layout.tsx`) oturumdaki öğretmenin (`user.id`) öğrenci listesini
  `useTeacherStudents` ile çeker; seçili öğrenci + liste + `isLoading/isError/refetch` sağlar.
- **Stabilite (2026-10-10):** `studentsWithStats` `useMemo` ile (yalnız `teacherStudents` değişince)
  üretilir; context değeri de `useMemo`, `setSelectedStudent` `useCallback` ile sabittir. Öğrenci detay
  `layout.tsx` effect'i `selectedStudentRef` + `selectedStudent?.id !== student.id` guard'ı ile yalnız
  gerçekten değişince yazar; bağımlılık dizisi sabit boyutta tutulur — aksi halde sonsuz render döngüsü
  / "useEffect deps changed size" oluşuyordu.
- **Prefetch (2026-10-10):** Öğrenci kartındaki "Detaylari Gor" artık `next/link` (`prefetch`) ile
  çalışır (önceki `router.push` rota prefetch'i yapmıyordu); `onClick` seçili öğrenciyi
  senkron ayarlar.
- **Çıkış (2026-10-10):** "Çıkış Yap" yan navigation drawer'da (masaüstü sidebar + mobil `Sheet`)
  `AccountSection` içinde doğrudan gösterilir; masaüstü alt dropdown kaldırıldı.
- `/teacher` dashboard'u bu veriden toplam/ortalama istatistikler, "dikkat gerektiren" (<%50)
  ve "en iyi" (≥%80) öğrenciler ile tüm-öğrenci net trend karşılaştırmasını gösterir.
- `/teacher/students` sayfası `StudentList` ile öğrenci ekle (dialog + `studentId`) ve kaldır
  (AlertDialog) işlemlerini yapar.
- Öğrenci detay sayfaları: `daily`, `weekly`, `monthly`, `exams`, `analytics` —
  ilgili modüllerin hook'larını `studentId` ile tüketir.
- Hata kodları: `ERR_INVALID_TEACHER_ID`, `ERR_INVALID_STUDENT_ID`, `ERR_TEACHER_NOT_FOUND`,
  `ERR_STUDENT_NOT_FOUND`, `ERR_STUDENT_ALREADY_ENROLLED`, `ERR_ENROLLMENT_NOT_FOUND`.
