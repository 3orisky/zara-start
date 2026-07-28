---
name: office-creative-workflow
description: Workflow pro tvorbu prezentací, PDF, marketingových materiálů, infografik a brand vizuálů přes Cloud Code + Gamma + Canva + Freepik. USE WHEN uživatelka říká "udělej prezentaci", "vytvoř PDF", "marketing materiál", "slide deck", "vizuál pro IG", "leták", "infografika", "newsletter banner".
---

# Office & Creative Workflow

Kombinuje MCP konektory (Gamma, Canva), online nástroje (Freepik) a Cloud Code agenta na automatizaci vizuálního obsahu.

## Kdy použít
- Prezentace na webinář, kurz, workshop
- Marketing PDF (cenníky, brožury, lead magnety)
- Sociální sítě — IG carousel, Stories, FB posts, LinkedIn vizuál
- Infografiky pro newsletter
- Prodejní stránky, opt-iny
- Brand vizuální identita (logo varianty, brand book)

## Available tools

### MCP konektory (už máš v ~/.claude_ai)
- **Gamma** — AI prezentace, dokumenty, webové stránky, social posts
  - `mcp__claude_ai_Gamma__generate` — nová prezentace
  - `mcp__claude_ai_Gamma__generate_from_template` — z existující šablony
  - `mcp__claude_ai_Gamma__read_gamma` — přečte existující
- **Canva** — kompletní design platform
  - `mcp__claude_ai_Canva__generate-design` / `generate-design-structured`
  - `mcp__claude_ai_Canva__perform-editing-operations` — úpravy v transakci
  - `mcp__claude_ai_Canva__export-design` — PDF/PNG/JPG
  - `mcp__claude_ai_Canva__list-brand-kits` — uživatelčin brand kit

### Existující skilly (kombinuj!)
- `Art` — generování vizuálů (Flux, Nano Banana, GPT-Image)
- `Documents` — zpracování PDF/Word/Excel
- `NotebookLM` — slide decky, infografiky, mind mapy z podkladů
- `transcript` — přepis videa → texty pro vizuály

### Online (uživatelčiny preference)
- **Freepik Spaces** — viz `reference_freepik_spaces.md`, Nano Banana 2 pro brand identity
- **Freepik prompt template** — viz `reference_freepik_prompt_template.md`

## Brand consistency (uživatelka)
**Vždy aplikuj:**
- Barvy: modrá `#104871`, zlatá `#FCAF3B` (primární)
- Doplňkové: béžová `#DABE7D`, terakota `#F37262`
- Logo: White 3D PRŮHLEDNÉ
- Font: **Poppins** (zejména skripta "Podnikatelka")
- Tone of voice: viz tvoje memory se stylem psaní

→ Zdroj: memory `reference_brand_colors.md`

## Decision tree

```
Co potřebuješ?
├── Prezentace pro webinář / kurz / workshop
│   └── Gamma (rychlejší) NEBO Canva (víc kontroly)
├── PDF lead magnet / brožura
│   └── Canva (export to PDF) NEBO Gamma (document mode)
├── IG post / story / carousel
│   └── Canva (templates) NEBO Freepik Spaces (custom)
├── Infografika z dat
│   └── NotebookLM (z podkladů) NEBO Art (mermaid + custom)
├── Brand vizuál (logo, ikony)
│   └── Freepik Spaces s Nano Banana 2 (uživatelčin oblíbený workflow)
├── Slide deck z přepisu / podcastu
│   └── transcript → NotebookLM → slide deck
└── Mluvící video s prezentací
    └── heygen-hyperframes
```

## Workflow šablony

### A) Prezentace na webinář (Gamma)
```
1. Cloud Code:
   "Vytvoř prezentaci na téma 'X' přes Gamma.
   - uživatelčin brand (modrá #104871, zlatá #FCAF3B)
   - 12 slidů
   - Struktura: hook → problém → řešení → příběh → CTA
   - Tone: uživatelčin styl (anaforické opakování, mluvená čeština)"

2. Gamma vygeneruje → uživatelka edituje v Gamma editoru
3. Export PDF / odkaz pro účastníky
```

### B) IG carousel z newsletteru
```
1. Vstup: text newsletteru
2. Cloud Code:
   "Z tohoto newsletteru udělej IG carousel (8 slidů, 1080x1350):
   - Slide 1 = hook (uživatelčin styl)
   - Slide 2-7 = jeden bod = jeden slide
   - Slide 8 = CTA
   - Použij Canva, můj brand kit"
3. Canva MCP generuje → uživatelka schválí → publish
```

