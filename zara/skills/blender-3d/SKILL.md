---
name: blender-3d
description: 3D modelování přes Blender pomocí Cloud Code + Blender MCP server. USE WHEN uživatelka říká "blender", "3d model", "vytvoř 3D objekt", "3d tisk návrh", nebo chce generovat 3D scény / objekty přes přirozený jazyk.
---

# Blender 3D via MCP

Blender (open-source 3D nástroj) má MCP server, takže Cloud Code dokáže ovládat Blender — vytvářet objekty, materiály, scény, a renderovat.

## Setup (jednorázový)

### 1. Nainstaluj Blender MCP plugin do Blenderu
```
1. Stáhni Blender MCP plugin z https://github.com/ahujasid/blender-mcp
2. V Blenderu: Edit → Preferences → Add-ons → Install
3. Vyber stažený .zip
4. Aktivuj plugin (zaškrtni)
5. V N-panelu (klávesa N) najdi sekci "Blender MCP" a klikni Connect
```

### 2. Přidej MCP server do Cloud Code
Buď do `~/.claude/mcp.json` nebo do `<project>/.mcp.json`:
```json
{
  "mcpServers": {
    "blender": {
      "command": "uv",
      "args": ["run", "blender-mcp"]
    }
  }
}
```

(Lukáš v lekci 5 ukázal `uv` jako preferovaný spouštěč)

### 3. Test
```bash
cd <projekt>
claude
```
V Cloud Code:
```
"Create a simple house with furniture inside"
```

## Co umí

- **Tvorba primitivů** — krychle, koule, válce, plane, kamera, světla
- **Boolean operace** — sjednocení, průnik, odečtení
- **Materiály** — barvy, textury (zatím omezeně)
- **Renderování** — screenshot scény pro vizuální kontrolu
- **Modifikátory** — subdivision, mirror, array, atd.

## Limitace (z Lukášovy demo)

- **AI dělá moc polygonů** — pro 3D tisk / hry je to neefektivní (Slovák poznámka v lekci)
- **Estetická kvalita je base-level** — agent nedokáže "krásnou" kompozici, jen funkční
- **Komplexní animace** — zatím spíš ruční práce
- **Texturing / UV mapping** — agent to neumí dobře

## Workflow tipy

### Pro 3D tisk
```
"Create a phone holder for iPhone 15 Pro:
- Brand: zlatá #FCAF3B (jen estetické vodítko, není nutné)
- Stěny min 2mm tlustá
- Vejde se do držáku auta
- Plochá zadní stěna pro nálepku
- Render z 3 úhlů pro kontrolu"
```

### Pro vizualizaci interiéru
```
"Vytvoř obývací pokoj 5x4m:
- Pohovka u stěny vpravo
- TV stojan naproti
- Stůl s židlemi vlevo
- Okno na severní stěně
- Render z perspektivy někoho, kdo vchází"
```

### Iterativní práce
Místo "udělej hned dokonalé" pracuj inkrementálně:
1. "Udělej základní strukturu domu" → render → check
2. "Přidej okna a dveře" → render → check
3. "Přidej nábytek do obýváku" → render → check

## Kdy použít vs alternativy

| Use case | Nástroj |
|----------|---------|
| Custom 3D model na míru | **Blender MCP** ✅ |
| Image → 3D model | Microsoft TRELLIS (image-to-3D) |
| Text → 3D model přímo | Tencent Hunyuan-3D |
| Drone scan budovy → 3D | Photogrammetry (Reality Capture) |
| Stávající 3D modely | Sketchfab, TurboSquid |

## uživatelčin use case z lekce 5
Imagineer (3D tisk služba) — uživatel nahraje obrázek nebo prompt, AI generuje 3D model, posílá na tisk.
- Pro tohle by se hodily kombinace: TRELLIS / Hunyuan pro image→3D + Blender pro post-processing
- Po-processing kontroluje min tloušťku stěn, manifoldness, atd.

## Vztah k ostatním skillům
- `lukas-marketplace` — pokud máš Lukášovy plug-iny, tam jsou skilly pro spojené use case
- `Art` — pro 2D obrázky
- `office-creative-workflow` — když chceš 3D vizualizaci do prezentace
