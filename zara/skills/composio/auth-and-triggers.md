# Composio — Reference: Autentizace & Triggery

## Autentizace

Composio podporuje více metod autentizace pro každý toolkit. Auth configs definují jak autentizace funguje; propojené účty jsou výsledkem dokončení autentizace uživatelem.

### Metody autentizace

| Metoda | Popis | Příklady aplikací |
|--------|-------|------------------|
| **OAuth2** | Plný OAuth consent flow s přesměrováním | GitHub, Gmail, Slack, Notion, Google Calendar |
| **API Key** | Uživatel zadá API klíč | OpenAI, Anthropic, Sendgrid |
| **Bearer Token** | Uživatel zadá bearer token | Různá REST API |
| **Basic Auth** | Uživatelské jméno + heslo | Starší systémy |

### Vytvoření Auth Config

Auth configs jsou znovupoužitelné šablony — vytvoř jednu pro každý toolkit v každém prostředí.

**Přes Dashboard:**
1. Jdi na composio.dev dashboard
2. Naviguj do Auth Configs
3. Vyber toolkit (např. GitHub)
4. Zadej OAuth client ID, client secret, scopes
5. Ulož → získej `auth_config_id`

**Přes SDK:**
```python
auth_config = composio.auth_configs.create(
    toolkit="github",
    auth_scheme="OAUTH2",
    config={
        "client_id": "tvůj_oauth_client_id",
        "client_secret": "tvůj_oauth_client_secret",
        "scopes": ["repo", "user", "read:org"]
    }
)
# auth_config.id → použij při zahajování připojení
```

### Zahájení autentizace uživatele (OAuth2)

```python
# Zahaj OAuth flow pro uživatele
connection_request = composio.connected_accounts.initiate(
    user_id="user_123",
    auth_config_id="ac_xxx",  # z vytvoření auth config
    config={"auth_scheme": "OAUTH2"},
    callback_url="https://tvojaapp.com/auth/callback"
)

# Přesměruj uživatele na OAuth consent stránku
print(connection_request.redirect_url)  # Pošli uživatele sem

# Čekej dokud uživatel nedokončí OAuth (blokující)
connected_account = connection_request.wait_for_connection()
# connected_account.id, connected_account.status
```

### Zahájení autentizace uživatele (API Key)

```python
connection_request = composio.connected_accounts.initiate(
    user_id="user_123",
    auth_config_id="ac_xxx",
    config={
        "auth_scheme": "API_KEY",
        "api_key": "api_klíč_zadaný_uživatelem"
    }
)
# Žádné přesměrování — připojení je okamžitě aktivní
```

### Stavy propojeného účtu

| Stav | Význam |
|------|--------|
| `ACTIVE` | Připraveno k použití, tokeny platné |
| `INITIATED` | OAuth flow zahájen, uživatel nedokončil consent |
| `EXPIRED` | Token vypršel (Composio automaticky obnovuje, takže vzácné) |
| `FAILED` | Autentizace selhala |
| `INACTIVE` | Ručně deaktivováno |

### Správa propojených účtů

```python
# Výpis všech aktivních účtů uživatele
accounts = composio.connected_accounts.list(
    user_ids=["user_123"],
    statuses=["ACTIVE"]
)

# Zkontroluj, zda má uživatel aktivní připojení pro toolkit
github_accounts = [a for a in accounts if a.toolkit == "github"]
has_github = len(github_accounts) > 0

# Získej konkrétní účet
account = composio.connected_accounts.get(connected_account_id="ca_xxx")

# Smaž (odpoj)
composio.connected_accounts.delete(connected_account_id="ca_xxx")
```

### Automatické obnovování tokenů

Composio automaticky obnovuje OAuth tokeny před jejich vypršením. Nikdy nemusíš tokeny obnovovat ručně. Pokud obnovení tokenu selže, stav propojeného účtu se změní na `EXPIRED`.

---

## Triggery

Triggery jsou posluchači událostí, kteří odesílají data do tvé aplikace když se něco stane v propojené aplikaci.

### Typy triggerů

| Typ | Doručení | Latence | Aplikace |
|-----|----------|---------|---------|
| **Webhook** | Push v reálném čase | Okamžitě | GitHub, Slack, Linear |
| **Polling** | Composio pravidelně kontroluje | ~1 minuta | Gmail, Google Calendar |

### Běžné slimáky triggerů

