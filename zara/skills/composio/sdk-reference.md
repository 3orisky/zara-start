# Composio — Reference SDK

## Python SDK

### Instalace
```bash
pip install composio composio-claude-agent-sdk
```

### Inicializace klienta
```python
from composio import Composio

# Explicitní API klíč
composio = Composio(api_key="tvůj_api_klíč")

# Nebo přes proměnnou prostředí COMPOSIO_API_KEY
composio = Composio()
```

### Sessions

Sessions jsou izolované uživatelské kontexty, které poskytují přístup k nástrojům z propojených aplikací.

```python
# Vytvoř session s konkrétními toolkity
session = composio.create(
    user_id="user_123",
    toolkits=["github", "gmail", "slack"]
)

# Získej definice nativních nástrojů (pro předání agent frameworkům)
tools = session.tools()

# Získej URL MCP endpointu (pro MCP-kompatibilní klienty)
mcp_url = session.mcp.url
```

### Nativní nástroje s Claude Agent SDK
```python
from composio import Composio
from composio_claude_agent_sdk import get_tools
import anthropic

composio = Composio()
session = composio.create(user_id="user_123", toolkits=["github"])
tools = session.tools()

client = anthropic.Anthropic()
# Předej nástroje Claudovi jako definice nástrojů
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "Vytvoř GitHub issue s názvem 'Potřeba opravy bugu'"}]
)
```

### MCP integrace
```python
session = composio.create(user_id="user_123", toolkits=["github", "slack"])

# MCP URL lze použít s:
# - Claude Desktop (přidej do claude_desktop_config.json)
# - Cursor
# - Jakýmkoli MCP-kompatibilním klientem
mcp_url = session.mcp.url

# MCP obsahuje Tool Router pro dynamické odkrývání nástrojů
# Agent objevuje dostupné nástroje za běhu — žádná předchozí definice není potřeba
```

### Přímé spuštění akce
```python
# Spusť akci přímo (bez agenta)
result = composio.actions.execute(
    action="GITHUB_CREATE_ISSUE",
    params={
        "owner": "mojaorg",
        "repo": "mojrepo",
        "title": "Nový issue",
        "body": "Popis issue"
    },
    user_id="user_123"
)
```

### Výpis dostupných nástrojů
```python
# Výpis všech nástrojů v toolkitu
tools = composio.tools.list(toolkit="github")
for tool in tools:
    print(f"{tool.name}: {tool.description}")

# Hledej konkrétní nástroje
tools = composio.tools.search("create issue")
```

### Správa propojených účtů
```python
# Výpis propojených účtů uživatele
accounts = composio.connected_accounts.list(
    user_ids=["user_123"],
    statuses=["ACTIVE"]
)

# Získej konkrétní propojený účet
account = composio.connected_accounts.get(connected_account_id="ca_xxx")

# Smaž propojený účet
composio.connected_accounts.delete(connected_account_id="ca_xxx")
```

---

## TypeScript SDK

### Instalace
```bash
npm install composio @composio/claude-agent-sdk
```

### Inicializace klienta
```typescript
import { Composio } from "composio";

const composio = new Composio({ apiKey: "tvůj_api_klíč" });
// Nebo nastav proměnnou COMPOSIO_API_KEY
const composio = new Composio();
```

### Sessions a nástroje
```typescript
// Vytvoř session
const session = await composio.create({
  userId: "user_123",
  toolkits: ["github", "gmail", "slack"]
});

// Získej definice nativních nástrojů
const tools = await session.tools();

// Získej MCP URL
const mcpUrl = session.mcp.url;
```

### Spuštění akcí
```typescript
const result = await composio.actions.execute({
  action: "GITHUB_CREATE_ISSUE",
  params: {
    owner: "mojaorg",
    repo: "mojrepo",
    title: "Nový issue",
    body: "Popis"
  },
  userId: "user_123"
});
```

