# AgentBrowser API Reference

Full command reference for `agent-browser` CLI.

## Installation

```bash
brew install agent-browser     # macOS (recommended)
npm install -g agent-browser   # npm global
cargo install agent-browser    # Rust/Cargo
agent-browser install          # Download Chrome binary (required after install)
```

## Global Flags

| Flag | Description |
|------|-------------|
| `--session <name>` | Isolated browser instance |
| `--session-name <name>` | Auto-save/restore session |
| `--profile <path>` | Persistent browser profile |
| `--state <path>` | Load auth state JSON |
| `--headed` | Show browser window |
| `--json` | JSON output |
| `--headers <json>` | Custom HTTP headers |
| `-p <provider>` | Cloud provider (browserless, browserbase, etc.) |
| `--cdp <url>` | Connect via Chrome DevTools Protocol |

## Navigation

| Command | Description |
|---------|-------------|
| `open <url>` | Navigate to URL |
| `back` | Browser back |
| `forward` | Browser forward |
| `reload` | Reload page |
| `close` | Close browser |

## Element Selection (use refs from `snapshot`)

| Selector Type | Example |
|---------------|---------|
| Ref (preferred) | `@e1`, `@e2` |
| CSS | `#id`, `.class`, `button[type=submit]` |
| Text | `text=Sign In` |
| Semantic | `find role button --name "Submit"` |
| XPath | `xpath=//button` |

## Interaction

| Command | Description |
|---------|-------------|
| `click <sel>` | Click element |
| `dblclick <sel>` | Double-click |
| `hover <sel>` | Hover element |
| `fill <sel> <text>` | Clear + fill input |
| `type <sel> <text>` | Type without clearing |
| `check <sel>` | Check checkbox |
| `uncheck <sel>` | Uncheck checkbox |
| `select <sel> <val>` | Select dropdown option |
| `press <key>` | Press key (Enter, Tab, etc.) |
| `keyboard <text>` | Raw keystroke input |
| `drag <src> <tgt>` | Drag element |
| `upload <sel> <file>` | Upload file |

## Information

| Command | Description |
|---------|-------------|
| `snapshot` | Accessibility tree with refs |
| `screenshot [path]` | Capture screenshot |
| `screenshot --annotate` | Screenshot with labeled elements |
| `get text [sel]` | Visible text |
| `get html [sel]` | HTML content |
| `get value <sel>` | Input field value |
| `get attr <sel> <attr>` | Element attribute |
| `get title` | Page title |
| `get url` | Current URL |
| `get count <sel>` | Count matching elements |
| `is visible <sel>` | Check visibility |
| `is enabled <sel>` | Check enabled state |
| `is checked <sel>` | Check checkbox state |

## Wait

| Command | Description |
|---------|-------------|
| `wait <ms>` | Wait milliseconds |
| `wait --visible <sel>` | Wait for element visible |
| `wait --text <str>` | Wait for text to appear |
| `wait --url <pattern>` | Wait for URL match |
| `wait --timeout <ms>` | Max wait time |

## JavaScript

| Command | Description |
|---------|-------------|
| `eval <js>` | Execute JavaScript, return result |

## Network & Storage

| Command | Description |
|---------|-------------|
| `cookies` | List cookies |
| `cookies set <json>` | Set cookies |
| `cookies clear` | Clear cookies |
| `storage local` | Read localStorage |
| `storage session` | Read sessionStorage |
| `network requests` | All network requests |
| `network har` | HAR recording |

## Session Management

| Command | Description |
|---------|-------------|
| `state save --path <file>` | Save auth state |
| `state load --path <file>` | Load auth state |
| `state list` | List saved states |
| `auth save --name <n>` | Save encrypted credentials |
| `auth login <name>` | Login using saved credentials |

## Debugging

| Command | Description |
|---------|-------------|
| `console` | Browser console messages |
| `errors` | Uncaught exceptions |
| `highlight <sel>` | Visual highlight element |
| `diff snapshot` | Compare accessibility trees |
| `diff screenshot` | Compare screenshots |
| `trace start` | Start performance trace |
| `trace stop` | Stop trace |

## Environment Variables

| Var | Description |
|-----|-------------|
| `AGENT_BROWSER_DEFAULT_TIMEOUT` | Default timeout ms (default: 25000) |
| `AGENT_BROWSER_ENCRYPTION_KEY` | AES-256-GCM encryption key for state files |

## Config Files

- Project: `agent-browser.json` (current directory)
- User: `~/.agent-browser/config.json`
- CLI flags override env vars, which override config files
