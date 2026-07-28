---
name: YouTubeSearch
description: Search YouTube and extract video metadata, transcripts, and URLs using yt-dlp. USE WHEN user wants to find YouTube videos, scrape YouTube, get video transcripts, analyze YouTube content, or prepare sources for NotebookLM analysis. Examples: "find trending videos about X", "scrape YouTube for Y", "get transcripts from these videos".
---

# YouTube Search Skill

Wrapper around `yt-dlp` for YouTube discovery and metadata extraction. Designed to feed clean source lists into NotebookLM or other analysis skills.

## Dependencies

- `yt-dlp` (installed at `/Library/Frameworks/Python.framework/Versions/3.14/bin/yt-dlp`)

Verify with: `yt-dlp --version`

## Core Commands

### 1. Search YouTube by query
```bash
yt-dlp "ytsearch20:QUERY" --flat-playlist --print "%(url)s | %(title)s | %(channel)s | %(view_count)s | %(upload_date)s" --no-warnings
```
- Replace `20` with desired count (e.g., `ytsearch5`, `ytsearch50`)
- `--flat-playlist` = fast metadata only, no per-video fetch
- Returns clean pipe-separated lines ready for parsing

### 2. Search with date filter (last N days)
```bash
yt-dlp "ytsearchdate30:QUERY" --flat-playlist --print "%(url)s | %(title)s | %(upload_date)s" --dateafter "now-30days" --no-warnings
```

### 3. Get transcript / subtitles for a single video
```bash
yt-dlp --write-auto-sub --sub-lang en --skip-download --convert-subs vtt --output "%(id)s.%(ext)s" "VIDEO_URL"
```
- Use `--sub-lang cs` for Czech, `en` for English, `en,cs` for both

### 4. Get full metadata as JSON
```bash
yt-dlp -j --no-warnings "VIDEO_URL"
```

### 5. Get channel's recent videos
```bash
yt-dlp "https://www.youtube.com/@CHANNEL/videos" --flat-playlist --playlist-end 20 --print "%(url)s | %(title)s | %(upload_date)s"
```

## Workflow Pattern — Research Pipeline

When user asks to "find videos about X and analyze":

1. **Search** → `yt-dlp "ytsearch20:X" --flat-playlist --print "%(url)s"` to get 20 URLs
2. **Filter** → read titles, pick relevant ones (filter by view count / recency if needed)
3. **Hand off** → pass URL list to NotebookLM skill (`notebooklm source add <url>` per URL) — NotebookLM handles YouTube sources natively, no local download needed
4. **Report** → return list of titles + URLs to user before ingestion

## Key Notes

- Use `--flat-playlist` whenever possible — it's ~50× faster than full metadata fetch
- Max recommended: 50 URLs per NotebookLM notebook (API limit ~300 sources)
- For Czech content use `"ytsearch20:dotaz v češtině"` — yt-dlp handles UTF-8 fine
- If blocked by rate limit, add `--sleep-interval 2`

## Output Format

Always return to user BEFORE ingestion:
```
Nalezeno N videí:
1. [Title] — Channel (views, date) — URL
2. ...
```
Then ask: "Chceš nahrát všech N do NotebookLM, nebo vybereš?"
