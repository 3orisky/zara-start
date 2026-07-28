#!/usr/bin/env bash
# Zapíše dnešní kumulativní spotřebu Claude Code (přes ccusage) do JSONL logu.
# Historie tak přežije i smazání transcriptů. Jeden řádek na spuštění; poslední
# řádek dne = finální denní součet. Spouští se jako Stop hook (nenarušuje ostatní).
cat >/dev/null 2>&1   # spolknout stdin od Claude Code
LOG_DIR="$HOME/.claude/logs"
mkdir -p "$LOG_DIR"
CCUSAGE_JS="$HOME/.bun/install/global/node_modules/ccusage/src/cli.js"
BUN="$HOME/.bun/bin/bun"
# denní JSON z ccusage (dnešní řádek)
TODAY=$(date +%Y%m%d)
RAW=$("$BUN" "$CCUSAGE_JS" daily --since "$TODAY" --json 2>/dev/null)
if [ -n "$RAW" ]; then
  # zkomprimovat na jeden řádek (JSONL) + obalit časovou značkou
  printf '%s' "$RAW" | "$BUN" -e '
    const fs=require("fs");
    const raw=fs.readFileSync(0,"utf8");
    const now=new Date().toISOString();
    process.stdout.write(JSON.stringify({logged_at:now,data:JSON.parse(raw)})+"\n");
  ' >> "$LOG_DIR/token-usage.jsonl" 2>/dev/null
fi
exit 0
