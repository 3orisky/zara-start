#!/usr/bin/env bash
# Kombinovaná statusline: původní PAI (model) + ccusage (tokeny/cena).
# Claude Code posílá JSON na stdin; pošleme ho oběma.
input=$(cat)

PAI_LINE=$(printf '%s' "$input" | $HOME/.claude/statusline-model.sh 2>/dev/null)

CCUSAGE_JS="$HOME/.bun/install/global/node_modules/ccusage/src/cli.js"
CC_LINE=$(printf '%s' "$input" | $HOME/.bun/bin/bun "$CCUSAGE_JS" statusline 2>/dev/null)

if [ -n "$PAI_LINE" ]; then
  printf '%s\n%s' "$PAI_LINE" "$CC_LINE"
else
  printf '%s' "$CC_LINE"
fi
