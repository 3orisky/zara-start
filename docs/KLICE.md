# API klíče: co k čemu je

Zara funguje i úplně bez nich - jede na tvém předplatném Claude. Klíče níž odemykají jednotlivé skilly. Ber je jako doplňky, ne jako podmínku.

Všechny patří do `~/.zshrc` jako `export NAZEV=hodnota`, nikdy do souborů projektu.

| Proměnná | Co odemkne | Kde ji vzít | Placené |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | skill **advisor** - Claude se uprostřed přemýšlení poradí se silnějším modelem | console.anthropic.com | ano, podle spotřeby |
| `OPENROUTER_API_KEY` | skill **fusion** - stejnou otázku dostane panel modelů (Claude + GPT + Gemini) a soudce odpovědi sjednotí | openrouter.ai | ano, podle spotřeby |
| `OPENAI_API_KEY` | **transcript**, **captions** - přepis a překlad videí, titulky (Whisper) | platform.openai.com | ano, levné |
| `FAL_KEY` | skill **fal** - generování a editace fotek, konzistentní postava napříč fotkami | fal.ai | ano, podle spotřeby |
| `MAGNIFIC_API_KEY` | skill **magnific** - upscaling, video, audio, odstranění pozadí | magnific.ai | ano |
| `TELEGRAM_BOT_TOKEN` | rozšíření **claude-telefon** - píšeš Claudovi z mobilu | @BotFather v Telegramu | zdarma |
| `HEYGEN_API_KEY` | skill **heygen-hyperframes** - video s mluvícím avatarem | heygen.com | ano |

## Bez klíče, ale s přihlášením

Tyhle skilly jedou přes MCP konektory, které si zapneš přímo v Claude Code příkazem `/mcp`:

- **Gmail, Kalendář, Disk** (gws-* skilly) - přihlášení Google účtem
- **Slack**, **Canva**, **Gamma** - přihlášení v aplikaci
- **Chrome** (skill Browser) - rozšíření Claude in Chrome

## Jak klíč přidat

```bash
open -e ~/.zshrc
```

Na konec souboru přidej řádek, ulož a zavři:

```bash
export OPENAI_API_KEY=sk-tvuj-klic
```

Pak v terminálu:

```bash
source ~/.zshrc
```

Ověření, že se klíč načetl (vypíše jen prvních pár znaků):

```bash
echo "${OPENAI_API_KEY:0:8}…"
```

## Kolik to stojí

Skilly bez klíčů: 0 Kč navíc.
Klíčové skilly platíš podle spotřeby, typicky jednotky až desítky korun za úkol. U každé služby si můžeš nastavit měsíční strop - udělej to hned při zakládání klíče.

## Bezpečnost

- Klíč = heslo. Nikdy ho neposílej v chatu, mailu ani screenshotu.
- Když ti klíč unikne, zneplatni ho v konzoli té služby a vygeneruj nový.
- Nikdy klíč nedávej do frontendového kódu (`VITE_`, `NEXT_PUBLIC_`) - je vidět v prohlížeči.
