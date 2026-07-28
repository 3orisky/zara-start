# Authenticate Workflow

Persist browser sessions and manage authentication state across runs.

## Session Persistence Methods

### Method 1: Named Session (Recommended for simple sites)
Auto-saves cookies and localStorage between restarts:
```bash
agent-browser --session-name myapp open https://app.example.com
# Login manually or via Interact workflow
# Session state auto-saved as "myapp"

# Next run — state restored automatically:
agent-browser --session-name myapp open https://app.example.com/dashboard
```

### Method 2: Persistent Profile (Full browser state)
Stores cookies, IndexedDB, service workers, cache:
```bash
agent-browser --profile ~/.agent-browser/profiles/myapp open https://app.example.com
```

### Method 3: State File (Portable)
Save and load auth state as JSON:
```bash
# Save current auth state
agent-browser state save --path ~/.agent-browser/states/myapp.json

# Load on next run
agent-browser --state ~/.agent-browser/states/myapp.json open https://app.example.com
```

### Method 4: Auth Vault (Encrypted)
```bash
# Save credentials
agent-browser auth save --name myapp

# Login using saved credentials
agent-browser auth login myapp
```

### Method 5: HTTP Headers (Skip UI login)
```bash
agent-browser --headers '{"Authorization": "Bearer TOKEN"}' open https://api.example.com
```

## Standard Login Flow

```bash
# 1. Open login page
agent-browser open https://app.example.com/login

# 2. Snapshot to find form fields
agent-browser snapshot

# 3. Fill credentials (use refs from snapshot)
agent-browser fill @e2 "user@example.com"
agent-browser fill @e3 "password"
agent-browser click @e1   # Submit button

# 4. Wait for redirect
agent-browser wait --url "**/dashboard"

# 5. Save session state
agent-browser state save --path ~/.agent-browser/states/myapp.json
```

## Security Notes

- Use `AGENT_BROWSER_ENCRYPTION_KEY` env var for AES-256-GCM encrypted state files
- State files contain sensitive cookies — store in `~/.agent-browser/` (not in project dirs)
- Never commit state files to git
