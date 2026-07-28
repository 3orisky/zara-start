# Interact Workflow

Interact with page elements using snapshot-ref pattern for deterministic selection.

## The Snapshot-Ref Pattern (Optimal for AI)

1. **Snapshot the page** to get element refs
2. **Identify target ref** from accessibility tree
3. **Interact using ref** — stable within session

```bash
# Step 1: Snapshot
agent-browser snapshot

# Output example:
# [ref=@e1] button "Sign In"
# [ref=@e2] input[type=text] name="email"
# [ref=@e3] input[type=password] name="password"

# Step 2 & 3: Interact using refs
agent-browser fill @e2 "user@example.com"
agent-browser fill @e3 "password123"
agent-browser click @e1
```

## Common Interactions

### Click
```bash
agent-browser click @eN           # By ref (preferred)
agent-browser click "#submit"     # By CSS selector
agent-browser click "text=Login"  # By text
```

### Fill / Type
```bash
agent-browser fill @eN "value"    # Clear then fill
agent-browser type @eN "text"     # Type without clearing
```

### Select / Check
```bash
agent-browser select @eN "option-value"   # Dropdown
agent-browser check @eN                   # Checkbox on
agent-browser uncheck @eN                 # Checkbox off
```

### Keyboard
```bash
agent-browser press Enter
agent-browser press Tab
agent-browser press "Control+a"
agent-browser keyboard "Hello World"
```

### Wait Before Interacting
```bash
agent-browser wait --visible @eN          # Wait for element
agent-browser wait --text "Loading done"  # Wait for text
agent-browser wait 1000                   # Wait ms
agent-browser wait --url "**/dashboard"   # Wait for URL match
```

## After Each Interaction

Re-snapshot if the page changes significantly:
```bash
agent-browser snapshot   # Refresh refs after DOM changes
```

## Intent-to-Action Mapping

| User Says | Command |
|-----------|---------|
| "click the button" | `agent-browser click @eN` |
| "type in the field" | `agent-browser type @eN "text"` |
| "clear and fill" | `agent-browser fill @eN "value"` |
| "press enter" | `agent-browser press Enter` |
| "submit the form" | `agent-browser click @submit-ref` OR `agent-browser press Enter` |
| "drag X to Y" | `agent-browser drag @eSource @eTarget` |
| "upload a file" | `agent-browser upload @eN "/path/to/file"` |
