---
name: spec-kit
description: GitHub Spec Kit workflow pro Spec-Driven Development. USE WHEN uživatelka říká "specifikuj", "spec-kit", "rozplánuj projekt", "vytvoř specifikaci", nebo když začíná nový projekt/feature a chce strukturovaný postup od nápadu k implementaci.
---

# Spec Kit — Spec-Driven Development

GitHub Spec Kit (https://github.com/github/spec-kit) je framework pro rozdělení implementace do 4 fází: **specify → plan → tasks → implement**.

## Kdy použít
- Nový projekt nebo větší feature (3+ dnů práce)
- Chceš mít dokumentaci historie vývoje
- Potřebuješ rozdělit práci do menších kroků (kombinace s Ralph Wigum loop)

## Workflow

### Předpoklad
1. V projektu existuje `goal.md` (nebo readme.md ve složce specs/) — uživatelčin nápad popsaný vlastními slovy
2. Cloud Code je nainstalovaný + spec-kit jako plugin/skill
3. Git repo je inicializovaný

### 4 fáze

**1. `/speckit.specify` — Analytická specifikace**
- Vstup: `goal.md`
- Výstup: `specs/<feature-name>/spec.md`
- Obsah: user stories, akceptační kritéria, priority, edge cases
- Pokládá doplňující otázky, identifikuje díry v zadání

**2. `/speckit.plan` — Technický plán**
- Vstup: `spec.md`
- Výstup: `specs/<feature-name>/plan.md`
- Obsah: technický kontext, technologie, architektura, datový model, quick-start

**3. `/speckit.tasks` — Rozpad na úkoly**
- Vstup: `plan.md`
- Výstup: `specs/<feature-name>/tasks.md`
- Obsah: konkrétní tasky s `[ ]` checkboxy, označení paralelizovatelných tasků
- Každý task tak granulární, aby ho šel udělat na jednom dechu

**4. `/speckit.implement` — Exekuce**
- Vstup: `tasks.md`
- Agent jde task po tasku, odškrtává `[x]` po dokončení
- Po každé user story se ptá, zda pokračovat

## Kombinace s Ralph Wigum loop
Po každé user story (nebo fázi):
1. Ulož stav (git commit)
2. **Zabij Cloud Code session** (vyčisti kontext)
3. Otevři novou session
4. Řekni: `pokračuj fází N` nebo `/speckit.implement` (ona si přečte tasks.md a najde nezatškrtnuté)

Tím udržuješ kontext malý a agent neztrácí přehled.

## Kde to už používáme
- `$HOME/muj-projekt/` — viz `.specify/` složka
- DEX orchestrator (skill `dex-orchestrator`) tohle automatizuje

## Doporučená struktura projektu
```
project/
├── goal.md                    # uživatelčin původní nápad (volné psaní)
├── docs/
│   └── architecture.md        # high-level dokumentace
├── specs/
│   ├── 001-feature-x/
│   │   ├── spec.md
│   │   ├── plan.md
│   │   └── tasks.md
│   └── 002-feature-y/
└── .specify/                  # spec-kit metadata
```

## Tipy od Lukáše (kurz Agentic Engineering)
1. **Nepoužívej spec-kit pro malé úkoly** — overhead se nevyplatí
2. **Vždy si přečti spec.md před plan.md** — opravuj nejasnosti hned
3. **Rozdělení na user stories je klíč** — každá user story = jeden Cloud Code session
4. **Kombinuj s Ralph Wigum loop** — viz skill `ralph-wigum-loop`
5. **Drž si vlastní `docs/`** vedle `specs/` — high-level pro tvoji orientaci
