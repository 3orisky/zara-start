---
name: fusion
description: Multi-model deliberace přes OpenRouter Fusion — náročnou/výzkumnou/strategickou otázku položí panelu špičkových modelů (Claude Opus + GPT + Gemini), které odpoví paralelně, soudce odpovědi porovná (shody, rozpory, slepá místa) a sjednotí do finální odpovědi. USE WHEN uživatelka říká "fusion", "zeptej se panelu", "deep konzultace", "ať se na to podívá víc modelů", "kde se nesmí splést", nebo má strategické/výzkumné rozhodnutí, kde stojí za to zaplatit víc completions za vyšší jistotu.
---

# Fusion (OpenRouter)

Panel špičkových modelů odpoví na jeden prompt **paralelně**, soudce odpovědi porovná a napíše finální verzi vycházející z té analýzy. Panel i soudce mají přístup k webu.

**Default soudce = Fable 5** (`~anthropic/claude-fable-latest`, floating alias, aktuálně claude-fable-5, ~$10/$50 za 1M in/out). Panel se posílá explicitně: Opus + GPT + Gemini (top-level floating aliasy). Presety OpenRouteru zůstávají jako volba/fallback (viz `--budget` / `--preset`).

**Kdy použít:** výzkum, strategická rozhodnutí, otázky kde se nevyplatí splést.
**Kdy NE:** běžné dotazy — je to pomalé (desítky sekund) a drahé (víc completions).

## Použití

```bash
~/.claude/skills/fusion/fusion.sh "Porovnej strategie X, Y, Z pro …"   # default: Fable soudce + panel
~/.claude/skills/fusion/fusion.sh --budget "otázka"                    # levnější preset general-budget
~/.claude/skills/fusion/fusion.sh --preset general-high "otázka"       # volba OpenRouter presetu
~/.claude/skills/fusion/fusion.sh --max-tool-calls 4 "otázka"          # web volání na model (default 8)
~/.claude/skills/fusion/fusion.sh --raw "otázka"                       # celé JSON (analýza soudce)
echo "dlouhý prompt z více řádků" | ~/.claude/skills/fusion/fusion.sh -
```

Při prvním spuštění: `chmod +x ~/.claude/skills/fusion/fusion.sh`

Výstup končí blokem `── usage ──`: tokeny (prompt/completion/total) + cena. Cena je z OpenRouteru (`usage.cost`, USD), jinak hrubý odhad z Fable pricingu.

## Robustnost
- **Timeout** 180 s (curl `--max-time 180`).
- **Retry + fallback**: při 429/5xx/timeoutu jeden retry (krátký backoff), pak fallback na přímé volání `anthropic/claude-opus-5` **bez** fusion pluginu — výstup se označí `⚠️ FALLBACK`.

## Klíč
`OPENROUTER_API_KEY` — čte se z env, jinak z macOS Keychain (`security find-generic-password -s OPENROUTER_API_KEY`). Uložen v obojím. Nikdy není v kódu.

## Flagy / parametry
- `--budget` → preset `general-budget` (levnější/rychlejší, původní chování)
- `--preset NAME` → OpenRouter preset (`general-high` | `general-budget`)
- `--max-tool-calls N` → 1–16 (default 8), kolik web volání smí každý model
- `--raw` → celé JSON odpovědi
- `-` → prompt ze stdin

Bez presetu (default): top-level `model: "~anthropic/claude-fable-latest"` + `plugins:[{id:"fusion", analysis_models:[Opus,GPT,Gemini], max_tool_calls:N}]`.

Dokumentace: https://openrouter.ai/docs/guides/features/plugins/fusion

## Holubník
Stejná funkce je i nástroj Rozárky `deep_consult` (`~/AI/tým agentů/src/tools/fusion.ts`) — hlavní agent ho volá sama na náročné otázky.
