---
name: langflow
description: Vizuální drag-and-drop workflow editor postavený na Pythonu, alternativa k N8N. USE WHEN uživatelka říká "langflow", "vizuální workflow", "drag drop", "alternativa k n8n", "flow editor", nebo chce dát manažerovi/non-IT člověku vizuální nástroj na orchestraci AI agentů.
---

# Langflow

Open-source vizuální editor workflows postavený na Pythonu, MIT license. Alternativa k N8N s velkou výhodou: každý node je Python kód, který můžeš upravit.

**Repo:** https://github.com/langflow-ai/langflow
**Nesouvisí s:** LangChain, LangGraph (úplně jiné firmy navzdor podobnému jménu)

## Proč Langflow oproti N8N
- **N8N:** drag-drop, předpřipravené nody, **NEMŮŽEŠ** je editovat
- **Langflow:** drag-drop + každý node je Python klása, **MŮŽEŠ** ji editovat (pravý klik → Edit Code)
- IT týmy můžou doplnit jakýkoliv vlastní node
- Manažer vidí proces vizuálně (drag-drop UI)

Lukáš v lekci 5 zmínil, že Langflow rychle dohání N8N v popularitě (z 30k na 148k GitHub stars za rok).

## Setup (Docker, jednorázově)

```bash
docker run -d \
  --name langflow \
  -p 7860:7860 \
  -v langflow-data:/app/data \
  langflowai/langflow:latest
```

Otevři: http://localhost:7860

Pro **uživatelčin Hetzner VPS** by šlo nasadit jako další docker container vedle n8n (ale neсahej na současné kontejnery — viz `reference_hetzner_server.md`).

## Klíčové koncepty

### Triggery (jak se workflow spouští)
- **Chat Input** — uživatelka napíše text v chatu
- **Webhook** — externí systém zavolá HTTP endpoint
- **Schedule** — cron job (každý den v 7 ráno)
- **Channel listener** — sleduje Slack / Discord / atd.

### Nody (krabičky v procesu)
Předpřipravené:
- LLM volání (Anthropic Claude, OpenAI, Mistral, atd.)
- Databáze (Postgres, Redis, MongoDB, vector DBs)
- Web scraping (DuckDuckGo, Tavily)
- Integrace (Salesforce, Gmail, GitHub, Slack)
- Vector DBs (Qdrant, Pinecone, Supabase)

### Custom nody (uživatelčin výhoda)
Pravý klik → Edit Code → upravíš Python klásu:

```python
from langflow.custom import Component
from langflow.io import MessageTextInput, Output

class uživatelčinCustomNode(Component):
    display_name = "tvůj AI produkt processing"
    description = "Custom logika pro tvůj AI produkt integraci"

    inputs = [
        MessageTextInput(name="input_text", display_name="Vstupní text"),
    ]
    outputs = [
        Output(display_name="Výstup", name="result", method="process"),
    ]

    def process(self) -> str:
        # Tvoje vlastní Python logika
        return f"Zpracováno: {self.input_text}"
```

## Use case pro uživatelčin business

### Příklad 1: Newsletter pipeline
```
[Schedule: každý čtvrtek 9:00]
    ↓
[Vector DB: vytáhni inspirace z business-wiki]
    ↓
[Custom node: uživatelčin styl psaní (z memory se stylem psaní)]
    ↓
[LLM: Claude Opus napíše draft]
    ↓
[Slack: pošli Andree Honzové ke schválení]
```

### Příklad 2: Klientka triage
```
[Webhook: nový e-mail v ty@tvujweb.cz]
    ↓
[LLM: klasifikuj typ (mentoring/spolupráce/dotaz/spam)]
    ↓
[Switch node]
    ├─ Mentoring → [Custom: nabídková šablona]
    ├─ Spolupráce → [Notion: vytvoř task pro Andreu]
    └─ Dotaz → [LLM: draft odpovědi]
```

### Příklad 3: Cloud Agent SDK v custom nodu
Můžeš spustit Cloud Code agenta z Langflow nodu:
```python
# V Dockerfile přidat: pip install anthropic claude-agent-sdk
from claude_agent_sdk import query

class CloudAgentNode(Component):
    def process(self):
        result = query(
            prompt=self.input_text,
            cwd="/path/to/project"
        )
        return result
```

## Kdy použít

| Situace | Nástroj |
|---------|---------|
| Programatická orchestrace | **Cloud Agent SDK** (v kódu) |
| Vizuální workflow + manažer chce vidět proces | **Langflow** ✅ |
| Standardní integrace (Slack/Gmail/atd.) | **N8N** nebo Langflow |
| Klient chce sám editovat | **Langflow** (custom nody) |
| Tvůj osobní workflow | **Cloud Agent SDK** (rychlejší) |

## Nevýhody (čeho si všimnout)

- **Nepodporuje** Cloud Agent SDK out-of-the-box — musíš si custom Dockerfile
- Multi-agent patterns (swarm, supervisor) se dělají špatně — orchestraci by se nedělala v UI, ale v jednom custom node
- Pro high-concurrency produkční použití bych volila kód
- Update Docker imagu může rozbít custom nody — verzuj

## Vztah k ostatním skillům
- `n8n` — alternativa, kterou už znáš
- `claude-api` — pro custom Cloud Agent nody
- `composio` — pro 3rd-party OAuth integrace
- `dex-orchestrator` — když chceš jít až do plné automatizace v kódu
