# Claude Memory Stack

Vrstvený paměťový systém pro Claude Code — nadstavba nad čistou instalací, která dává Claudovi **trvalou paměť napříč okny a dny**. Ověřeno v denním provozu (100+ memories, 50+ wiki stránek, měsíce používání).

## Princip: 4 vrstvy

```
┌─────────────────────────────────────────────────────────────┐
│ L1  AUTO-MEMORY        1 fakt = 1 soubor + index MEMORY.md  │
│     „co si Claude pamatuje o tobě a tvé práci"              │
│     → nahrává se do KAŽDÉHO okna automaticky                │
├─────────────────────────────────────────────────────────────┤
│ L2  SESSION-MEMORY     checkpoint každého okna (hook)       │
│     „co se dělo v jiných oknech / před pádem"               │
│     → 3 nejnovější se ukážou při startu, zbytek na vyžádání │
├─────────────────────────────────────────────────────────────┤
│ L3  DOMÉNOVÁ WIKI      znalostní báze tvého byznysu/domény  │
│     „fakta o produktech, cenách, procesech" (Karpathy wiki) │
│     → Claude ji čte, když se ptáš na doménu                 │
├─────────────────────────────────────────────────────────────┤
│ L4  SÉMANTICKÝ INDEX   pgvector + embeddingy přes L3+obsah  │
│     „najdi tematicky, i když nevíš, kde to je" (MCP)        │
│     → brain_search pro vágní/tematické dotazy               │
└─────────────────────────────────────────────────────────────┘
```

**Proč vrstvy:** každá řeší jiný problém. L1 je horká (vždy v kontextu, proto musí být malá — jen index + odkazy). L2 je záchranná síť mezi okny. L3 je zdroj pravdy o doméně (velká, čte se cíleně). L4 dělá L3 prohledatelnou po významu, ne jen po názvech.

**Zlaté pravidlo:** do L1 nikdy nepatří to, co už žije v L3 nebo v gitu. L1 drží jen pointery a to, co jinde není (preference, zpětná vazba, stav rozdělané práce).

## Instalace po vrstvách

Každá vrstva funguje samostatně — můžeš nasadit jen L1, nebo všechny čtyři.

| Vrstva | Složka | Náročnost |
|---|---|---|
| L1 Auto-memory | [`1-auto-memory/`](1-auto-memory/) | 5 min — složka + konvence do CLAUDE.md |
| L2 Session-memory | [`2-session-memory/`](2-session-memory/) | 10 min — 2 hooky (Bun) + 3 slash commands |
| L3 Doménová wiki | [`3-business-wiki/`](3-business-wiki/) | 15 min — šablona struktury + pravidlo do CLAUDE.md |
| L4 Sémantický index | [`4-semantic-layer/`](4-semantic-layer/) | 1–2 h — [HumanAgentWiki](https://github.com/petrludwig-collab/HumanAgentWiki) + denní sync |

Bloky k vložení do `~/.claude/CLAUDE.md` jsou v [`claude-md-snippets.md`](claude-md-snippets.md).

## Údržba (bez ní systém shnije)

- **Garden pass 1× měsíčně** — archivace hotových memories, sloučení duplikátů, kontrola indexu. Postup: [`1-auto-memory/GARDEN-PASS.md`](1-auto-memory/GARDEN-PASS.md).
- **Session checkpointy** — mazat starší 30 dní: `find ~/.claude/session-memory -name "*.md" -mtime +30 -delete`
- **Wiki lint** — občas nechat Clauda projít rozpory a sirotčí stránky (postup ve WIKI šabloně).

## Požadavky

- Claude Code (CLI)
- L2: [Bun](https://bun.sh) (hooky jsou TypeScript)
- L4: Python 3.12, ~2 GB na embeddingový model (běží lokálně, data neopouští stroj)
