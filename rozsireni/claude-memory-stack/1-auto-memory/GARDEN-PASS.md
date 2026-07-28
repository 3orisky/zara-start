# Garden pass — měsíční údržba paměti

Bez údržby index roste donekonečna a každé okno platí kontextem za mrtvé projekty. Jednou měsíčně řekni Claudovi: **„udělej garden pass paměti"** a dej mu tenhle postup:

## Postup

1. **Konzistence indexu** — každý soubor má řádek v MEMORY.md a každý řádek má soubor:
   ```bash
   cd <memory-dir>
   for f in *.md; do [ "$f" = "MEMORY.md" ] && continue; grep -q "($f)" MEMORY.md || echo "CHYBÍ V INDEXU: $f"; done
   grep -o '([a-z_0-9.-]*\.md)' MEMORY.md | tr -d '()' | while read f; do [ -f "$f" ] || echo "MRTVÝ ODKAZ: $f"; done
   ```
2. **Kandidáti na archiv** — projdi `project_*` a `reference_*`: co je hotové, zrušené, nebo duplikuje wiki/git? Sestav seznam s důvody a **nech si ho schválit** (Claude nemá mazat sám — u nejistých položek se ptá na stav).
3. **Archivace** — schválené: `mv <soubor> archive/` + smazat řádek z indexu. Nemazat — archiv je zadarmo, kontext ne.
4. **Sloučení** — podobné memories (např. série „nainstalován skill pack X") sluč do jedné souhrnné, detaily nech v archivu.
5. **Zastaralé feedback** — pravidla o nástrojích, které už nepoužíváš, smaž úplně (soubor i řádek).

## Session checkpointy (pokud používáš L2)

```bash
find ~/.claude/session-memory -name "*.md" -mtime +30 -delete
```

## Výsledek zdravého passu

Index se **zmenšil** nebo zůstal stejný, žádný nekonzistentní řádek, všechna živá memories mají aktuální stav.
