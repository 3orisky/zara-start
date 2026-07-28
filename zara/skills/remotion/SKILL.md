---
name: remotion
description: Programatická tvorba videa pomocí React komponent. USE WHEN uživatelka říká "remotion", "udělej short", "vytvoř reel", "krátké video do 60s" nebo chce automatizovaně generovat YouTube Shorts, Instagram Reels, TikTok videa pomocí kódu místo Premier/CapCut.
---

# Remotion — Programatic Video

Remotion (https://www.remotion.dev) je framework, kterým tvoříš videa jako React komponenty. Každý frame = JSX. Cloud Code přes ni dokáže napsat celé video script-stylem.

## Kdy použít
- YouTube Shorts / Instagram Reels / TikTok (10-60 sekund)
- Datově řízená videa (graf změn, statistiky, tickery)
- Šablonová videa (jeden template, mnoho variant — např. promo video pro každý produkt)
- Lyric videa, vzdělávací clipy s animacemi
- Když chceš, aby AI generovala 50 variant videa pro A/B test

## Kdy NEpoužívat
- Mluvené video s tváří (avatar) → použij `heygen-hyperframes`
- Cinematické video s hercem → klasické nástroje (Premier, DaVinci)
- Jednorázové video — overhead setupu se nevyplatí

## Quick start
```bash
# 1. Inicializace projektu
npx create-video@latest my-reel
cd my-reel

# 2. Otevři v Cloud Code
claude

# 3. Cloud Code prompt:
"Vytvoř 30s video pro Instagram Reel:
- Téma: nový produkt 'Dobrý rok'
- Brand barvy: modrá #104871, zlatá #FCAF3B
- Font: Poppins
- Začátek: logo fade-in
- Středek: 3 benefity (animované)
- Konec: CTA 'tvujweb.cz/dobry-rok'
Použij Tailwind a interpolate pro animace."

# 4. Preview
npm start

# 5. Render
npx remotion render
```

## Struktura projektu
```
my-reel/
├── src/
│   ├── Root.tsx          # registruje kompozice
│   ├── MyVideo.tsx       # samotné video (komponenta)
│   └── components/       # rozdělené části
├── public/               # obrázky, audio
└── remotion.config.ts
```

## Klíčové koncepty
- **Composition** — definuje rozměry, FPS, délku
- **Sequence** — kus videa s vlastní časovou osou
- **interpolate()** — animace hodnoty mezi frame X a frame Y
- **useCurrentFrame()** — aktuální frame pro animace
- **spring()** — pružinová animace (přirozené pohyby)

## Tipy od Lukáše (kurz Agentic Engineering)
- **Cloud Code excels** — youtuberi tím vlastně vydělávají, prompt → video
- **Brand consistency** — připrav `theme.ts` s uživatelčinými barvami/fontama, agent pak nemusí přemýšlet
- **Šablony** — když máš základní video, řekni Cloud Code "udělej variantu pro produkt X"
- Funguje skvěle s `Art` skillem — generování obrázků → použití v Remotion

## Vztah k ostatním skillům
- `Art` — generuje obrázky/ilustrace, které pak Remotion vloží
- `heygen-hyperframes` — alternativa pro mluvené video s avatarem
- `transcript` — když chceš lyric video / video s titulky z přepisu
- `YouTubeSearch` — analyzuj viral shorts pro inspiraci, pak vyrob obdobu

## uživatelčina workflow nápad
Pro každý newsletter / podcast epizodu:
1. `transcript` — přepis audia
2. AI vyextrahuje 3 klíčové cytáty
3. `remotion` vyrobí 3 shorts (jeden cytát = jeden short)
4. Auto upload na IG Reels / YouTube Shorts

## Další zdroje
- Docs: https://www.remotion.dev/docs
- Templates: https://www.remotion.dev/templates
- License: free pro 1 člověka, paid pro 3+ ($25/měs Lemmer)
