# Navigate Workflow

Navigate to a URL, capture screenshot, and return accessibility snapshot.

## Steps

1. **Navigate to the URL**
   ```bash
   agent-browser open <url>
   ```

2. **Wait for page to load** (if needed)
   ```bash
   agent-browser wait --timeout 3000
   ```

3. **Take screenshot**
   ```bash
   agent-browser screenshot [~/Downloads/screenshot-$(date +%s).png]
   ```
   Report the screenshot path to the user.

4. **Capture accessibility snapshot** (for follow-up interactions)
   ```bash
   agent-browser snapshot
   ```
   Parse the output to identify element refs (`@e1`, `@e2`, etc.) for later interactions.

5. **Report to user**
   - Screenshot path
   - Page title: `agent-browser get title`
   - Current URL: `agent-browser get url`
   - Any element refs relevant to the request

## Options

| User Intent | Flag | Command |
|-------------|------|---------|
| "show labels on screenshot" | `--annotate` | `agent-browser screenshot --annotate` |
| "headed mode", "show browser" | `--headed` | `agent-browser --headed open <url>` |
| "use session X" | `--session <name>` | `agent-browser --session <name> open <url>` |
| "JSON output" | `--json` | `agent-browser --json snapshot` |

## Error Handling

If navigation fails:
- Check URL is valid and reachable
- Try `agent-browser reload`
- Check `agent-browser errors` for browser console errors
