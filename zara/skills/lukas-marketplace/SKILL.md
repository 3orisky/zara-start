---
name: lukas-marketplace
description: Lukášův Cloud Marketplace s plug-iny pro office tooling, media, design, devtools. USE WHEN uživatelka říká "lukášův marketplace", "office plugin", "media plugin", "lukas plugins", nebo začíná nový projekt a potřebuje nainstalovat office/media/design schopnosti do Cloud Code.
---

# Lukášův Cloud Marketplace

GitHub repo Lukáše z kurzu Agentic Engineering obsahuje plug-iny, které dávají Cloud Code schopnosti generovat dokumenty, prezentace, obrázky, videa, grafy a další.

**Repo:** Lukáš ho posílá v Discordu kurzu — najít v `project_whitecoding_course.md` nebo se zeptat. Stejné repo funguje i pro Codex (Lukáš to převedl).

## Plug-iny v marketplace

| Plugin | Co umí |
|--------|--------|
| **office** | `.docx`, `.pptx`, `.xlsx`, PDF — vytvoření, editace, čtení |
| **media** | Image gen (Gemini), Video gen (Veo, max 8s), Speech (ElevenLabs), Music, Icons (Lucide), Image sourcing (Unsplash), Graph generation |
| **design** | Estetika frontendů, prompt templates pro obrázky, design reviews |
| **devtools** | `/git-pr`, `/update-readme`, `/update-docs` — automatizace dokumentace |
| **infra** | Kubernetes, Docker, Cloud infrastructure |
| **web-design** | UI komponenty, web design patterns |

## Setup (krok za krokem)

### 1. Přidání marketplace
V Cloud Code:
```
/plugin marketplace add https://github.com/<lukas-repo>.git
```

Nebo lokálně (pokud chceš editovat skilly):
```bash
git clone https://github.com/<lukas-repo>.git ~/cloud-marketplace
```
Pak v Cloud Code:
```
/plugin marketplace add ~/cloud-marketplace
```
**Lokální cesta výhoda:** změny v skillech se projeví okamžitě, nemusíš commitovat na GitHub.

### 2. Nastavení projektu (opt-in)
V `<project>/.claude/settings.json`:
```json
{
  "enabledPlugins": {
    "office@cloud-my-marketplace": true,
    "media@cloud-my-marketplace": true,
    "design@cloud-my-marketplace": true
  }
}
```

**Pravidlo:** Definuj `enabledPlugins` na úrovni projektu, NE na úrovni uživatele. Jinak posíláš tokeny pro všechno do každé session.

### 3. Environment proměnné (zkontroluj `~/.zshrc`)
```bash
export GEMINI_API_KEY="..."          # pro media plugin
export ELEVENLABS_API_KEY="..."      # pro speech generation
export MEDIA_OUTPUT_DIR="..."        # kam ukládat generované soubory
```

## Aktivační příkazy v Cloud Code

```
/image-generation <prompt>
/video-generation <prompt>
/speech-generation <text-file.json>
/graph-generation <description>
/update-readme
/update-docs
/git-pr
```

## Workflow pro uživatelčin "Imagineer" demo (z lekce 5)

```
1. Vytvoř projekt: mkdir company-name && cd company-name
2. Nastav .claude/settings.json (viz výše)
3. Napiš goal.md (popis nápadu)
4. V Cloud Code:
   - "Generate 3 logos for my company" → media plugin
   - "Create business plan as .docx" → office plugin
   - "Create presentation from this business plan" → office plugin
   - "Create revenue plan with charts as .xlsx" → office plugin
   - "Generate short ad video" → media plugin
```

## Známé problémy & řešení

### Plugin nepoužívá nejnovější verzi
1. `/plugin marketplace update <my-marketplace>`
2. Zavři Cloud Code
3. Otevři znovu
4. Pokud stále nefunguje → Lukášův trik: zeptej se přímo "proč nepoužíváš novou verzi?" — Cloud Code přizná, že má cache, a po vyčištění funguje. Viz skill `plugin-troubleshooting`.

### Skill se nespouští
- Description skillu musí obsahovat klíčová slova z promptu
- Pro manuální spuštění používej `/<skill-name>` (lomítko)
- Některé skilly jsou jen "user-triggered" (commands), nikdy nespustí automaticky

## Vztah k ostatním skillům
- `office-creative-workflow` — high-level rozhodování KTERÝ nástroj použít
- `plugin-troubleshooting` — když plugin nefunguje
- `diagram-generation` — Mermaid/D3/DrawIO detail z media pluginu
- `claude-api` — pokud chceš stejné featury programaticky přes SDK
