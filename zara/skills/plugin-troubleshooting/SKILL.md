---
name: plugin-troubleshooting
description: Řešení problémů s Cloud Code pluginy — cache, update, reload, restart sequence. USE WHEN uživatelka říká "plugin nefunguje", "skill nepoužívá novou verzi", "update plugin", "stará verze", "cache problém" nebo plugin po editaci nereaguje na změny.
---

# Plugin Troubleshooting

Když Cloud Code plugin nepoužívá nejnovější verzi nebo se nechová, jak má. Lukášovy tipy z lekce 5.

## Standardní update sekvence

Vždy v tomto pořadí:

```
1. /plugin marketplace update <my-marketplace>
2. /plugin reload
3. Ukonči Cloud Code (Ctrl+C, exit)
4. Otevři novou session: claude
5. Test
```

**Proč všechno?** Každý krok řeší jinou cache vrstvu:
- `marketplace update` — stáhne nové verze pluginů z repa
- `plugin reload` — načte je do paměti
- restart Cloud Code — vyhodí starou session včetně in-memory cache

## Když ani to nepomůže — Lukášův trik

Cloud Code má někdy zákeřnou cache, která přežije i restart. Lukášova odpověď:

```
"Hej, proč nepoužíváš novou verzi skillu X? Mám tady staženou verzi 2.0,
ale v mé sessionu se chováš jako verze 1.0."
```

Cloud Code typicky odpoví:
> "Máš pravdu, mám nakešovanou starou verzi. Vyčistím cache a zkusím znovu."

A funguje. **Není to bug, je to feature** — agent dokáže poznat svoje cache a vyčistit ji.

## Když chceš dělat rychlé iterace na skillu

Místo `git push` po každé změně:

### Použij lokální cestu (ne GitHub URL)
```
/plugin marketplace remove <my-marketplace>
/plugin marketplace add $HOME/cloud-marketplace
```

Změny v souborech se projeví ihned po `/plugin reload` (bez `marketplace update`, protože není co stahovat).

## Lokace cache na disku (pokud potřebuješ smazat ručně)

```
~/.claude/plugins/                    # nainstalované pluginy
~/.claude/known-marketplaces.json     # registrované marketplacy
~/.claude/cache/                      # session cache (občas problémovité)
```

**Nikdy nesmazávej:**
- `~/.claude/projects/` — sessions a memory
- `~/.claude/CLAUDE.md` — tvoje globální pravidla
- `~/.claude/settings.json` — tvoje konfigurace

## Diagnostika

### Skill se nespouští automaticky
**Příčina:** description neobsahuje klíčová slova z promptu.

**Řešení:**
- Zkontroluj `description:` ve frontmatter `SKILL.md`
- Přidej víc trigger slov (různé varianty uživatelčiných formulací)
- Test: `/<skill-name>` — pokud funguje manuálně, problém je v description

### Skill se spouští, ale chyby
**Příčina:** Závislosti (Python knihovny, MCP servery, env proměnné).

**Řešení:**
1. Spusť skill manuálně přes `/<skill-name>`
2. Přečti error message v Cloud Code
3. Pokud chybí knihovna — `uv sync` v skill složce
4. Pokud chybí env var — přidej do `~/.zshrc`

### MCP server se nepřipojuje
**Příčina:** Server selhal při startu (chyba v configu, chybějící klíč, port konflikt).

**Řešení:**
1. `/mcp` — zobrazí stav všech MCP serverů
2. Najdi ten s "failed"
3. Zkus restart Cloud Code
4. Pokud nepomůže — zkontroluj log: typicky `~/.claude/logs/`

## Best practices pro uživatelku

1. **Po každé úpravě skillu:** restart Cloud Code (ne jen reload)
2. **Verzování pluginů:** v `plugin.json` zvyš verzi → snadno poznáš, jestli běží správná
3. **Test po updatu:** zkus jednoduchý prompt, který by měl trigerovat skill
4. **Když pochybuješ:** zeptej se přímo Cloud Code "jakou verzi skillu X používáš?"

## Vztah k ostatním skillům
- `lukas-marketplace` — kde tyto problémy nejvíc vzniknou
- `update-config` — pro úpravu `settings.json`
- `skill-creator` — když píšeš/upravuješ skilly
