---
name: AgentBrowser
description: Rust-based headless browser CLI for AI agents using agent-browser. USE WHEN agent-browser, headless browser automation, snapshot-ref pattern, browser CLI, accessibility tree, web scraping with agent-browser, OR need deterministic element refs for browser interaction.
---

## Customization

**Before executing, check for user customizations at:**
`~/.claude/skills/PAI/USER/SKILLCUSTOMIZATIONS/AgentBrowser/`

If this directory exists, load and apply any PREFERENCES.md or configurations found there. If not, proceed with skill defaults.

# AgentBrowser

Headless browser automation using `agent-browser` CLI — a fast Rust-native tool designed for AI agents. Uses accessibility-tree snapshot refs (`@e1`, `@e2`) for deterministic element selection.

## Voice Notification

**When executing a workflow, do BOTH:**

1. **Send voice notification**:
   ```bash
   curl -s -X POST http://localhost:8888/notify \
     -H "Content-Type: application/json" \
     -d '{"message": "Running the WORKFLOWNAME workflow in the AgentBrowser skill to ACTION"}' \
     > /dev/null 2>&1 &
   ```

2. **Output text notification**:
   ```
   Running the **WorkflowName** workflow in the **AgentBrowser** skill to ACTION...
   ```

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **Navigate** | "open", "go to", "navigate to", "visit", "screenshot" | `Workflows/Navigate.md` |
| **Interact** | "click", "fill", "type", "submit", "form", "select" | `Workflows/Interact.md` |
| **Extract** | "extract", "get text", "scrape", "read page", "get data" | `Workflows/Extract.md` |
| **Authenticate** | "login", "auth", "save session", "persist cookies" | `Workflows/Authenticate.md` |

## Quick Reference

- **Primary command:** `agent-browser open <url> && agent-browser snapshot`
- **Element refs:** Use `@e1`, `@e2` from snapshot output — deterministic and session-persistent
- **JSON output:** Add `--json` to any command for machine-readable output
- **Session:** Daemon auto-starts; persists between commands for performance
- **Full API:** `AgentBrowser/ApiReference.md`

## Examples

**Example 1: Navigate and interact**
```
User: "Go to github.com and take a screenshot"
→ Invokes Navigate workflow
→ agent-browser open https://github.com && agent-browser screenshot
→ Returns screenshot path + accessibility snapshot
```

**Example 2: Fill a form**
```
User: "Fill in the search box with 'Claude' and submit"
→ Invokes Interact workflow
→ Snapshots page, identifies @eN ref for search input
→ agent-browser fill @eN "Claude" && agent-browser press Enter
```

**Example 3: Extract page data**
```
User: "Get all the links on this page"
→ Invokes Extract workflow
→ agent-browser get html && parses links
→ Returns structured list of hrefs
```
