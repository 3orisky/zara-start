---
name: NotebookLM
description: Automate Google NotebookLM via unofficial notebooklm-py CLI. Create notebooks, add sources (URLs, YouTube, PDFs, Drive), and generate audio overviews, videos, slide decks, quizzes, flashcards, infographics, mind maps, data tables, and reports. USE WHEN user wants to analyze sources in NotebookLM, generate podcast/mindmap/flashcards from content, or build a research notebook.
---

# NotebookLM Skill

Programmatic access to Google NotebookLM via `notebooklm-py` (teng-lin/notebooklm-py). Analysis runs on Google's infrastructure — user pays $0 in tokens.

## Prerequisites

- `notebooklm` CLI installed (`pip install notebooklm-py[browser]`)
- Playwright Chromium installed (`python3 -m playwright install chromium`)
- **User must run `notebooklm login` ONCE manually** — opens Chromium, Google auth. Credentials stored at `~/.notebooklm/storage_state.json`.

Check auth: `notebooklm list` — if it errors, tell user to run `notebooklm login`.

## Core Workflow

### 1. Create notebook + set as active
```bash
notebooklm create "Research Title"          # returns notebook ID
notebooklm use <notebook_id_prefix>         # partial ID matching works
notebooklm status                           # show active notebook
```

### 2. Add sources
```bash
notebooklm source add "https://youtube.com/watch?v=..."    # YouTube (native)
notebooklm source add "https://example.com/article"         # Web URL
notebooklm source add "./paper.pdf"                         # Local file
notebooklm source add-drive "<drive_file_id>"               # Google Drive
notebooklm source add-research "topic query"                # Auto-search + add
notebooklm source wait                                       # Wait until all sources processed
```

### 3. Ask questions
```bash
notebooklm ask "What are the top 5 themes?"
notebooklm ask "Compare approaches X and Y" --save-as-note
notebooklm history                          # conversation log
```

### 4. Generate artifacts
```bash
notebooklm generate audio "engaging deep-dive style" --wait
notebooklm generate video --style whiteboard --wait
notebooklm generate slide-deck "focus on practical tips" --wait
notebooklm generate mind-map --wait
notebooklm generate quiz --difficulty hard --wait
notebooklm generate flashcards --wait
notebooklm generate infographic --wait
notebooklm generate data-table "compare tools across features"
notebooklm generate report --type study-guide --wait
notebooklm generate report --type briefing-doc --wait
notebooklm generate report --type blog-post --wait
```

### 5. Download artifacts
```bash
notebooklm download audio ./podcast.mp3
notebooklm download video ./video.mp4
notebooklm download mind-map ./mindmap.json
notebooklm download quiz --format json ./quiz.json
notebooklm download flashcards --format csv ./cards.csv
notebooklm download slide-deck --format pptx ./deck.pptx
notebooklm download infographic ./infographic.png
```

## Canonical Pipeline (YouTube → NotebookLM → Output)

User says: *"Najdi videa o X, analyzuj a dej mi mindmapu + podcast"*

```bash
# 1. YouTube search (via YouTubeSearch skill) → 20 URLs
yt-dlp "ytsearch20:X" --flat-playlist --print "%(url)s | %(title)s" > /tmp/videos.txt

# 2. Show list to user, confirm selection

# 3. Create notebook
NB=$(notebooklm create "X research $(date +%Y%m%d)" --json | jq -r .id)
notebooklm use "$NB"

# 4. Add each URL (loop)
while IFS='|' read -r url _; do
  notebooklm source add "$(echo $url | xargs)"
done < /tmp/videos.txt

# 5. Wait for processing
notebooklm source wait

# 6. Generate + download
notebooklm generate mind-map --wait
notebooklm download mind-map ~/Desktop/mindmap.json

notebooklm generate audio "clear summary with key insights" --wait
notebooklm download audio ~/Desktop/podcast.mp3
```

## Output Catalog (from the infographic)

| User intent | Command |
|-------------|---------|
| "udělej infografiku" | `generate infographic --wait` |
| "vytvoř mind mapu" | `generate mind-map --wait` |
| "audio overview" / "podcast" | `generate audio --wait` |
| "exportuj flashcards" | `generate flashcards --wait` |
| "klíčové body" / "shrnutí" | `generate report --type briefing-doc --wait` |
| "vygeneruj quiz" | `generate quiz --wait` |
| "slide deck" / "prezentace" | `generate slide-deck --wait` |
| Q&A | `ask "question"` |

## Default Output Location

Save all downloaded artifacts under `~/Desktop/notebooklm-<notebook-slug>/` unless user specifies otherwise.

## Error Recovery

- **"Not authenticated"** → tell user to run `notebooklm login` in a normal Terminal (not inside Claude Code).
- **"Source failed to process"** → use `notebooklm source list` to see status; re-add or skip.
- **Rate limits** → space out `source add` calls by 2s; retry with exponential backoff.

## Important Constraints

- NotebookLM free tier: 100 sources per notebook (check current limits if near cap).
- Generation is async — always use `--wait` unless explicitly queuing many jobs.
- Storage state file (`~/.notebooklm/storage_state.json`) is auth-sensitive — never commit, never paste.
