#!/bin/zsh
cd "$(dirname "$0")" || exit 1
export PATH="$HOME/.local/bin:$HOME/.bun/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"
[ -f .env ] && { set -a; source .env; set +a; }
# caffeinate drží Mac vzhůru, dokud bot běží
exec caffeinate -dimsu ~/.bun/bin/bun run bot.ts
