# Bloky do ~/.claude/CLAUDE.md

Zkopíruj do svého globálního `~/.claude/CLAUDE.md` bloky pro vrstvy, které používáš. Nahraď `<...>` placeholdery.

## L1 — Auto-memory konvence

```markdown
## Paměť — konvence
- Paměť žije v memory adresáři projektu (MEMORY.md = index, načítá se každou session).
- 1 fakt = 1 soubor, prefix podle typu: `user_` (kdo jsem), `feedback_` (jak mám pracovat),
  `project_` (rozdělaná práce), `reference_` (odkazy na externí zdroje), `skill_` (instalované nástroje).
- Do paměti NEpatří, co už je v kódu, gitu nebo wiki — tam patří jen pointer.
- Hotové projekty přesouvej do `memory/archive/` + smaž řádek z indexu (garden pass 1× měsíčně).
- Relativní data převáděj na absolutní (ne „minulý týden", ale 2026-07-02).
```

## L3 — Doménová wiki

```markdown
## Doménová wiki (<název tvého byznysu>)
Mám znalostní bázi v `<cesta k wiki>/` (Karpathy LLM Wiki pattern). Obsahuje <co obsahuje> — NE <co neobsahuje, např. klienty>.

**Pravidlo:** Když se konverzace týká <doménová témata>, **nejdřív přečti `<cesta>/index.md`** a pak relevantní stránky. Před doporučeními vycházej z dat ve wiki.

**Údržba:** Po novém zjištění nabídni update wiki (nová stránka / edit + záznam do `log.md`). Konvence jsou ve `WIKI.md` v kořeni wiki.
```

## L4 — Sémantické hledání

```markdown
**Sémantické hledání:** Pro tematické/vágní dotazy k doméně („co máme k X?", „jak mluvíme o Y?") použij MCP nástroj `brain_search` (HumanAgentWiki, port 8802) — prohledává wiki + <další obsah> sémanticky, najde i to, co v indexu není. Pro přesná čísla/ceny stále platí primárně wiki soubory.
```
