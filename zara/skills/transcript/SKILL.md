---
name: transcript
description: Přepis a překlad videa do češtiny z jakékoliv platformy — YouTube, Instagram Reels, YouTube Shorts, TikTok, Twitter/X, Facebook, Vimeo a stovek dalších. Použij tento skill vždy, když uživatel pošle URL videa a chce přepis, transcript, titulky nebo překlad. Spouštěj i při slovech jako "přepiš", "přelož video", "co říká toto video", "napiš transcript", "přepis videa", "chci text z videa", nebo když uživatel pošle odkaz na video s implicitním zájmem o jeho obsah.
---

# Transcript Skill

Tento skill přepisuje a překládá obsah videí do čistě formátované češtiny.

## Postup

1. **Extrahuj URL** z uživatelovy zprávy.

2. **Spusť skript** z adresáře `/tmp`:
   ```bash
   python ~/.claude/skills/transcript/scripts/transcript.py "<URL>"
   ```

3. **Zobraz výsledek** uživateli hezky formátovaný v chatu (bez ukládání do souboru).

## Jak skript funguje

Skript se pokusí postupně:
1. Stáhnout existující titulky přes `yt-dlp` (rychlé, nejlepší kvalita)
2. Pokud titulky nejsou → stáhne audio a přepíše přes OpenAI Whisper API
3. Přeloží vše do češtiny přes GPT-4o
4. Vrátí čistý text bez technických artefaktů

## Požadavky

- `yt-dlp` (nainstaluj: `pip install yt-dlp`)
- `openai` Python knihovna (nainstaluj: `pip install openai`)
- `OPENAI_API_KEY` v environment variables

## Formát výstupu

Zobraz transcript takto:

---
**Transcript: [název videa nebo URL]**

[čistý přepis v češtině, rozdělený do odstavců]

---

Pokud transcript je delší než 1000 slov, nabídni uživateli shrnutí klíčových bodů pod přepisem.
