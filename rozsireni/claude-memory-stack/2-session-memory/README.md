# L2 — Session-memory

Checkpoint každého okna Claude Code: po každé odpovědi hook zapíše celou session jako čitelný markdown do `~/.claude/session-memory/<session-id>.md`. Při startu nového okna se ukáže seznam 3 nejnovějších checkpointů z ostatních oken + (při resume/pádu) shrnutí té samé session.

**K čemu to je:** práce ve více oknech naráz („co jsem řešila ve vedlejším okně?"), obnova po pádu, „pokračuj tam, kde jsme včera skončili".

## Soubory

- `hooks/SessionCheckpoint.hook.ts` — trigger **Stop** (po každé odpovědi), zapíše/přepíše checkpoint
- `hooks/LoadSessionMemory.hook.ts` — trigger **SessionStart**, injektuje shrnutí do kontextu
- `commands/session-list.md` — `/session-list` vypíše checkpointy
- `commands/session-clear.md` — `/session-clear <id>` smaže jeden (s potvrzením)
- `commands/session-wipe.md` — `/session-wipe` smaže všechny (s potvrzením)

## Instalace

Vyžaduje [Bun](https://bun.sh).

```bash
cp hooks/*.ts ~/.claude/hooks/
cp commands/*.md ~/.claude/commands/
chmod +x ~/.claude/hooks/SessionCheckpoint.hook.ts ~/.claude/hooks/LoadSessionMemory.hook.ts
```

Do `~/.claude/settings.json` přidej hooky (viz [`settings-snippet.json`](settings-snippet.json)) — sekce `hooks` se merguje s tím, co už tam máš.

## Údržba

Checkpointy se samy nemažou. Jednou za čas:
```bash
find ~/.claude/session-memory -name "*.md" -mtime +30 -delete
```
