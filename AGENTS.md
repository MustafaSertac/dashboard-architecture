# AGENTS.md

> **Her AI/agent bu repoda çalışmaya başlamadan ÖNCE `docs/memory-bank/07-rules.md` dosyasını
> okur ve KESİNLİKLE uygular.** Kurallar → `docs/memory-bank/07-rules.md`.

## Giriş noktası

1. `docs/memory-bank/07-rules.md` — çalışma kuralları ve zorunlu akış (İLK OKUNUR).
2. `docs/memory-bank/01-proje-ozeti.md` — proje özeti, stack, komutlar.
3. `docs/memory-bank/02-architecture.md` — mimari (API client, auth, rol, veri akışı).
4. İlgili modül doc'u: `docs/memory-bank/modules/{auth,profile,analytics,exams,lessons,notes,study-tasks,teacher,organizations}.md`.

## Özet kural

- Her işte: **ilgili testleri koş → build/typecheck al → md dosyalarını güncelle**.
- Eksikler `05-backend-talepleri.md` (backend) / `06-yapilacaklar.md` (frontend) dosyalarına yazılır.
- Tamamlananlar `05`/`06`'dan **silinir** ve modül md + `TEST_SENARYOLARI.md` + `04-last-work.md`
  (+ gerekiyorsa `01/02/03`) dosyalarına **aktarılır**.
- Tam API sözleşmesi: `docs/BackendTalep.md`. Mock/fallback eklenmez.

## Komutlar

```powershell
npx vitest run <test>   # ilgili test
npm run test:run        # tüm testler
npx tsc --noEmit        # typecheck
npm run build           # production build
npm run dev             # http://localhost:3000 (backend: http://localhost:5295)
```
