---
name: ralph-wigum-loop
description: Pattern pro dlouhodobou autonomní implementaci agentem bez ztráty kontextu. USE WHEN uživatelka říká "ralph wigum", "loop pattern", "dlouho běžící implementace", "ať to běží přes noc", nebo plánuje implementaci, která bude trvat víc než 2 hodiny.
---

# Ralph Wigum Loop

**Princip:** Po každém tasku zabij agenta, otevři nového, dej mu jen ten jeden další task. Tím udržíš kontext čistý a agent nikdy neztratí přehled.

## Proč to funguje
- LLM kontextové okno se časem zaplňuje a agent začne "halucinovat" / zapomínat
- Sumarizace kontextu ztrácí detaily
- Nový agent s čistým kontextem + jasným taskem = vyšší kvalita
- Pravda je v dokumentech (spec/plan/tasks), ne v paměti agenta

## Předpoklad
- **MUSÍŠ** mít rozdělené tasky v dokumentech (viz skill `spec-kit`)
- Každý task musí být atomický (1 commit, 1 PR, jasný výstup)
- Tasky musí mít `[ ]` checkboxy pro tracking

## Workflow (manuální)
```
LOOP:
  1. Otevři Cloud Code session
  2. Řekni: "Přečti tasks.md, najdi první [ ] task, implementuj ho, označ [x]"
  3. Počkej na dokončení
  4. Zkontroluj kód (commit/diff)
  5. Pokud OK → git commit
  6. UKONČI session (clear context)
  7. Goto 1
UNTIL všechny tasky [x]
```

## Workflow (automatický přes DEX)
DEX (skill `dex-orchestrator`) tohle dělá za tebe:
- Spustíš jednou
- Pro každý task automaticky otevře nového Cloud Code agenta
- Po dokončení udělá commit
- Pokračuje dál bez tvého zásahu
- Pošle notifikaci až je hotovo

## Kdy NEpoužívat
- Krátké úkoly (< 5 tasků) — overhead spuštění je větší než benefit
- Tasky, které potřebují kontext z předchozích tasků (špatný spec — refaktoruj)
- Explorativní práce, kde nevíš, co bude dál

## Kombinace s ostatními
- **spec-kit** — připraví tasks.md, který loop konzumuje
- **dex-orchestrator** — automatizuje celý loop
- **claude-api** — pokud chceš programaticky volat Cloud Agent SDK v loopu

## Anti-patterns
1. ❌ "Dlouhý chat" — ne, raději vždy nový session
2. ❌ "Přidám další task když už agent běží" — ne, dokonči current task, pak nový session
3. ❌ "Agent si pamatuje, co jsme řešili před hodinou" — pravda je v `tasks.md`, ne v hlavě agenta
4. ❌ "Tasky bez akceptačních kritérií" — agent nepozná kdy je hotovo

## Origin
Lukáš (kurz Agentic Engineering, lekce 4) — pojmenováno po postavičce Ralph Wigum ze Simpsonových: jednoduchý, vždy znovu, vždy s nadšením.
