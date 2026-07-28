# L4 — Sémantický index (HumanAgentWiki)

Sémantické vyhledávání nad wiki (L3) a dalším obsahem: pgvector + vícejazyčné embeddingy (BGE-M3), do Clauda napojené jako MCP nástroje `brain_search` / `brain_get` / `brain_neighbors`. Vše běží **lokálně** — poznámky neopouští stroj.

Engine je samostatný open-source projekt: **[HumanAgentWiki](https://github.com/petrludwig-collab/HumanAgentWiki)** — instalace, DB, MCP server a web UI jsou popsané tam. Tenhle adresář dodává **to, co v engine chybí: napojení na živé zdroje**.

## Princip zapojení

```
živé zdroje (wiki L3, blogy, dokumenty)
        │  denní rsync (kopie, ne originály)
        ▼
notes-prod/  ──►  incremental index (jen změněné soubory, content-hash)
        │
        ▼
Postgres+pgvector  ──►  MCP server :8802  ──►  Claude Code (brain_search)
```

**Proč kopie a ne originály:** indexer nikdy nesahá na živá data, sync je jednosměrný a `--delete` na kopii je bezpečný.

## Nastavení syncu (macOS)

1. Uprav cesty v [`sync_corpus.sh.example`](sync_corpus.sh.example) → ulož jako `sync_corpus.sh` do složky HumanAgentWiki, `chmod +x`.
2. Uprav cesty v [`com.example.humanagentwiki.sync.plist`](com.example.humanagentwiki.sync.plist) → zkopíruj do `~/Library/LaunchAgents/` a nahraj:
   ```bash
   launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.example.humanagentwiki.sync.plist
   ```
3. První běh spusť ručně a zkontroluj `sync.log`.

Na Linuxu totéž přes cron/systemd timer.

## Registrace MCP v Claude Code

```bash
claude mcp add --scope user --transport http humanagentwiki http://127.0.0.1:8802/mcp
```

Pak vlož blok „L4 — Sémantické hledání" z [`../claude-md-snippets.md`](../claude-md-snippets.md) do `~/.claude/CLAUDE.md`.

## Poučení z provozu

- **Embedding na CPU**: BGE-M3 na Apple MPS (torch 2.12) zamrzá na velkých dávkách — `EMBED_DEVICE=cpu` je spolehlivé (~5 min na ~130 souborů, incremental pak sekundy).
- **Jen .md**: indexer bere markdown; YAML/JSON soubory ve wiki se neindexují.
- **Přesná čísla ověřuj ve zdroji**: sémantika najde téma, ale ceník patří do wiki souboru, ne do snippetu.
