---
description: Delete a specific session checkpoint by ID (argument) or current session if empty
argument-hint: "[session-id or first 8 chars, empty = current]"
---

Smaž konkrétní session checkpoint.

**Argument:** `$ARGUMENTS`

Postup:
1. Pokud je argument prázdný, smaž checkpoint aktuální session (najdi session ID z `~/.claude/session-memory/` nejnovější podle mtime — to je moje vlastní session).
2. Pokud je argument poskytnut, najdi soubor `~/.claude/session-memory/*<argument>*.md` (prefix match na prvních 8 znaků ID je povoleno).
3. Před smazáním zobraz: `session ID`, `topic`, `last_activity`, `turns` — a **zeptej se uživatelky na potvrzení**.
4. Po potvrzení smaž `rm ~/.claude/session-memory/<matching-file>.md`.
5. Potvrď smazání.

Pokud match najde víc souborů, vylistuj je a zeptej se které smazat.
Pokud nic nenajde, řekni to a nabídni `/session-list`.
