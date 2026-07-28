# L3 — Doménová wiki (Karpathy LLM Wiki pattern)

Znalostní báze tvého byznysu/domény, kterou Claude čte a udržuje. Vzor: [Karpathyho LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — wiki není psaná pro lidi, ale **pro LLM jako pracovní paměť domény**: kompilovaný pohled na fakta, která žijí roztroušená v nástrojích (fakturace, e-mail marketing, web…).

## Proč to funguje

- **index.md** se čte první — Claude nemusí skenovat celou wiki, jen katalog.
- **log.md** = chronologie změn — auditní stopa, co se kdy zjistilo/změnilo.
- **raw/** = nezměnitelné zdroje (exporty, PDF) — wiki stránky jsou destilace, zdroj se dá vždy ověřit.
- Frontmatter se `sources:` — každé tvrzení má dohledatelný původ.

## Instalace

1. Zkopíruj obsah `template/` tam, kde chceš wiki mít (např. `~/business-wiki/`).
2. V `WIKI.md` vyplň scope (co do wiki patří a co NE — např. „byznys ano, jednotliví klienti ne").
3. Vlož blok „L3 — Doménová wiki" z [`../claude-md-snippets.md`](../claude-md-snippets.md) do `~/.claude/CLAUDE.md` — tím Claude začne wiki automaticky číst u doménových dotazů a nabízet updaty.
4. Naplňování: posílej Claudovi zdroje („ingest tenhle export prodejů") — postup ingest/query/lint je ve `WIKI.md`.

## Vztah k ostatním vrstvám

Wiki je **zdroj pravdy o doméně**. Auto-memory (L1) na ni jen odkazuje; sémantický index (L4) ji dělá prohledatelnou po významu.