**GitHub:**
- `GITHUB_COMMIT_EVENT` — Nový commit pushnut
- `GITHUB_PULL_REQUEST_EVENT` — PR otevřen/zavřen/mergnut
- `GITHUB_ISSUE_EVENT` — Issue vytvořen/aktualizován
- `GITHUB_PUSH_EVENT` — Kód pushnut do větve
- `GITHUB_STAR_EVENT` — Repozitář ohodnocen hvězdičkou

**Slack:**
- `SLACK_NEW_MESSAGE` — Nová zpráva v kanálu
- `SLACK_REACTION_ADDED` — Reakce přidána ke zprávě
- `SLACK_CHANNEL_CREATED` — Nový kanál vytvořen

**Gmail:**
- `GMAIL_NEW_EMAIL` — Nový email přijat (polling)
- `GMAIL_NEW_LABEL` — Email označen štítkem

**Linear:**
- `LINEAR_ISSUE_CREATED` — Nový issue
- `LINEAR_ISSUE_UPDATED` — Issue aktualizován
- `LINEAR_COMMENT_CREATED` — Nový komentář

### Vytvoření triggerů

```python
# Webhook trigger (GitHub)
trigger = composio.triggers.create(
    slug="GITHUB_PULL_REQUEST_EVENT",
    user_id="user_123",
    trigger_config={
        "owner": "mojaorg",
        "repo": "mojrepo"
    }
)
# trigger.id → identifikátor triggeru
# trigger.webhook_url → URL přijímající události (pro webhook triggery)

# Polling trigger (Gmail)
trigger = composio.triggers.create(
    slug="GMAIL_NEW_EMAIL",
    user_id="user_123",
    trigger_config={
        "label": "INBOX",
        "interval": 60  # kontroluj každých 60 sekund
    }
)
```

### Naslouchání událostem triggerů

```python
# Přihlás se k odběru událostí triggeru
listener = composio.triggers.subscribe(
    trigger_ids=["trigger_xxx"]
)

# Zpracuj události
for event in listener:
    print(f"Událost: {event.trigger_slug}")
    print(f"Data: {event.data}")
    # Předej příslušnému handleru
```

### Správa triggerů

```python
# Výpis triggerů uživatele
triggers = composio.triggers.list(user_id="user_123")

# Detail triggeru
trigger = composio.triggers.get(trigger_id="trigger_xxx")

# Smaž trigger
composio.triggers.delete(trigger_id="trigger_xxx")

# Pauza/obnovení
composio.triggers.pause(trigger_id="trigger_xxx")
composio.triggers.resume(trigger_id="trigger_xxx")
```

---

## Kompletní příklad: Autentizace + Trigger

Celý příklad: autentizace GitHub, nastavení PR triggeru a zpracování událostí.

```python
from composio import Composio

composio = Composio()

# 1. Zahaj GitHub OAuth pro uživatele
connection = composio.connected_accounts.initiate(
    user_id="user_123",
    auth_config_id="ac_github_xxx",
    config={"auth_scheme": "OAUTH2"},
    callback_url="https://mojaapp.com/callback"
)
print(f"Auth URL: {connection.redirect_url}")

# 2. Čekej dokud uživatel nedokončí OAuth
account = connection.wait_for_connection()
assert account.status == "ACTIVE"

# 3. Nastav trigger PR událostí
trigger = composio.triggers.create(
    slug="GITHUB_PULL_REQUEST_EVENT",
    user_id="user_123",
    trigger_config={"owner": "mojaorg", "repo": "mojrepo"}
)

# 4. Vytvoř session s GitHub nástroji
session = composio.create(user_id="user_123", toolkits=["github", "slack"])
tools = session.tools()

# 5. Naslouchej událostem a zpracuj s agentem
listener = composio.triggers.subscribe(trigger_ids=[trigger.id])
for event in listener:
    # Předej data události + nástroje svému Claude agentovi ke zpracování
    # Agent může používat GitHub nástroje pro review PR, Slack nástroje pro notifikaci týmu
    pass
```

## Bezpečnostní doporučení

1. **Nikdy neloguj ani neodhaluj OAuth tokeny** — Composio spravuje tokeny interně
2. **Používej callback URL s HTTPS** — Nikdy nepoužívej HTTP pro OAuth callbacky
3. **Validuj podpisy událostí triggeru** — Ověřuj, že webhook payloady jsou od Composio
4. **Omezuj OAuth oprávnění** — Žádej pouze scopes, které agent skutečně potřebuje
5. **Pravidelně rotuj API klíče** — Obnovuj svůj `COMPOSIO_API_KEY` podle plánu
6. **Používej oddělené auth configs pro každé prostředí** — Nesdílej mezi dev/staging/prod
