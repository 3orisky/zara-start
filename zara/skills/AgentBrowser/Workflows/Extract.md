# Extract Workflow

Extract data, text, and structured content from web pages.

## Steps

1. **Navigate to page** (if not already there)
   ```bash
   agent-browser open <url>
   ```

2. **Choose extraction method** based on what's needed:

### Text Content
```bash
agent-browser get text              # Visible text of entire page
agent-browser get text @eN          # Text of specific element
agent-browser get html              # Full HTML
agent-browser get html @eN          # HTML of specific element
```

### Element Attributes
```bash
agent-browser get attr @eN href     # Get attribute value
agent-browser get value @eN         # Input field value
agent-browser get title             # Page title
agent-browser get url               # Current URL
agent-browser get count ".items"    # Count matching elements
```

### Accessibility Snapshot (Structured)
```bash
agent-browser snapshot              # Full accessibility tree with refs
agent-browser snapshot --json       # JSON format for parsing
```

### Execute JavaScript for Complex Extraction
```bash
agent-browser eval "document.querySelectorAll('a').length"
agent-browser eval "Array.from(document.links).map(a => a.href)"
agent-browser eval "document.title"
```

### Network Data
```bash
agent-browser network requests      # All network requests
agent-browser network har           # Full HAR recording
```

## Intent-to-Command Mapping

| User Says | Command |
|-----------|---------|
| "get all links" | `agent-browser eval "Array.from(document.links).map(a=>({text:a.textContent,href:a.href}))"` |
| "get page text" | `agent-browser get text` |
| "get page title" | `agent-browser get title` |
| "get HTML" | `agent-browser get html` |
| "count items" | `agent-browser get count "<selector>"` |
| "read the table" | Snapshot + `agent-browser get text` on table ref |
| "get all images" | `agent-browser eval "Array.from(document.images).map(i=>i.src)"` |

## Output Format

Use `--json` for structured data when integrating with other tools:
```bash
agent-browser --json get text @eN
agent-browser --json snapshot
```
