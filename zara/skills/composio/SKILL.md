---
name: composio
description: Postav AI agent integrace s Composio (composio.dev). Použij když chce uživatel propojit AI agenty s aplikacemi třetích stran (GitHub, Gmail, Slack, Notion, Salesforce, atd.), nastavit OAuth autentizaci pro nástroje, vytvořit Composio sessions, používat Composio nástroje nativně nebo přes MCP, nastavit event triggery nebo postavit multi-app agent workflows. Spouští se na importy z composio nebo @composio nebo zmínky o composio.
argument-hint: [popis co postavit nebo integrovat]
---

# Composio Skill

Jsi expert na integraci AI agentů s aplikacemi třetích stran pomocí Composio — vývojářské platformy, která propojuje agenty s 1000+ aplikacemi přes unified SDK a MCP.

Přečti si detailní referenční soubory v `${CLAUDE_SKILL_DIR}` pro komplexní vzory:

- `sdk-reference.md` — Python a TypeScript SDK vzory, sessions, nástroje, MCP integrace, spouštění akcí
- `auth-and-triggers.md` — OAuth/API key autentizační toky, propojené účty, triggery, webhooky, polling

## Checklist nastavení

### Python
```bash
pip install composio composio-claude-agent-sdk
```

### TypeScript
```bash
npm install composio @composio/claude-agent-sdk
```

### Proměnné prostředí
```bash
COMPOSIO_API_KEY=tvůj_composio_api_klíč    # z composio.dev dashboardu
ANTHROPIC_API_KEY=tvůj_anthropic_api_klíč  # pro integraci s Claudem
```

## Klíčové koncepty

| Koncept | Popis |
|---------|-------|
| **Toolkits** | Balíčky nástrojů podle služby (github, gmail, slack, notion, atd.) |
| **Tools** | Diskrétní operace: `GITHUB_CREATE_ISSUE`, `GMAIL_SEND_EMAIL`, `SLACK_POST_MESSAGE` |
| **Auth Configs** | Znovupoužitelné šablony autentizace (OAuth2, API Key, Bearer Token) pro každý toolkit |
| **Connected Accounts** | Propojení uživatel-toolkit vytvořené po OAuth consent nebo zadání API klíče |
| **Triggers** | Posluchači událostí: `GITHUB_COMMIT_EVENT`, `SLACK_NEW_MESSAGE`, `GMAIL_NEW_EMAIL` |
| **Sessions** | Izolované uživatelské kontexty s přístupem k nástrojům (nativní nebo MCP) |
| **User ID** | Primární identifikátor, který přiřazuje všechny operace konkrétnímu uživateli |

## Základní vzory

### Inicializace klienta

**Python:**
```python
from composio import Composio

composio = Composio(api_key="tvůj_api_klíč")
# Nebo nastav proměnnou COMPOSIO_API_KEY a vynech api_key
```

**TypeScript:**
```typescript
import { Composio } from "composio";

const composio = new Composio({ apiKey: "tvůj_api_klíč" });
```

### Vytvoření session a získání nástrojů (nativní)
```python
session = composio.create(user_id="user_123", toolkits=["github", "gmail"])
tools = session.tools()
# Předej nástroje svému Claude agentovi
```

### Vytvoření session a získání MCP URL
```python
session = composio.create(user_id="user_123", toolkits=["github", "slack"])
mcp_url = session.mcp.url
# Použij mcp_url v MCP-kompatibilních klientech (Claude Desktop, Cursor, atd.)
```

### Autentizace uživatele (OAuth2)
```python
connection_request = composio.connected_accounts.initiate(
    user_id="user_123",
    auth_config_id="tvůj_auth_config_id",
    config={"auth_scheme": "OAUTH2"},
    callback_url="https://tvojaapp.com/callback"
)
# Přesměruj uživatele na: connection_request.redirect_url
# Po souhlasu čekej na připojení:
connected_account = connection_request.wait_for_connection()
```

### Nastavení triggeru
```python
trigger = composio.triggers.create(
    slug="GITHUB_COMMIT_EVENT",
    user_id="user_123",
    trigger_config={"owner": "vlastník-repo", "repo": "název-repo"},
)
```

## Kritická pravidla

1. **Vždy přiřazuj operace pomocí user_id** — každá session, propojený účet a trigger patří uživateli
2. **Pouze ACTIVE propojené účty mohou spouštět nástroje** — zkontroluj stav před použitím
3. **Používej MCP režim pro dynamické odkrývání nástrojů** — snižuje spotřebu tokenů oproti předávání všech definic nástrojů předem
4. **Auth configs jsou znovupoužitelné** — vytvoř jednu pro každý toolkit v každém prostředí, znovu používej napříč uživateli
5. **Composio automaticky obnovuje OAuth tokeny** — žádné ruční obnovování tokenů není potřeba
6. **Webhook triggery jsou v reálném čase** — polling triggery kontrolují každou ~1 minutu
7. **Nikdy nekóduj API klíče natvrdo** — používej proměnné prostředí (`COMPOSIO_API_KEY`)
8. **Používej typově bezpečné názvy nástrojů** — např. `GITHUB_CREATE_ISSUE` ne libovolné řetězce
9. **Kontroluj stav propojeného účtu** před spuštěním nástrojů: ACTIVE, INITIATED, EXPIRED, FAILED, INACTIVE
10. **Maximální počet toolkitů na session závisí na plánu** — zkontroluj Composio dashboard pro limity

## Běžné workflow

### Agent pro třídění emailů
```python
session = composio.create(user_id="user_1", toolkits=["gmail", "slack", "notion"])
tools = session.tools()
# Agent čte Gmail, klasifikuje emaily, směruje do Slack kanálů, loguje v Notion
```

### Monitor GitHub PR
```python
trigger = composio.triggers.create(
    slug="GITHUB_PULL_REQUEST_EVENT",
    user_id="user_1",
    trigger_config={"owner": "mojaorg", "repo": "mojrepo"},
)
# Na PR událost -> agent přezkouší kód, odešle shrnutí na Slack
```

### Multi-app workflow
```python
session = composio.create(
    user_id="user_1",
    toolkits=["github", "slack", "linear", "notion"]
)
tools = session.tools()
# Agent přijme Slack zprávu -> vytvoří Linear issue -> aktualizuje Notion -> potvrdí ve Slacku
```

Použij `$ARGUMENTS` k pochopení co chce uživatel integrovat. Přečti referenční soubory pro detailní SDK vzory a autentizační toky před psaním kódu.
