# Wiki — Schema & Conventions

Personal knowledge base for **<tvůj byznys/doména>**. Based on Karpathy's LLM Wiki pattern (gist: 442a6bf555914893e9891c11519de94f).

## Scope

**IN:** <co do wiki patří — byznys, brand, produkty, ceny, funnely, marketing, tech stack, operace, tým, finance, strategie>.

**OUT:** <co do wiki NEpatří — např. jednotliví klienti; ti patří do oddělených projektových poznámek>.

## Architecture

```
<wiki-dir>/
├── WIKI.md          ← this file (schema + conventions)
├── index.md         ← content catalog, updated every ingest
├── log.md           ← chronological operations log
├── raw/             ← immutable source documents (articles, PDFs, exports, screenshots)
└── wiki/
    ├── entities/    ← brand, legal entity, team, partners
    ├── products/    ← one page per product / program
    ├── concepts/    ← domain concepts (product pyramid, recurring revenue, retention)
    ├── operations/  ← tech stack, workflows, automations, infra
    └── analysis/    ← sales analyses, cohort studies, market research
```

## Conventions

### Page format
Every wiki page starts with YAML frontmatter:

```yaml
---
title: <page title>
type: entity | product | concept | operation | analysis
status: active | archived | deprecated
last_updated: YYYY-MM-DD
sources: [raw/file1.md, raw/file2.pdf]
tags: [tag1, tag2]
---
```

### Links
Use `[[wiki/products/example.md]]` style relative links for cross-references.

### Dates
Always absolute ISO format: `2026-04-14`. Never "last week" or "Thursday".

### Money
Always with currency and thousand separators: `12,694,000 CZK` or `12.7M CZK`. Note the "as of" date.

## Operations

### Ingest
Command: *"ingest raw/<file>"* or *"add this source"*.
1. Read source, discuss key takeaways with the user.
2. Store original in `raw/` (immutable).
3. Create a summary page in `wiki/analysis/` or relevant section.
4. Update entity/product/concept pages touched by the source.
5. Update `index.md` with new page(s).
6. Append entry to `log.md`: `## [YYYY-MM-DD] ingest | <title>`.

### Query
Command: *"what do we know about X"*.
1. Read `index.md` to locate relevant pages.
2. Read those pages, synthesize answer with citations.
3. If the answer is substantive, offer to file it as a new page in `wiki/analysis/`.
4. Append to log: `## [YYYY-MM-DD] query | <question>`.

### Lint
Command: *"lint the wiki"*.
- Flag contradictions across pages.
- Flag stale claims (older than newest source on same topic).
- Flag orphan pages (no inbound links).
- Flag concepts mentioned but missing their own page.
- Suggest questions to investigate / sources to seek.
- Log: `## [YYYY-MM-DD] lint | <summary>`.

## Sources of truth

Wiki is a compiled view. The actual authoritative data lives in:
- **<systém 1>** — <co v něm žije>
- **<systém 2>** — <co v něm žije>

Wiki summarizes what lives there. When in doubt, verify against source.
