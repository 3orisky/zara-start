# Zara Start

Kompletní mozek pro Claude Code na novém počítači. Jeden balíček, jeden příkaz, hotovo.

Uvnitř je asistentka **Zara** (systém PAI), **99 skillů**, **12 agentů**, **paměťový systém** ve čtyřech vrstvách, šablona doménové wiki a čtyři rozšíření, která si Claude sám neumí přidat.

Osobní data původní majitelky uvnitř nejsou. Všechny profily jsou prázdné šablony, které si Zara při prvním rozhovoru vyplní s tebou.

---

## Instalace (10 minut)

Potřebuješ Mac, nainstalovaný [Claude Code](https://claude.com/claude-code) a předplatné Claude.

```bash
git clone <adresa-tohoto-repozitáře> ~/zara-start
cd ~/zara-start
bash install.sh
```

Instalátor se zeptá jen na tvoje jméno. Když už nějaké `~/.claude` máš, nejdřív ho zazálohuje a nic ti nepřepíše bez zálohy.

Podrobně a s obrázky myšlení: **[NAVOD.md](NAVOD.md)**

---

## Co se nainstaluje

| Kam | Co |
|---|---|
| `~/.claude/CLAUDE.md` | globální pravidla (bezpečnost, styl psaní, konvence projektů) |
| `~/.claude/settings.json` | hooky, oprávnění, identita asistentky |
| `~/.claude/skills/` | 99 skillů (dovedností) |
| `~/.claude/agents/` | 12 agentů (Engineer, Architect, Designer, Research…) |
| `~/.claude/hooks/` | automatika: paměť, checkpointy, bezpečnostní kontrola |
| `~/.claude/projects/…/memory/` | prázdná paměť + index |
| `~/business-wiki/` | prázdná šablona znalostní báze o tvém podnikání |
| `~/Projects/` | pracovní složka + `PROJEKTY.md` (master přehled) |
| `~/Projects/advisor-cli` | rozšíření: druhý názor od silnějšího modelu |
| `~/Projects/claude-telefon` | rozšíření: ovládání Clauda z mobilu přes Telegram |
| `~/Projects/claude-memory-stack` | dokumentace paměťového systému |

---

## Struktura balíčku

```
zara-start/
├── install.sh          ← spouštíš tohle
├── NAVOD.md            ← krok za krokem, česky, bez zkratek
├── zara/               ← všechno, co jde do ~/.claude
├── wiki-sablona/       ← prázdná doménová wiki
├── rozsireni/          ← advisor-cli, claude-telefon, claude-memory-stack
└── docs/
    ├── CO-UMI.md       ← přehled skillů a agentů
    └── KLICE.md        ← které API klíče na co jsou a kde je vzít
```

---

## Co uvnitř **není**

- Žádné API klíče. Ty si doplníš vlastní (viz [docs/KLICE.md](docs/KLICE.md)).
- Žádná osobní paměť, žádné memories, žádná historie konverzací.
- Žádný obsah wiki. Jen prázdná kostra a pravidla, jak ji plnit.
- Skilly navázané na konkrétní podnikání původní majitelky.

---

## Licence a sdílení

Privátní balíček. Nesdílej dál bez domluvy s tím, kdo ti ho dal.
Součásti třetích stran (PAI od Daniela Miesslera, marketplace skilly) mají vlastní licence.
