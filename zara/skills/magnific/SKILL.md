---
name: magnific
description: Magnific API (dříve Freepik API) — generování a editace obrázků (Mystic, Flux 2, Seedream, Nano Banana), upscaling (Creative/Precision/Sparkle/Sharpy/Illusio), video (Kling 2.6, Hailuo, WAN, Seedance, OmniHuman), audio (Music, SFX, Audio Isolation), background removal, relight, style transfer, AI image classifier. USE WHEN uživatelka říká "magnific", "freepik api", "upscale tohle", "vygeneruj přes magnific", "udělej reel přes kling/hailuo/seedance", "relight produktovku", "talking avatar z fotky", nebo "remove background přes API".
---

# Magnific API skill

Magnific je AI creative platform vlastněná Freepikem (rebrand 2026). Sjednocené API pro image/video/audio generaci a editaci.

## Auth

API klíč v `~/.zshrc` → `$MAGNIFIC_API_KEY` (i v Keychain pod `MAGNIFIC_API_KEY`).
Header: `x-magnific-api-key: $MAGNIFIC_API_KEY` (legacy `x-freepik-api-key` taky funguje).
Base URL: `https://api.magnific.com`

## Async pattern (univerzální)

1. **POST** `/v1/ai/<model>` s JSON body → vrátí `{ task_id, status: "CREATED" }`
2. Buď pošli `webhook_url` v body → push notifikace na callback
3. Nebo polluj **GET** `/v1/ai/<model>/{task_id}` dokud `status != "COMPLETED"`

Statusy: `CREATED → IN_PROGRESS → COMPLETED` / `FAILED`.

## Endpointy (cheatsheet)

### Image Generation
| Model | Endpoint | Použij na |
|---|---|---|
| Mystic | `/v1/ai/mystic` | nejvyšší kvalita, brand vizuály |
| Flux 2 Pro | `/v1/ai/flux-2-pro` | T2I + I2I, fotorealismus |
| Flux 2 Turbo / Klein | `/v1/ai/flux-2-turbo` / `flux-2-klein` | rychlé iterace, Klein = sub-second |
| Flux Pro 1.1 | `/v1/ai/flux-pro-v1-1` | osvědčená kvalita |
| Hyperflux | `/v1/ai/hyperflux` | real-time |
| Seedream 4.5 | `/v1/ai/seedream-v4-5` | fast + vysoká kvalita |
| Z-Image Turbo | `/v1/ai/z-image-turbo` | rychlé iterace |
| Runway T2I | `/v1/ai/runway` | runway-style estetika |
| Nano Banana | `/v1/ai/nano-banana` | edit/composite |
| Imagen | `/v1/ai/imagen` | Google Imagen |

### Image Editing & Upscale
| Funkce | Endpoint | Klíčové parametry |
|---|---|---|
| **Upscaler Creative** | `/v1/ai/image-upscaler` | `scale_factor: 2x/4x/8x/16x`, `engine: magnific_sparkle/sharpy/illusio`, `creativity/hdr/resemblance/fractality: -10..10`, `optimized_for: soft_portraits/films_n_photography/...` |
| Upscaler Precision | `/v1/ai/image-upscaler-precision` | věrné zvětšení bez halucinací |
| Relight | `/v1/ai/relight` | přesvícení produktovek |
| Style Transfer | `/v1/ai/image-styletransfer` | přenos stylu mezi obrázky |
| Remove Background | `/v1/beta/remove-background` | alpha kanál |
| Image Expand (outpaint) | `/v1/ai/flux-pro` | rozšíření rámu |
| Seedream 4.5 Edit | `/v1/ai/seedream-v4-5-edit` | text-guided edit |

### Video
| Model | Endpoint | Specialita |
|---|---|---|
| Kling 2.6 Pro | `/v1/ai/kling-v2-6-pro` | I2V, nejvyšší kvalita motion |
| Kling Motion Control | `/v1/ai/kling-motion-control` | precise camera/motion |
| Hailuo 2.3 1080p | `/v1/ai/minimax-hailuo-2-3-1080p` | komplexní prompty |
| WAN 2.5/2.6 T2V/I2V | `/v1/ai/wan-2-5-t2v-1080p` / `wan-v2-6-1080p` | open-source kvalita |
| Seedance Pro 1080p | `/v1/ai/seedance-pro-1080p` | ByteDance, plynulý motion |
| Runway Gen4 Turbo | `/v1/ai/runway-gen4-turbo` | rychlé video |
| Runway Act Two | `/v1/ai/runway-act-two` | character konzistence |
| OmniHuman 1.5 | `/v1/ai/omnihuman-v1-5` | **audio-driven talking head** |
| PixVerse V5 | `/v1/ai/pixverse-v5` | VFX efekty |
| LTX 2.0 Pro | `/v1/ai/ltx-2-pro` | rychlé generování |

### Audio
- Music Generation: `/v1/ai/music-generation`
- Sound Effects: `/v1/ai/sound-effects`
- Audio Isolation: `/v1/ai/audio-isolation`

### Utility
- AI Image Classifier (detekce AI obsahu)
- Stock Content API (foto/video/ikony/templaty)

## Klient (TypeScript)

Helper v `client.ts` (vedle SKILL.md). Použití:

```ts
import { magnific } from "~/.claude/skills/magnific/client.ts";

// Upscale 4x s Sparkle enginem
const task = await magnific.create("image-upscaler", {
  image: base64,
  scale_factor: "4x",
  engine: "magnific_sparkle",
  creativity: 2,
  optimized_for: "films_n_photography",
});
const result = await magnific.waitFor(task.task_id, "image-upscaler");
```

## Bash quickstart

```bash
# Generuj Mystic
curl -X POST https://api.magnific.com/v1/ai/mystic \
  -H "x-magnific-api-key: $MAGNIFIC_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"luxusní podnikatelka v modrozlatém světle, fotorealistické"}' \
  | jq .

# Check status
curl -H "x-magnific-api-key: $MAGNIFIC_API_KEY" \
  https://api.magnific.com/v1/ai/mystic/<TASK_ID> | jq .
```

## Pipeliny pro tvůj brand

1. **Brand vizuály** → Mystic + brand barvy (#104871/#FCAF3B) → Upscaler Sparkle 4x
2. **Reel z fotky** → Mystic (T2I) → Seedance/Kling 2.6 (I2V) → Music Generation
3. **Talking avatar** → fotka + audio → OmniHuman 1.5 → 1080p video
4. **Produktovka** → fotka → Relight → Remove BG → Image Expand
5. **Newsletter header** → Flux 2 Klein (rychlé) → Upscaler Precision 2x
6. **Detekce AI obsahu** → AI Classifier pro archiv

## Bezpečnost

- API klíč JEN v `$MAGNIFIC_API_KEY`, nikdy v kódu nebo gitu
- Klíč je placený zdroj — kontroluj `task_id` cache, abys nepouštěla stejnou úlohu znovu
- Pro async produkční použití preferuj `webhook_url` před polovacím cyklem

## Reference

- Docs: https://docs.magnific.com
- llms-full: https://docs.magnific.com/llms-full.txt
- Pricing: https://www.freepik.com/api/pricing
