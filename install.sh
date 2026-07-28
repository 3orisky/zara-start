#!/usr/bin/env bash
# Zara Start - instalace kompletního mozku Claude Code na nový Mac.
# Pouštěj z kořene tohohle balíčku:  bash install.sh
set -euo pipefail

BAL="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
C="$HOME/.claude"
STAMP="$(date +%Y%m%d-%H%M%S)"

say()  { printf '\n\033[1;36m▸ %s\033[0m\n' "$*"; }
ok()   { printf '  \033[0;32m✓\033[0m %s\n' "$*"; }
warn() { printf '  \033[0;33m!\033[0m %s\n' "$*"; }

# ---------------------------------------------------------------- 0. kontrola
say "Kontrola prostředí"

[ "$(uname)" = "Darwin" ] || warn "Tohle je psané pro macOS. Na jiném systému něco nemusí sednout."

if ! command -v claude >/dev/null 2>&1; then
  warn "Claude Code (příkaz 'claude') není nainstalovaný."
  echo "     Nainstaluj ho podle https://claude.com/claude-code a spusť install.sh znovu."
  exit 1
fi
ok "Claude Code nalezen"

if ! command -v bun >/dev/null 2>&1 && [ ! -x "$HOME/.bun/bin/bun" ]; then
  warn "Bun není nainstalovaný. Hooky (paměť, checkpointy) bez něj nepojedou."
  read -r -p "     Nainstalovat Bun teď? [a/n] " a
  if [ "${a:-n}" = "a" ]; then
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
    ok "Bun nainstalován"
  else
    warn "Pokračuju bez Bunu. Doinstaluj ho později: curl -fsSL https://bun.sh/install | bash"
  fi
else
  ok "Bun nalezen"
fi

# ---------------------------------------------------------------- 1. jméno
say "Nastavení"
read -r -p "  Jak ti má Zara říkat? (křestní jméno): " JMENO
JMENO="${JMENO:-Šéfko}"
ok "Budeš $JMENO"

# ---------------------------------------------------------------- 2. záloha
if [ -d "$C" ]; then
  say "Zálohuju stávající ~/.claude"
  BACKUP="$HOME/.claude-zaloha-$STAMP"
  cp -R "$C" "$BACKUP"
  ok "Záloha: $BACKUP"
else
  mkdir -p "$C"
fi

# ---------------------------------------------------------------- 3. mozek
say "Instaluju Zaru do ~/.claude"

for d in skills hooks agents commands memory; do
  mkdir -p "$C/$d"
  rsync -a "$BAL/zara/$d/" "$C/$d/"
done
ok "skilly, hooky, agenti, příkazy"

# CLAUDE.md - existující nepřepisujeme, odložíme vedle
if [ -f "$C/CLAUDE.md" ]; then
  cp "$C/CLAUDE.md" "$C/CLAUDE.md.puvodni-$STAMP"
  warn "Původní CLAUDE.md odložen jako CLAUDE.md.puvodni-$STAMP"
fi
sed "s|__JMENO__|$JMENO|g" "$BAL/zara/CLAUDE.md" > "$C/CLAUDE.md"
ok "CLAUDE.md (globální instrukce)"

# settings.json
if [ -f "$C/settings.json" ]; then
  cp "$C/settings.json" "$C/settings.json.puvodni-$STAMP"
  warn "Původní settings.json odložen jako settings.json.puvodni-$STAMP"
fi
sed -e "s|__HOME__|$HOME|g" -e "s|__JMENO__|$JMENO|g" "$BAL/zara/settings.json" > "$C/settings.json"
ok "settings.json (hooky, oprávnění, identita)"

cp "$BAL"/zara/statusline-*.sh "$C/" 2>/dev/null || true
chmod +x "$C"/statusline-*.sh "$C"/hooks/*.sh "$C"/hooks/*.ts 2>/dev/null || true
ok "statusline"

# ---------------------------------------------------------------- 4. paměť
say "Zakládám paměť"
SLUG="-Users-$(whoami)"
MEMDIR="$C/projects/$SLUG/memory"
mkdir -p "$MEMDIR/archive"
if [ ! -f "$MEMDIR/MEMORY.md" ]; then
  cp "$BAL/zara/memory/MEMORY.md" "$MEMDIR/MEMORY.md"
  ok "prázdný index MEMORY.md ($MEMDIR)"
else
  warn "MEMORY.md už existuje, nechávám být"
fi
cp "$BAL/zara/memory/_sablona-memory.md" "$MEMDIR/" 2>/dev/null || true
mkdir -p "$C/session-memory"
ok "session-memory (checkpointy oken)"

# ---------------------------------------------------------------- 5. wiki
say "Zakládám doménovou wiki"
if [ -d "$HOME/business-wiki" ]; then
  warn "~/business-wiki už existuje, nechávám být"
else
  rsync -a "$BAL/wiki-sablona/" "$HOME/business-wiki/"
  ok "~/business-wiki (prázdná šablona: WIKI.md, index.md, log.md)"
fi

# ---------------------------------------------------------------- 6. projekty
say "Zakládám ~/Projects"
mkdir -p "$HOME/Projects"
if [ ! -f "$HOME/Projects/PROJEKTY.md" ]; then
  cat > "$HOME/Projects/PROJEKTY.md" <<'EOF'
# Moje projekty

Master přehled. Zara ho aktualizuje, kdykoliv se na projektu něco pohne.

Fáze: 💡 nápad → 📐 plán/spec → 🔨 staví se → 🧪 testuje se → ✅ hotovo/běží → ⏸️ pauza → 🗄️ archiv

| Projekt | Cesta | Fáze | Co je hotové / co dál | Aktualizováno |
|---|---|---|---|---|
EOF
  ok "PROJEKTY.md"
fi

# ---------------------------------------------------------------- 7. rozšíření
say "Instaluju rozšíření"
for r in advisor-cli claude-telefon claude-memory-stack; do
  if [ -d "$HOME/Projects/$r" ]; then
    warn "~/Projects/$r už existuje, přeskakuju"
  else
    rsync -a "$BAL/rozsireni/$r/" "$HOME/Projects/$r/"
    find "$HOME/Projects/$r" -type f \( -name '*.ts' -o -name '*.sh' -o -name '*.plist' -o -name '*.example' -o -name '*.md' \) -print0 \
      | xargs -0 perl -pi -e "s|__HOME__|$HOME|g" 2>/dev/null || true
    ok "~/Projects/$r"
  fi
done

# ---------------------------------------------------------------- hotovo
cat <<EOF

────────────────────────────────────────────────────────────
 Hotovo. Zara je nainstalovaná.
────────────────────────────────────────────────────────────

 Co teď:

 1) Otevři nové okno terminálu a napiš:   claude
 2) Řekni jí:  "Přečti si skills/PAI/SKILL.md a doptej se mě, kdo jsem."
    Vyplní si tvůj profil sama (skills/PAI/USER/).
 3) Klíče k placeným službám (jen ty, které chceš) dej do ~/.zshrc:
       export ANTHROPIC_API_KEY=...     # advisor (druhý názor)
       export OPENROUTER_API_KEY=...    # fusion (panel modelů)
       export OPENAI_API_KEY=...        # přepisy videí, titulky
       export FAL_KEY=...               # generování fotek
    Potom: source ~/.zshrc

 Návod krok za krokem:  NAVOD.md
 Co všechno umí:        docs/CO-UMI.md
 Záloha starého stavu:  ${BACKUP:-nic tu nebylo}

EOF
