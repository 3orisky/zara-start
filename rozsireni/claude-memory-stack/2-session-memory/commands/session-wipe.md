---
description: Delete ALL session checkpoints (destructive, asks for confirmation)
---

**DESTRUKTIVNÍ operace.** Smaže VŠECHNY session checkpointy z `~/.claude/session-memory/`.

Postup:
1. Spočítej kolik souborů je v `~/.claude/session-memory/*.md` (command: `ls ~/.claude/session-memory/*.md 2>/dev/null | wc -l`).
2. Zobraz uživateli: "Chystám se smazat **N** checkpointů. Poslední aktivita: [datum nejnovějšího]."
3. **POŽADUJ explicitní potvrzení.** Uživatel musí napsat "ano, smaž" nebo "yes" nebo podobné. Na nic jiného nemaž.
4. Po potvrzení: `rm ~/.claude/session-memory/*.md`.
5. Potvrď kolik bylo smazáno.

Pokud je složka prázdná, řekni to a nic nedělej.
