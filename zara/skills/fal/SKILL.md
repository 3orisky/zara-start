---
name: fal
description: Generování a editace fotek přes fal.ai jako náhrada Freepik Spaces (které neumíme ovládat přes API). Text→foto, edit s referencí, konzistentní postava/produkt napříč fotkami a navazující řetězení (výstup jedné fotky = vstup další). USE WHEN uživatelka říká "vygeneruj přes fal", "udělej fotku z promptu", "fotka z reference", "konzistentní postava/avatar", "navazující fotky", "stejný produkt v jiné scéně", "nahraď mi Freepik", "nano banana", nebo posílá referenční fotku a chce z ní variace/úpravy.
---

# fal skill

Náhrada Freepik Spaces přes fal.ai API. Jeden Bun CLI: `~/.claude/skills/fal/client.ts`.
Hlavní engine = **Nano Banana** (Gemini image) — drží konzistenci postavy/produktu a umí řetězení.

## Auth
Klíč `$FAL_KEY` v `~/.zshrc` (formát `id:secret`). Header `Authorization: Key $FAL_KEY`.
Endpoint: `https://fal.run/<model>` (synchronní, blokuje do hotova — žádný polling).
**Klíč nikdy necommitovat.**

## Příkaz

```
bun ~/.claude/skills/fal/client.ts gen --prompt "..." \
    [--model nano|nano-pro|flux|seedream] \
    [--ref <url|soubor> ...] [--ar 3:4] [--n 1] [--out <soubor|adresář>]
```

- **bez `--ref`** → text→foto
- **s `--ref`** → edit / kompozice (Nano Banana edit): konzistentní postava, produkt do nové scény
- výstup: cesty k uloženým souborům (default `~/Downloads/fal/`), jedna na řádek
- `--ref` lze opakovat (víc referencí); přijímá URL i lokální soubor (lokální se pošle jako data URI)

## Modely (`--model`)

| alias | použij na |
|---|---|
| `nano` *(default s referencí)* | konzistence postavy/produktu, edit, řetězení |
| `nano-pro` | Nano Banana 2 / Gemini 3 Pro Image — nejvyšší kvalita |
| `flux` *(default bez reference)* | čistý fotorealistický text→foto |
| `seedream` | vysoká kvalita + text-guided edit |

## Recepty

**Text → foto**
```
bun client.ts gen --prompt "cozy scandinavian living room, morning light" --model flux --ar 3:2
```

**Konzistentní postava z reference** (avatar/uživatelka napříč fotkami)
```
bun client.ts gen --prompt "same woman, now sitting at a wooden desk writing in a journal, warm light" \
    --ref ~/Photos/portret.jpg --out ~/Downloads/fal/portret-desk.png
```

**Produkt do nové scény** (brand vizuál)
```
bun client.ts gen --prompt "this product on a marble kitchen counter, soft daylight, lifestyle shot" \
    --ref ~/Photos/produkt.png --model nano-pro
```

**Navazující řetězení** (jako node canvas) — výstup předáš jako další `--ref`:
```
bun client.ts gen --prompt "the same scene, now at golden hour" --ref ~/Downloads/fal/krok1.png --out krok2.png
bun client.ts gen --prompt "the same scene, add a person walking by" --ref ~/Downloads/fal/krok2.png --out krok3.png
```

**Více referencí najednou** (postava + prostředí)
```
bun client.ts gen --prompt "put this woman into this room, natural integration" \
    --ref ~/Photos/portret.jpg --ref ~/Photos/room.jpg
```

## Pozn.
- Prompty pro Nano Banana piš v **angličtině** + popisně ("same woman", "keep her face", "this product").
- Při řetězení vždy v promptu zdůrazni co se má zachovat ("same person/product/composition").
- Aspect ratio respektuje `nano`/`seedream`; `flux` ho ignoruje (řeš velikostí v promptu).
- Po vygenerování klidně rovnou ukaž obrázek přes Read tool.
