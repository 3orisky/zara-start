---
name: advisor
description: Druhý názor od silnějšího poradce (Fable 5) přes Anthropic Advisor tool. USE WHEN uživatelka řekne "poraď se s fable", "co na to fable", "zeptej se poradce", "druhý názor", nebo u těžkého strategického/riskantního rozhodnutí, kde se vyplatí nechat odpověď posoudit silnějším modelem. Zara tím obchází, že si advisor tool do vlastního běhu injektovat neumí.
---

# advisor — poradit se s Fable

Samostatné volání Messages API, kde **executor** model odpovídá a uprostřed se
poradí s **Fable 5** (advisor tool, beta). Claude Code si advisor tool do sebe
injektovat neumí → tohle je obchvat.

## Kdy použít
- uživatelka výslovně: „poraď se s fable", „co na to fable", „druhý názor".
- Těžké/riskantní rozhodnutí (strategie, launch, cena, text s vysokou sázkou),
  kde chci odpověď nechat posoudit silnějším modelem než jen mnou.
- NE na drobnosti a běžný chat (zbytečný náklad Fable tokenů).

## Jak spustit
```bash
cd $HOME/Projects/advisor-cli
~/.bun/bin/bun advisor.ts "<otázka nebo úkol>"
# vynutit radu Fable: --force
# levnější executor: --executor=claude-sonnet-5
# dlouhý kontext přes stdin: echo "…" | ~/.bun/bin/bun advisor.ts -
```
Výstup je hotová odpověď; patička (stderr) hlásí, kolikrát a za kolik tokenů
Fable poradil. Když chci syrová data, přidej `--force --json`.

## Pozn.
- Fable radí šifrovaně — nečtu jeho text, jen ovlivní výsledek.
- Fable tokeny se účtují zvlášť. Default executor = `claude-opus-4-8`.
- Stejný mechanismus běží pro všech 8 holoubků na VPS
  (`/opt/muj-tym/src/core/advisor.ts`, kill-switch `ADVISOR_ENABLED=0`).
