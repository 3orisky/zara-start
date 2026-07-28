# advisor-cli

Malý CLI nástroj: polož otázku Claudovi (**executor** model), který se **uprostřed
přemýšlení poradí se silnějším modelem** (výchozí **Fable 5**) přes Anthropic
[Advisor tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool) (beta).
Dostaneš odpověď blízkou kvalitě silného modelu, ale většina tokenů se generuje
za sazbu levnějšího executoru.

> Proč to existuje: Claude Code (uzavřený harness) si advisor tool do vlastního
> běhu injektovat neumí. Tohle je obchvat — samostatné volání Messages API,
> takže si druhý názor můžeš vyžádat i z terminálu.

## Co to umí
- Executor odpoví a sám se podle potřeby **poradí s poradcem** (advisor tool).
- Volitelně radu **vynutí** (`--force`) — zaručí aspoň jednu konzultaci.
- Vstup z argumentu i ze **stdin** (dlouhý kontext přes rouru).
- Vlastní systémový prompt, výběr executoru i poradce, stropy tokenů.
- Patička hlásí, **kolikrát a za kolik tokenů** poradce poradil.
- Bez závislostí — čistý [Bun](https://bun.sh) + `fetch`.

## Instalace
```bash
git clone <tenhle balíček: rozsireni/advisor-cli>
cd advisor-cli
cp .env.example .env      # a doplň svůj ANTHROPIC_API_KEY
```
Potřebuješ [Bun](https://bun.sh) a Anthropic API klíč s přístupem k advisor beta.

## Použití
```bash
bun advisor.ts "Má malá firma spustit levný produkt teď, nebo počkat na podzim?"
bun advisor.ts --force --executor=claude-sonnet-5 "..."   # vynutí radu poradce
echo "dlouhý text…" | bun advisor.ts --system="Jsi stratég" -
```

## Flagy
| flag | default | popis |
|---|---|---|
| `--executor=` | `claude-opus-4-8` | model, co odpovídá |
| `--advisor=` | `claude-fable-5` | poradce (musí být ≥ schopnost executoru) |
| `--force` | – | `tool_choice=advisor` → aspoň jedna rada |
| `--system=` | – | systémový prompt |
| `--max=` | `4096` | max_tokens executoru |
| `--advisor-max=` | `2048` | max_tokens poradce/volání (min 1024) |
| `--json` | – | celá odpověď jako JSON |
| `--quiet` | – | jen výsledek, bez patičky |

## Jak to funguje
Executor si během jednoho requestu emituje `server_tool_use` s poradcem; Anthropic
spustí poradce server-side nad celým transcriptem a vrátí radu jako
`advisor_tool_result`, executor pak pokračuje. CLI řeší `pause_turn` (poradce běží
asynchronně) tím, že request bez úprav pošle znovu. Poradce jako Fable 5 vrací radu
**šifrovaně** (`advisor_redacted_result`) — nečteš ji, jen ovlivní výsledek.

## Poznámky
- Tokeny poradce se **účtují zvlášť**, sazbou poradce (viz `usage.iterations` →
  `advisor_message`). Stropy `--advisor-max` / `max_uses` drží náklad nízko.
- `ANTHROPIC_API_KEY` čte z env nebo z `.env` vedle skriptu. `.env` je gitignored.

## Licence
MIT
