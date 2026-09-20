# Návod krok za krokem

> **ARCHIV - nepoužívat.** Od září 2026 se balíky pro klientky staví na míru (zara-lucia, zara-camellia). Tenhle obecný balík se dál neudržuje a jsou v něm zbytky Janiných dat. Zůstává tu jen jako záloha a zdroj textů.

---

Psané pro člověka, který v terminálu není doma. Když se někde zasekneš, zkopíruj chybu a zeptej se Clauda, ten ti to přeloží.

> **Máš holubník nebo jsi na Windows?** Použij [NAVOD-KLIENTKA.md](NAVOD-KLIENTKA.md) - je tam Mac i Windows (WSL) a navíc propojení na holubník z terminálu.

---

## 1. Co musíš mít předem

1. **Mac** (funguje i na Windows/Linuxu, ale návod je pro Mac).
2. **Předplatné Claude** (Pro nebo Max) na [claude.ai](https://claude.ai).
3. **Claude Code** - nainstaluj podle [claude.com/claude-code](https://claude.com/claude-code).
   Ověření: otevři Terminál (⌘ + mezerník → napiš "Terminál") a napiš `claude --version`. Když se vypíše číslo, je to v pořádku.

---

## 2. Stáhni balíček

V Terminálu:

```bash
git clone <adresa-repozitáře> ~/zara-start
```

Když ti to napíše, že `git` neznámý, spusť `xcode-select --install` a počkej, až doinstaluje vývojářské nástroje. Pak příkaz zopakuj.

Když ses k balíčku dostala jako ZIP, rozbal ho a přesuň složku do domovského adresáře. Cesta pak musí být `~/zara-start`.

---

## 3. Spusť instalaci

```bash
cd ~/zara-start
bash install.sh
```

Instalátor:

- ověří, že máš Claude Code a Bun (Bun ti nabídne doinstalovat, řekni `a`),
- zeptá se, jak ti má Zara říkat,
- **zazálohuje** cokoliv, co už v `~/.claude` máš (do `~/.claude-zaloha-<datum>`),
- nakopíruje mozek, paměť, wiki a rozšíření.

Trvá to zhruba minutu.

---

## 4. První rozhovor

Otevři **nové** okno terminálu a napiš:

```bash
claude
```

Pak Zaře napiš:

> Přečti si skills/PAI/SKILL.md a doptej se mě, kdo jsem. Vyplň si můj profil.

Zara se tě postupně doptá na to, čím se živíš, jak chceš, aby s tebou mluvila, a co má vědět o tvé práci. Odpovědi si zapíše do `~/.claude/skills/PAI/USER/`. Kdykoliv později můžeš říct "aktualizuj si můj profil".

---

## 5. Naplň wiki (nepovinné, ale vyplatí se)

`~/business-wiki/` je znalostní báze o tvém podnikání: produkty, ceny, procesy, čísla. Zara si ji čte, kdykoliv řešíš byznys, takže přestane hádat.

Jak začít: hoď jí do složky `~/business-wiki/raw/` cokoliv, co máš (export z fakturačního systému, ceník, popisy produktů) a řekni:

> Zpracuj `raw/<soubor>` do wiki podle WIKI.md.

Pravidla struktury jsou v `~/business-wiki/WIKI.md`.

---

## 6. Klíče k placeným službám

Bez nich Zara funguje. S nimi umí navíc generovat fotky, přepisovat videa a ptát se dalších modelů. Které klíče na co a kde je vzít: **[docs/KLICE.md](docs/KLICE.md)**.

Klíče **nikdy** nepiš do souborů projektu. Patří do `~/.zshrc`:

```bash
open -e ~/.zshrc          # otevře soubor v editoru
```

Na konec přidej řádky typu `export OPENAI_API_KEY=sk-...`, ulož, zavři a spusť `source ~/.zshrc`.

---

## 7. Denní používání

| Chci | Napíšu |
|---|---|
| začít práci | `claude` v terminálu, ve složce projektu |
| aby si něco zapamatovala | "zapamatuj si, že …" |
| vědět, co se dělo v jiném okně | `/session-list` |
| druhý názor silnějšího modelu | "poraď se s fable" (potřebuje `ANTHROPIC_API_KEY`) |
| názor panelu modelů | "fusion" (potřebuje `OPENROUTER_API_KEY`) |
| přehled dovedností | "jaké skilly máš?" |

Skilly se **nespouští samy**. Zara ti napíše "pro tohle by se hodily skilly X, Y - použít?" a čeká na tvoje ano. Když víš, co chceš, napiš rovnou `/transcript`, `/fal` a podobně.

---

## 8. Když se něco pokazí

- **Zara se chová divně po instalaci** → zavři všechna okna terminálu a otevři nové. Hooky se načítají při startu.
- **Chyba "bun: command not found"** → `curl -fsSL https://bun.sh/install | bash`, pak nové okno terminálu.
- **Chci zpátky starý stav** → záloha je v `~/.claude-zaloha-<datum>`. Stačí smazat `~/.claude` a zálohu přejmenovat zpátky.
- **Skill nefunguje / je stará verze** → napiš `/plugin-troubleshooting`.

---

## 9. Bezpečnostní minimum

- Klíče nikdy do gitu. Před commitem ověř, že `.env` je v `.gitignore`.
- Zara má zapnutou kontrolu nebezpečných příkazů (mazání disku, force push), ale odpovědnost je pořád tvoje. Když se ptá "opravdu?", čti to.
- Do paměti ani do wiki nepiš hesla, čísla účtů a rodná čísla.