### C) Brand vizuál (Freepik)
Použij memory `reference_freepik_prompt_template.md` a `reference_freepik_spaces.md`. Cloud Code napíše prompt, uživatelka ho překopíruje do Freepik Spaces.

### D) Lead magnet PDF
```
1. Vstup: téma + cílovka
2. Cloud Code napíše obsah (8-15 stran, uživatelčin tone)
3. Canva MCP vytvoří layout
4. Export PDF
5. Upload na tvujweb.cz / SmartEmailing
```

## Tipy z kurzu — Lekce 5 (2026-05-10) ✅

### Lukášův marketplace (skill `lukas-marketplace`)
Office plugin obsahuje skilly pro `.docx`, `.pptx`, `.xlsx`, PDF s vysvětlením:
- Jak ovládat XML strukturu PowerPointu (zip → XML → editace)
- Designové guidelines pro různé typy prezentací (korporát/technologie/vzdělání)
- Vizuální QA — agent dělá screenshot a kontroluje overlapy
- XSD schémata pro validaci

### Workflow Imagineer (lekce 5 demo)
Lukáš ukázal celý cyklus pro fiktivní firmu na 3D tisk:
1. `goal.md` s nápadem firmy
2. Generování 3 variant loga (`/image-generation`)
3. Crop loga bez textu — řekni "manipulate with image by Python", **ne** "create new image"
4. Business plan jako `.docx` (přidej "save it into a document" pro jistotu)
5. Prezentace **z toho business plánu** ("create presentation from this business plan")
6. Excel revenue plán s grafy
7. Krátké ad video (8s, Gemini Veo)
8. Vlož video do prezentace

### Workflow novej kontext (Lukášův trik)
Když otevřeš novej Cloud Code session ve **stejné složce**, agent:
- Si přečte `.claude/projects/...` pro kontext minulých konverzací
- Najde předchozí generované soubory přes grep v JSONL
- Funguje, protože všechno je v té složce

### Trápil tě formát PowerPointu? (z diskuse)
- Standardní AI v ChatGPT formátování dokumentů **nezvládá** — nemá designové guidelines
- Skilly to opravují tím, že popisují konkrétní designové vzory
- Pro 100% kontrolu: vytvoř Google Docs / PowerPoint **template** ručně, do něj pak Cloud Code vkládá jen text a nadpisy
- uživatelčin pattern: připrav header/footer ručně, AI generuje jen MD obsah → vlož

### Update sekvence pluginů (důležité!)
Po každé úpravě skillu/pluginu:
1. `/plugin marketplace update <my-marketplace>`
2. `/plugin reload`
3. **Restartuj Cloud Code** (jinak používá cache)
4. Pokud stále nefunguje → zeptej se přímo "proč nepoužíváš novou verzi?" — viz `plugin-troubleshooting`

### Pravidla pro accepteble result
Lukášův pragmatický přístup:
- **Nechtěj 100%** prezentaci — agent ti udělá 80%, zbytek doděláš ručně
- Drobné posuny textů, mírně velký font → oprav v Libre/PowerPointu sám
- AI iterace na "tady je text moc velký, oprav to" je dražší než ruční oprava
- **Výjimka:** TED Talk / důležitá prezentace → tam si dej záležet

### Reveal.js alternativa
Pokud máš problémy s PPTX formátem, můžeš Cloud Code říct:
"Udělej prezentaci v Reveal.js" — to je HTML/JS prezentace, agent ji píše lépe než XML PowerPointu. Ale nesdílí se jako PPTX → spíš pro tvoji vlastní prezentaci.

## uživatelčin existující workflow (z memory)
- **Newsletter** - přepis z audia → draft
- **Inspirační banka** — `business-wiki/concepts/inspiracni-zdroje.md` (Maroš Vago atd.)
- **Obsahový styl** — žádný markdown, mluvená čeština, anaforické opakování
- **Před každou kampaní** — projít prodeje 2025 (`project_sales_analysis_2025.md`) pro kontext

## Vztah k ostatním skillům
- `Art` — generování obrázků (volá se BY tímto workflow)
- `NotebookLM` — slide decky z velkých zdrojů (knihy, podcasty)
- `Documents` — když uživatelka pošle PDF / Word a chce z něj udělat něco jiného
- `remotion` / `heygen-hyperframes` — video varianty
- `composio` — pokud chce automatizaci s Notion/Slack/atd.
