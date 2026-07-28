---
name: captions
description: Captions / titulkovací nástroj — přepis videa do SRT, JSON nebo plain textu přes OpenAI Whisper. Použij když uživatelka nebo tým agentů agent (hlavní agent, Operativec, Síťař Social) potřebuje vytáhnout titulky / transkript z lokálního video souboru pro reels, shorts, marketing. Spouští se i při slovech "udělej titulky", "vygeneruj SRT", "přepiš tohle video", "potřebuju titulky pro reel", "transkript z lokálního souboru".
---

# Captions Skill

Wrapper kolem `~/Projects/ai-captions-app` pro programatický přístup k titulkovacímu pipeline. Tenhle skill je primárně pro tým agentů agenty — když potřebují přepis videa bez otvírání web UI.

## Kdy použít TENHLE skill (vs. transcript skill)

- **`captions` skill** → lokální video soubor (`.mp4`, `.mov` atd.) na disku, výstup SRT/JSON pro postprodukci.
- **`transcript` skill** → URL videa z YouTube / Insta / TikTok / X / FB. Stáhne a přepíše do CZ.

Pokud máš URL → použij `transcript`. Pokud máš soubor → použij `captions`.

## Postup

1. **Ověř, že existuje OPENAI_API_KEY** v env (uživatelka ho má v `~/.zshrc`).

2. **Spusť CLI** z adresáře projektu:
   ```bash
   cd ~/Projects/ai-captions-app && \
   bun run scripts/transcribe-cli.ts "<absolutní-cesta-k-videu>" --format=srt --out=<cílový-soubor>
   ```

   Formáty:
   - `--format=srt` (default) → standardní SRT pro CapCut, Premiere, Resolve, YouTube uploads
   - `--format=json` → strukturovaný transcript se segmenty + word-level timestampy
   - `--format=txt` → plain text bez časů (pro shrnutí, repurposing do postu)

   Když vynecháš `--out`, výstup jde na stdout.

3. **Pokud uživatelka chce styling / burn-in titulky do videa** → odkaž ji na web UI:
   ```
   open http://localhost:3000  # po spuštění bun dev
   ```
   Burn-in (vypálené titulky do videa) zatím dělá jen browser FFmpeg.wasm — CLI verze ne.

## Příklady volání

```bash
# Reel z iPhone → SRT pro CapCut
cd ~/Projects/ai-captions-app && \
  bun run scripts/transcribe-cli.ts ~/Movies/reel-2026-04-30.mov \
  --format=srt --out=~/Movies/reel-2026-04-30.srt

# Krátký podcast → plain text pro newsletter
cd ~/Projects/ai-captions-app && \
  bun run scripts/transcribe-cli.ts ~/Downloads/rozhovor.mp4 \
  --format=txt --out=/tmp/rozhovor.txt

# Pro pipeline → JSON se segmenty
cd ~/Projects/ai-captions-app && \
  bun run scripts/transcribe-cli.ts ~/Movies/video.mp4 --format=json
```

## Cena

Whisper-1: ~0.006 USD / minuta. CLI vypisuje odhadovanou cenu na konci běhu (stderr).

## Limity

- Whisper API limit: 25 MB audio. CLI extrahuje audio na 64 kbps mono 16 kHz mp3 → ≈ 25 MB ≈ 50 minut. Delší video rozsekat ručně.
- Čeština jako defaultní jazyk (`language: "cs"`). Pro EN/jiné upravit prompt v `route.ts` / přidat flag.

## Pro uživatelka / human use

Pokud chceš plný workflow (styling, watermark, vypálení titulků, export) → web UI:
```bash
cd ~/Projects/ai-captions-app && bun dev
# pak http://localhost:3000
```
