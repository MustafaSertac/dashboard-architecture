# 07 — Çalışma Kuralları (HER OTURUMDA İLK OKUNUR)

> **Bu dosya her çalışma oturumunun BAŞINDA okunur ve KESİNLİKLE uygulanır.**
> Bir işe başlamadan önce bu dosya, sonra ilgili modül dosyası ve `src/app/FRONTEND_INTEGRATION.md`
> okunur. Kural ile çelişen bir istek gelirse önce kural uygulanır, sonra kullanıcı bilgilendirilir.

---

## Doküman haritası

| Dosya | Görev | Ne zaman güncellenir |
|-------|-------|----------------------|
| `01-proje-ozeti.md` | Kısa proje özeti, stack, çalıştırma | Yapı/stack/komut değişince |
| `02-architecture.md` | Mimari, API client, auth, rol, veri akışı | Davranış/mimari değişince |
| `03-module-endpoints.md` | Modül & endpoint kataloğu (özet) | Endpoint/alan değişince |
| `04-last-work.md` | Tarihli changelog (geçmiş) | Her tamamlanan iş sonrası |
| `05-backend-talepleri.md` | **Yalnızca AÇIK** backend talepleri | Eksik/talep eklenince; tamamlanınca **silinir** |
| `06-yapilacaklar.md` | **Yalnızca AÇIK** yapılacaklar | İş eklenince; tamamlanınca **silinir** |
| `07-rules.md` | Bu dosya — zorunlu akış | Kural değişince |
| `TEST_SENARYOLARI.md` | Otomatik + manuel E2E senaryoları | Yeni davranış/endpoint testi eklenince |
| `modules/{modül}.md` (auth, exams, ...) | Modül detayı: endpoint, hook, akış | İlgili modül değişince |
| `src/app/FRONTEND_INTEGRATION.md` | **Tek API sözleşme kaynağı** (endpoint/DTO/hata kodları) | Sözleşme/talep değişince |
| `../AGENTS.md` (repo kökü) | Agent giriş noktası → bu dosyaya yönlendirir | Giriş yönlendirmesi değişince |

---

## Zorunlu iş akışı (Definition of Done)

Bir iş **bitmiş sayılmaz**; aşağıdaki adımların tamamı yapılmadan:

1. **Planla & oku:** İlgili modül dosyasını + `src/app/FRONTEND_INTEGRATION.md`'yi oku. Belirsizlik varsa sor.
2. **Kodla:** Değişikliği uygula; mevcut desenlere (module → service/hook/mapper/types) uy.
3. **İlgili testleri koş:** dokunulan modülün testleri.
   - Tek dosya: `npx vitest run <test-dosyası>`
   - Tümü: `npm run test:run`
4. **Build/typecheck al:**
   - Hızlı: `npx tsc --noEmit`
   - Tam: `npm run build`
5. **MD dosyalarını güncelle** (aşağıya bak: nereye ne yazılır).
6. **Eksikleri yaz:** Yapılamayan/backend gerektiren her şey →
   - backend gerekiyorsa `05-backend-talepleri.md` (+ gerekirse `src/app/FRONTEND_INTEGRATION.md`),
   - frontend işiyse `06-yapilacaklar.md`.
7. **Yapılanı talepten kaldır:** `05` ve `06`'dan ilgili madde **silinir**.
8. **Aktar:** Yapılan iş ilgili yerlere dağıtılır:
   - ilgili modül `{modül}.md`
   - `TEST_SENARYOLARI.md` (yeni senaryo, gerekiyorsa)
   - `04-last-work.md` (tarihli giriş)
   - davranış değiştiyse `02-architecture.md`
   - endpoint/alan değiştiyse `03-module-endpoints.md`
   - proje düzeyi değişiklik varsa `01-proje-ozeti.md`
9. **Özetle:** Kullanıcıya ne yapıldı, test/build sonucu, açık kalanlar kısaca bildirilir.

---

## Kurallar (R1–R10)

- **R1 — Rules önce:** Her oturumda ilk bu dosya okunur ve uygulanır.
- **R2 — Test zorunlu:** Kod değişince ilgili testler koşulur; kırılan test bırakılmaz.
- **R3 — Build/typecheck:** `npx tsc --noEmit` temiz olmadan iş bitmiş sayılmaz.
- **R4 — Talep dosyası sadece AÇIK tutar:** Tamamlanan talep `05`'ten derhal silinir.
- **R5 — Yapılacaklar sadece AÇIK tutar:** Tamamlanan görev `06`'dan derhal silinir.
- **R6 — Aktarım:** Silinen/biten iş ilgili modül ve dokümanlara işlenir (R7 listesi).
- **R7 — Kapsam:** 01, 02, 03, 04, 05, 06, `07-rules`, `TEST_SENARYOLARI.md` ve modül md'leri
  değişikliğe göre güncellenir.
- **R8 — Tek sözleşme kaynağı:** Tam API sözleşmesi `docs/BackendTalep.md`; kopyaları
  (`src/app/FRONTEND_INTEGRATION.md`) onunla tutarlı tutulur.
- **R9 — Mock/fallback yok:** Gerçek API kullanılır; mock/simüle geri eklenmez.
- **R10 — Türkçe & tarih formatı:** Dokümanlar Türkçe; tarih `YYYY-MM-DD`, tarih paramları `yyyy-MM-dd`.

---

## Sık kullanılan komutlar

```powershell
npx vitest run <test>      # ilgili test
npm run test:run           # tüm testler
npx tsc --noEmit           # typecheck
npm run dev                # geliştirme (backend: http://localhost:5295)
npm run build              # production build
```
