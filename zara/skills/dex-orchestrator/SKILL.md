---
name: dex-orchestrator
description: DEX-style aplikace na orchestraci Cloud Code agentů — od goal.md přes klarifikaci, plán, tasky až po Ralph Wigum loop implementaci. USE WHEN uživatelka říká "DEX", "orchestrátor", "ať mi to udělá samo", "spusť to a běž spát", nebo chce pustit autonomní implementaci s automatickými commity a možností vrátit se v historii.
---

# DEX Orchestrator

DEX je Electron aplikace (od Lukáše z kurzu), která automatizuje celý proces od nápadu k hotové aplikaci. Tento skill popisuje jak ji použít A jak postavit obdobu manuálně.

## Co DEX dělá
1. Vezme `goal.md` (uživatelčin nápad)
2. Spustí klarifikační cyklus — doptá se na nejasnosti
3. Vygeneruje spec/plan/tasks (přes spec-kit)
4. Pro každý task → spustí novej Cloud Code agent (Ralph Wigum loop)
5. Po každém tasku → git commit
6. Možnost vrátit se v historii a forknout (jako git branche, ale klikací)

## Workflow

### Setup
```bash
# 1. Vytvoř goal.md
echo "Chci aplikaci, která..." > goal.md

# 2. Inicializuj git repo
git init && git add goal.md && git commit -m "initial goal"

# 3. Spusť DEX (až bude veřejně) nebo manuální postup níže
```

### Manuální postup (bez DEX aplikace)

**Fáze 1: Klarifikace**
```
otevři Cloud Code v projektu
"Přečti goal.md. Pokládej mi otázky, dokud nemáš jasno v: cílové skupině, hlavních fíčurách, technologickém stacku, edge cases. Na konci napiš shrnutí."
```

**Fáze 2: Spec-kit pipeline** (viz skill `spec-kit`)
```
/speckit.specify (čte goal.md → spec.md)
/speckit.plan (spec.md → plan.md)
/speckit.tasks (plan.md → tasks.md)
```

**Fáze 3: Ralph Wigum loop** (viz skill `ralph-wigum-loop`)
```
LOOP přes každou user story:
  1. Otevři Cloud Code session
  2. /speckit.implement (najde první [ ] task)
  3. Po dokončení: zkontroluj diff, git commit
  4. Ukonči session
  5. Otevři novou
UNTIL všechny [x]
```

## DEX features (pro inspiraci, až budeme stavět vlastní)

### Branch v historii
- Každý cyklus = git commit
- Můžeš se vrátit v UI o N kroků zpět
- Z toho bodu udělat fork → nová branch
- Upravit specifikaci → pokračovat jinou cestou

### Stop / Resume
- Zastavit běžící implementaci kdykoliv
- Resume od posledního commitu

### Notifikace
- Pošle ti zprávu, až je hotovo (nebo na otázku)

## Kdy použít
- Velký projekt (10+ tasků)
- Můžeš ho nechat běžet přes noc / přes víkend
- Specifikace je dobře napsaná (jinak agent narazí a zastaví)

## Kdy NEpoužívat
- Kreativní práce, kde potřebuješ iterovat
- Něco, co potřebuje tvůj feedback po každém kroku
- Malé úkoly (rychlejší dělat ručně)

## Vztah k ostatním skillům
- `spec-kit` — generuje vstupy (spec/plan/tasks)
- `ralph-wigum-loop` — pattern pro exekuci
- `claude-api` — pokud stavíš vlastní DEX-like nástroj přes Cloud Agent SDK
- `n8n` — alternativa pro workflow s deterministickými kroky
- `engineering-team` — sub-agenti pro specializované role

## Postavit vlastní DEX (mini verze)
Použij Cloud Agent SDK (skill `claude-api`):

```python
from anthropic import Anthropic
import subprocess

# 1. Načti tasks.md
tasks = read_tasks("specs/feature-x/tasks.md")

# 2. Pro každý nedokončený task
for task in tasks.unfinished():
    # 3. Spusť nového agenta s jediným taskem
    result = run_cloud_agent(
        prompt=f"Implementuj tento task: {task.description}",
        cwd="./project"
    )
    
    # 4. Ověř + commit
    if result.success:
        subprocess.run(["git", "add", "."])
        subprocess.run(["git", "commit", "-m", f"task: {task.title}"])
        mark_done(task)
    else:
        notify_owner("Agent narazil, potřebuje pomoc")
        break
```

## Origin
Lukáš z kurzu Agentic Engineering staví DEX jako open-source nástroj. Demo bude součástí kurzu, repo zatím není veřejné.
