---
description: List all saved session checkpoints with topic and timestamp
---

Vylistuj všechny uložené session checkpointy z `~/.claude/session-memory/`.

Pro každý soubor zobraz:
- Session ID (zkrácený na prvních 8 znaků)
- Téma (z frontmatter `topic`)
- Poslední aktivitu (`last_activity`)
- Počet tahů (`turns`)

Seřaď podle `last_activity` sestupně (nejnovější první). Pokud tam nic není, řekni jí to.

Použij příkaz:

```bash
ls -lt ~/.claude/session-memory/*.md 2>/dev/null
```

Potom pro každý soubor vypiš frontmatter info v přehledné tabulce.

Na konci připomeň jak smazat: `/session-clear <id>` pro jednu nebo `/session-wipe` pro všechny.
