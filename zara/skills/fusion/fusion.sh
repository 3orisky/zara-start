#!/usr/bin/env bash
# Fusion — multi-model deliberace přes OpenRouter.
# Panel (Claude Opus + GPT + Gemini) odpoví paralelně, soudce sjednotí.
# Default soudce: Fable 5 (~anthropic/claude-fable-latest), panel explicitně.
# Usage:
#   fusion.sh "tvoje otázka"
#   fusion.sh --budget "otázka"                     # levnější preset general-budget
#   fusion.sh --preset general-high "otázka"        # volba OpenRouter presetu (fallback chování)
#   fusion.sh --max-tool-calls 4 "otázka"           # kolik web volání smí každý model (default 8)
#   fusion.sh --raw "otázka"                         # vrať celé JSON
#   echo "dlouhý prompt" | fusion.sh -              # prompt ze stdin
set -euo pipefail

URL="https://openrouter.ai/api/v1/chat/completions"
FABLE_JUDGE="~anthropic/claude-fable-latest"
FALLBACK_MODEL="anthropic/claude-opus-5"
PANEL='["~anthropic/claude-opus-latest","~openai/gpt-latest","~google/gemini-pro-latest"]'

# Klíč: env, jinak Keychain
KEY="${OPENROUTER_API_KEY:-}"
if [ -z "$KEY" ]; then
  KEY="$(security find-generic-password -a "$USER" -s OPENROUTER_API_KEY -w 2>/dev/null || true)"
fi
if [ -z "$KEY" ]; then
  echo "Chybí OPENROUTER_API_KEY (env ani Keychain)." >&2
  exit 1
fi

PRESET=""
RAW=0
MAX_TOOL_CALLS=8
ARGS=()
while [ $# -gt 0 ]; do
  case "$1" in
    --preset)         PRESET="$2"; shift 2 ;;
    --budget)         PRESET="general-budget"; shift ;;
    --max-tool-calls) MAX_TOOL_CALLS="$2"; shift 2 ;;
    --raw)            RAW=1; shift ;;
    -)                ARGS+=("$(cat)"); shift ;;
    *)                ARGS+=("$1"); shift ;;
  esac
done

PROMPT="${ARGS[*]:-}"
if [ -z "$PROMPT" ]; then
  echo "Usage: fusion.sh [--budget|--preset NAME] [--max-tool-calls N] [--raw] \"otázka\"" >&2
  exit 1
fi

# Sestav tělo přes jq (bezpečné escapování)
if [ -n "$PRESET" ]; then
  # Původní chování: preset řídí panel i soudce
  BODY="$(jq -n --arg p "$PROMPT" --arg preset "$PRESET" --argjson mtc "$MAX_TOOL_CALLS" \
    '{model:"openrouter/fusion", messages:[{role:"user",content:$p}], plugins:[{id:"fusion", preset:$preset, max_tool_calls:$mtc}], usage:{include:true}}')"
else
  # Nový default: soudce Fable + explicitní panel Opus+GPT+Gemini
  BODY="$(jq -n --arg p "$PROMPT" --arg judge "$FABLE_JUDGE" --argjson panel "$PANEL" --argjson mtc "$MAX_TOOL_CALLS" \
    '{model:$judge, messages:[{role:"user",content:$p}], plugins:[{id:"fusion", analysis_models:$panel, max_tool_calls:$mtc}], usage:{include:true}}')"
fi

TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT

CODE=""
RESP=""
call() {
  set +e
  CODE="$(curl -sS --max-time 180 -o "$TMP" -w '%{http_code}' "$URL" \
    -H "Authorization: Bearer $KEY" \
    -H "Content-Type: application/json" \
    -H "HTTP-Referer: https://tvujweb.cz" \
    -H "X-Title: uživatelka CLI Fusion" \
    -d "$1")"
  set -e
  RESP="$(cat "$TMP" 2>/dev/null || true)"
  if [ -z "$CODE" ]; then CODE="000"; fi
  return 0
}

retryable() { [ "$1" = "429" ] || { [ "$1" -ge 500 ] 2>/dev/null; } || [ "$1" = "000" ]; }

FALLBACK=0
call "$BODY"
if retryable "$CODE"; then
  sleep 3
  call "$BODY"
fi
if retryable "$CODE"; then
  # Fallback: přímé volání Opusu bez fusion pluginu (bez panelu)
  FALLBACK=1
  FB_BODY="$(jq -n --arg p "$PROMPT" --arg m "$FALLBACK_MODEL" \
    '{model:$m, messages:[{role:"user",content:$p}], usage:{include:true}}')"
  sleep 2
  call "$FB_BODY"
fi

if [ "$RAW" -eq 1 ]; then
  echo "$RESP" | jq .
  exit 0
fi

CONTENT="$(echo "$RESP" | jq -r '.choices[0].message.content // empty')"
if [ -z "$CONTENT" ]; then
  echo "Chyba (HTTP $CODE): $(echo "$RESP" | jq -r '.error.message // "neznámá chyba"')" >&2
  exit 1
fi

if [ "$FALLBACK" -eq 1 ]; then
  echo "⚠️  FALLBACK: panel Fusion nedostupný (HTTP $CODE po retry) — přímý model $FALLBACK_MODEL bez panelu."
  echo
fi

echo "$CONTENT"

echo
echo "── usage ──"
echo "$RESP" | jq -r '
  .usage as $u |
  if $u then
    "tokeny: prompt=\($u.prompt_tokens // 0) completion=\($u.completion_tokens // 0) total=\($u.total_tokens // 0)\n" +
    (if ($u.cost != null)
       then "cena (OpenRouter): $\($u.cost)"
       else "cena (hrubý odhad Fable $10/$50 za 1M): $" + (((($u.prompt_tokens // 0)*10 + ($u.completion_tokens // 0)*50)/1000000)|tostring)
     end)
  else "usage nedostupné" end'