### S Claude Agent SDK
```typescript
import { Composio } from "composio";
import Anthropic from "@anthropic-ai/sdk";

const composio = new Composio();
const session = await composio.create({
  userId: "user_123",
  toolkits: ["github"]
});
const tools = await session.tools();

const client = new Anthropic();
const response = await client.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  tools,
  messages: [{ role: "user", content: "Vypiš moje GitHub repozitáře" }]
});
```

---

## Běžné názvy nástrojů podle toolkitu

### GitHub
- `GITHUB_CREATE_ISSUE` — Vytvoří nový issue
- `GITHUB_GET_ISSUE` — Získá detail issue
- `GITHUB_CREATE_PULL_REQUEST` — Vytvoří PR
- `GITHUB_MERGE_PULL_REQUEST` — Mergne PR
- `GITHUB_LIST_REPOS` — Vypíše repozitáře
- `GITHUB_STAR_REPO` — Označí repozitář hvězdičkou
- `GITHUB_CREATE_COMMENT` — Přidá komentář k issue/PR

### Gmail
- `GMAIL_SEND_EMAIL` — Odešle email
- `GMAIL_LIST_EMAILS` — Vypíše emaily
- `GMAIL_GET_EMAIL` — Přečte detail emailu
- `GMAIL_CREATE_DRAFT` — Vytvoří koncept emailu
- `GMAIL_REPLY_TO_EMAIL` — Odpoví na email

### Slack
- `SLACK_POST_MESSAGE` — Odešle zprávu do kanálu
- `SLACK_LIST_CHANNELS` — Vypíše kanály
- `SLACK_GET_CHANNEL_HISTORY` — Přečte zprávy v kanálu
- `SLACK_SEND_DIRECT_MESSAGE` — Odešle přímou zprávu
- `SLACK_ADD_REACTION` — Přidá emoji reakci

### Notion
- `NOTION_CREATE_PAGE` — Vytvoří stránku
- `NOTION_UPDATE_PAGE` — Aktualizuje stránku
- `NOTION_QUERY_DATABASE` — Dotaz na databázi
- `NOTION_CREATE_DATABASE` — Vytvoří databázi

### Linear
- `LINEAR_CREATE_ISSUE` — Vytvoří issue
- `LINEAR_UPDATE_ISSUE` — Aktualizuje issue
- `LINEAR_LIST_ISSUES` — Vypíše issues
- `LINEAR_CREATE_COMMENT` — Přidá komentář k issue

### Google Calendar
- `GOOGLE_CALENDAR_CREATE_EVENT` — Vytvoří událost v kalendáři
- `GOOGLE_CALENDAR_LIST_EVENTS` — Vypíše události
- `GOOGLE_CALENDAR_UPDATE_EVENT` — Aktualizuje událost
- `GOOGLE_CALENDAR_DELETE_EVENT` — Smaže událost

---

## Zpracování chyb

```python
from composio.exceptions import ComposioError

try:
    result = composio.actions.execute(
        action="GITHUB_CREATE_ISSUE",
        params={"owner": "org", "repo": "repo", "title": "Test"},
        user_id="user_123"
    )
except ComposioError as e:
    print(f"Chyba Composio: {e.message}")
    # Běžné chyby:
    # - Žádný aktivní propojený účet pro toolkit
    # - Neplatný název akce
    # - Chybějící povinné parametry
    # - Rate limiting od cílové aplikace
```

## Doporučené postupy

1. **Znovu používej sessions** — Nevytvářej novou session pro každý požadavek; znovu použij v rámci interakce uživatele
2. **Preferuj MCP režim** — Snižuje spotřebu tokenů tím, že nepředává všechna schémata nástrojů předem
3. **Omezuj toolkity** — Zahrn pouze toolkity, které agent skutečně potřebuje
4. **Zpracovávej chyby nástrojů elegantně** — API třetích stran mohou selhat; vždy kontroluj výsledky
5. **Používej user_id konzistentně** — Stejné user_id napříč sessions zachovává přístup k propojeným účtům
