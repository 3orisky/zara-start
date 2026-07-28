---
name: heygen-hyperframes
description: AI video s mluvícím avatarem od HeyGen (HyperFrames). USE WHEN uživatelka říká "heygen", "hyperframes", "ai avatar", "ať to řekne někdo místo mě", "anglická verze videa", "video s tváří" nebo chce vytvořit profesionální video bez nahrávání kamerou.
---

# HeyGen HyperFrames

HeyGen (https://www.heygen.com) je AI platforma na video s mluvícím avatarem. **HyperFrames** je novější produkt (zmínil ho Mathias na kurzu, vyšel cca 2026-04), který má být lepší než Remotion na komplexní video s avatarem.

## Kdy použít
- Profesionální video do 5 minut s mluvící tváří
- Vícejazyčné varianty (jedno video → 30 jazyků)
- Avatar přesně mluví, co napíšeš (text-to-video)
- Klonování vlastního hlasu/tváře (custom avatar)
- Video kurzy, intro/outro, reklamní clipy

## Kdy NEpoužívat
- Krátká reels/shorts bez tváře → `remotion` (rychlejší a levnější)
- Skutečné svědectví od reálné osoby → klasické natáčení
- Když potřebuješ emoce a charisma → AI avatar je pořád "uncanny valley"

## Quick start (HyperFrames)
1. Účet na heygen.com (Lukáš zmínil že je to placené)
2. Vytvoř custom avatara (uživatelčin obličej + hlas) — 1× setup
3. Workflow:
   - Napiš script (text)
   - Vyber avatar
   - Vyber jazyk + voice clone
   - Generuj
   - Stáhni MP4

## Klíčové features HyperFrames vs běžný HeyGen
- **Komplexnější scény** — víc kamer, přechody, B-roll
- **Lepší lip-sync** — sync rtu s češtinou
- **Multi-character** — víc avatarů v jednom videu
- **Programmable** — víc kontroly nad pohybem/gestikulací

## API přístup (pro automatizaci)
HeyGen má API pro programmatic generování:
```python
import requests

response = requests.post(
    "https://api.heygen.com/v2/video/generate",
    headers={"X-Api-Key": HEYGEN_API_KEY},
    json={
        "video_inputs": [{
            "character": {"type": "avatar", "avatar_id": "tvuj_avatar_id"},
            "voice": {"type": "text", "input_text": "Tvůj script...",
                      "voice_id": "tvuj_voice_id"}
        }]
    }
)
```

## Tipy z kurzu
- **HyperFrames > Remotion** pokud chceš avatar s mluvením (Mathias říkal "ještě lepší než Remotion")
- **Zařadit do Cloud Code workflow** — agent napíše script → API call → hotové video
- Drahé, ale ušetří hodiny natáčení/střihu

## Vztah k ostatním skillům
- `remotion` — alternativa pro video bez avatara
- `transcript` — z videa udělej přepis, z přepisu udělej HyperFrames v jiném jazyce
- `Art` — generuj B-roll obrázky/grafiky pro pozadí

## uživatelčin use case nápad
- Newsletter nahrazený krátkým video shrnutím (30s, uživatelčin AI avatar)
- Anglická verze "Poslání" webináře — HyperFrames přeloží + namluví
- "Tvář CRM" — uživatelčin avatar vede klienta CRM tutoriálem

## Další zdroje
- HeyGen docs: https://docs.heygen.com
- HyperFrames info: zatím spíš v promo materiálech, dokumentace se rozjíždí
- Kreditový systém: každé video stojí kredity podle délky
