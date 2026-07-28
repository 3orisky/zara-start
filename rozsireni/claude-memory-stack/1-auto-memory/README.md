# L1 — Auto-memory

Trvalá souborová paměť: **1 fakt = 1 markdown soubor**, plus index `MEMORY.md`, který se načítá do každého okna. Claude Code tuhle vrstvu podporuje nativně (memory adresář per projekt) — tenhle balíček dodává **konvence, které ji drží použitelnou v měřítku 100+ memories**.

## Kde paměť žije

```
~/.claude/projects/<slug-projektu>/memory/
├── MEMORY.md            ← index, 1 řádek na memory, načítá se každou session
├── user_*.md            ← kdo jsi (role, expertíza, preference)
├── feedback_*.md        ← jak má Claude pracovat (korekce + potvrzené postupy)
├── project_*.md         ← rozdělaná práce, stav, další kroky
├── reference_*.md       ← pointery na externí zdroje (API, servery, URL)
├── skill_*.md           ← evidence instalovaných nástrojů/skillů
└── archive/             ← hotové/zastaralé memories (mimo index, nic se nemaže)
```

## Formát memory souboru

Viz [`_sablona-memory.md`](_sablona-memory.md). Klíčové:
- `description:` ve frontmatter = 1 věta, podle které se rozhoduje relevance
- u `feedback_` vždy **Why:** a **How to apply:** — bez „proč" se pravidlo časem překroutí
- `[[nazev-jine-memory]]` linky mezi souvisejícími memories

## Pravidla, která systém drží při životě

1. **Index je drahý.** Každý řádek MEMORY.md platíš kontextem v každém okně. Řádek = titulek + hook, ne obsah.
2. **Žádné duplikáty zdrojů pravdy.** Co je v gitu, wiki nebo kódu, do paměti nepatří — jen pointer.
3. **Absolutní data.** „Launch 1.7.2026", nikdy „příští týden".
4. **Archiv místo mazání.** Hotový projekt → `archive/` + pryč z indexu. Historie zůstane, kontext se uvolní.
5. **Garden pass měsíčně.** Postup v [`GARDEN-PASS.md`](GARDEN-PASS.md).

## Instalace

1. Zkopíruj `MEMORY.md` (prázdný skeleton) do svého memory adresáře.
2. Vlož blok „L1 — Auto-memory konvence" z [`../claude-md-snippets.md`](../claude-md-snippets.md) do `~/.claude/CLAUDE.md`.
3. Hotovo — Claude začne memories zakládat sám; konvence ho drží konzistentního.
