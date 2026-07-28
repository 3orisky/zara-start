#!/bin/bash
# Minimal statusline: shows only the active model name.
input=$(cat)
model=$(printf '%s' "$input" | /usr/bin/python3 -c 'import sys,json; print(json.load(sys.stdin).get("model",{}).get("display_name","?"))' 2>/dev/null)
printf '◈ Model: %s' "${model:-?}"
