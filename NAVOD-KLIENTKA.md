# Claude Code + Zara + holubník na tvém počítači

Návod krok za krokem pro klientku, která má (nebo bude mít) holubník a chce ho ovládat
i z počítače, ne jenom z Telegramu.

Psané pro člověka, který v terminálu není doma. Když se někde zasekneš, zkopíruj celou
chybu a pošli ji Janě nebo ji vlož Claudovi do okna, přeloží ti to.

**Co získáš:**

1. **Claude Code** = Claude přímo v počítači. Vidí tvoje soubory, umí je psát a upravovat.
2. **Zara** = mozek nad Claude Code. Paměť, dovednosti (skilly), tvoje wiki, tvůj styl.
3. **Propojení na holubník** = z terminálu napíšeš `holubnik "napiš newsletter o migrénách"`
   a Rozárka to zařídí. Stejné, jako kdybys jí psala do Telegramu, jen z počítače
   a s pořádnou klávesnicí.

Čas: **cca 45 minut** na Macu, **cca hodina** na Windows (kvůli jednomu doinstalování navíc).

---

## Co potřebuješ mít po ruce, než začneš

| Věc | Kde ji vzít |
|---|---|
| **Předplatné Claude Pro nebo Max** | [claude.ai](https://claude.ai) → Upgrade. Free plán Claude Code neumí. |
| **Balíček „zara-start"** | Pozvánku do repozitáře nebo ZIP dostaneš od Jany. |
| **Údaje k holubníku** | Od Jany: adresa serveru, SSH přihlášení, případně adresa API a token. |
| **4 GB RAM a novější systém** | macOS 13 a výš, Windows 10 (verze 1809) a výš. |

> Holubník ti běží na **vlastním serveru**. Nic z toho, co teď instaluješ, ho nenahrazuje
> ani nepřesouvá. Instaluješ si jenom **ovladač** - okno, kterým do něj mluvíš.

---

# ČÁST A - Mac

## A1. Otevři Terminál

Stiskni **⌘ + mezerník**, napiš `Terminál`, potvrď Enterem. Otevře se černé (nebo bílé)
okno, kam se píšou příkazy. Vždycky, když v návodu uvidíš rámeček s příkazem, zkopíruj
ho tam a dej Enter.

## A2. Nainstaluj Claude Code

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Až to doběhne, **zavři okno terminálu a otevři nové** (jinak příkaz `claude` ještě nezná).
Ověř:

```bash
claude --version
```

Musí vypsat číslo verze. Pokud píše `command not found`, přidej si cestu:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## A3. První přihlášení

```bash
claude
```

Otevře se prohlížeč, přihlas se svým účtem Claude. Pak v okně Clauda napiš `/exit`
a jsi zpátky v terminálu.

## A4. Stáhni balíček Zara

```bash
git clone https://github.com/3orisky/zara-start.git ~/zara-start
```

Když napíše, že `git` nezná, spusť `xcode-select --install`, počkej, až se doinstalují
vývojářské nástroje (pár minut), a příkaz zopakuj.

Když jsi dostala ZIP: rozbal ho a přesuň složku do domovského adresáře tak, aby cesta
byla `~/zara-start`.

## A5. Nainstaluj Zaru

```bash
cd ~/zara-start
bash install.sh
```

Instalátor:

- ověří Claude Code a Bun (Bun ti nabídne doinstalovat, odpověz `a`),
- zeptá se, jak ti má Zara říkat,
- **zazálohuje** cokoliv, co už v `~/.claude` máš, do `~/.claude-zaloha-<datum>`,
- nakopíruje mozek, paměť, wiki a rozšíření.

Trvá to zhruba minutu. Potom **zavři terminál a otevři nový**.

**Pokračuj na ČÁST C.**

---

# ČÁST B - Windows

Na Windows jsou dvě cesty. Pro Zaru potřebuješ tu první.

| | Co to je | Kdy |
|---|---|---|
| **WSL 2** (doporučeno) | Linux uvnitř Windows, jedno okno navíc | **Když chceš Zaru.** Instalátor Zary a její hooky jsou psané pro Linux/Mac prostředí. |
| Nativní Windows | Claude Code přímo v PowerShellu | Když chceš jenom holý Claude Code bez Zary. |

Návod jede přes **WSL 2**. Není to virtuál, který by ses musela učit - je to jenom další
okno terminálu, které se chová jako Mac.

## B1. Zapni WSL 2

Klikni na **Start**, napiš `PowerShell`, klikni pravým na *Windows PowerShell* → **Spustit
jako správce**. Do okna napiš:

```powershell
wsl --install
```

Nainstaluje se Ubuntu. **Restartuj počítač.** Po restartu se Ubuntu samo otevře
a zeptá se na:

- **uživatelské jméno** - malá písmena bez diakritiky, např. `jana`,
- **heslo** - při psaní se nezobrazuje ani hvězdičkami, to je normální. Zapamatuj si ho,
  budeš ho potřebovat u příkazů se `sudo`.

Od teď platí: **všechno další píšeš do okna Ubuntu**, ne do PowerShellu.
Najdeš ho v nabídce Start pod názvem **Ubuntu**.

> Když `wsl --install` skončí chybou, zapni ve *Vlastnosti systému Windows* položky
> „Platforma virtuálního počítače" a „Podsystém Windows pro Linux", restartuj
> a příkaz zopakuj.

## B2. Připrav Ubuntu

V okně Ubuntu:

```bash
sudo apt update && sudo apt install -y curl git unzip
```

(Vypíše žádost o heslo - to z kroku B1.)

## B3. Nainstaluj Claude Code

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Zavři okno Ubuntu, otevři nové a ověř:

```bash
claude --version
```

Když píše `command not found`:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

## B4. První přihlášení

```bash
claude
```

Otevře se prohlížeč ve Windows, přihlas se účtem Claude. Pak napiš `/exit`.

## B5. Stáhni a nainstaluj Zaru

```bash
git clone https://github.com/3orisky/zara-start.git ~/zara-start
cd ~/zara-start
bash install.sh
```

Instalátor napíše varování, že je psaný pro macOS. **To je v pořádku**, v Ubuntu doběhne.
Odpověz `a` na doinstalování Bunu a zadej svoje jméno.

Potom zavři okno Ubuntu a otevři nové.

## B6. Kde mám svoje soubory?

Ubuntu má vlastní domovskou složku. Ke svým dokumentům z Windows se dostaneš přes:

```bash
cd /mnt/c/Users/<TvojeWindowsJmeno>/Documents
```

A naopak - do složek Ubuntu se dostaneš z Průzkumníka souborů: do adresního řádku
napiš `\\wsl$\Ubuntu\home\<tvoje-jmeno>`.

Doporučení: pracovní soubory pro Zaru drž v Ubuntu (`~/Projects/...`), je to výrazně
rychlejší než přes `/mnt/c`.

---

# ČÁST C - První rozhovor se Zarou

V terminálu (Mac: Terminál, Windows: Ubuntu) napiš:

```bash
claude
```

A pak Zaře napiš tohle:

> Přečti si skills/PAI/SKILL.md a doptej se mě, kdo jsem. Vyplň si můj profil.

Zara se tě postupně zeptá, čím se živíš, jak s tebou má mluvit a co má vědět o tvé
práci. Odpovědi si uloží do `~/.claude/skills/PAI/USER/`. Kdykoliv později můžeš říct
„aktualizuj si můj profil".

**Ověření, že žije paměť:** napiš „zapamatuj si, že moje hlavní cílovka jsou …",
zavři okno, otevři nové a zeptej se „co víš o mojí cílovce?".

## Naplň wiki (nepovinné, ale vyplatí se)

`~/business-wiki/` je znalostní báze o tvém podnikání: produkty, ceny, procesy, čísla.
Zara si ji čte, kdykoliv řešíš byznys, a přestane hádat. Hoď do `~/business-wiki/raw/`
cokoliv, co máš (ceník, export z fakturace, popisy produktů) a řekni:

> Zpracuj `raw/<soubor>` do wiki podle WIKI.md.

---

# ČÁST D - Propojení na holubník

Teď to hlavní. Holubník má vlastní HTTP API, přes které s ním mluví Telegram
i dashboard. Stejným API ho budeš ovládat z počítače příkazem `holubnik`.

```
holubnik "napiš newsletter o migrénách"   # pošle příkaz Rozárce
holubnik tasks                            # nástěnka úkolů
holubnik usage                            # kolik se utratilo (tokeny / Kč)
holubnik agents                           # stav holoubků
holubnik memory rozarka                   # co si který holoubek pamatuje
holubnik health                           # žije to?
holubnik restart                          # restart celého holubníku (jen přes SSH na serveru)
holubnik help
```

> **Důležité k penězům:** příkaz z terminálu běží přes **API klíč tvého holubníku**,
> ne z tvého předplatného Claude. Tzn. `holubnik "…"` se ti objeví ve vyúčtování
> Anthropicu stejně jako práce holoubků. Naopak `claude` v terminálu (Zara) jede
> z tvého předplatného Pro/Max. Jsou to dvě oddělené peněženky.

Vyber si jednu ze dvou cest. **D1 je jednodušší a bezpečnější**, D2 je pohodlnější.

## D1. Přes SSH na server (doporučeno pro začátek)

Nic se nenastavuje, nic se nevystavuje do internetu. CLI je na serveru už nainstalované
a token si najde samo.

```bash
ssh uzivatel@adresa-tvojeho-serveru
holubnik "napiš newsletter o migrénách"
```

Údaje (`uzivatel`, adresa, heslo nebo klíč) dostaneš od Jany. Když se ptá
`Are you sure you want to continue connecting?`, napiš `yes`.

Odhlášení ze serveru: `exit`.

**Zjednodušení, ať to nemusíš psát celé.** Na svém počítači spusť:

```bash
echo 'alias holubnik-ssh="ssh -t uzivatel@adresa-serveru holubnik"' >> ~/.zshrc   # Mac
# na Windows/WSL místo toho:  >> ~/.bashrc
```

Otevři nové okno a pak už stačí:

```bash
holubnik-ssh "co je dneska na nástěnce?"
```

## D2. Přímo ze svého počítače (přes HTTPS)

Tohle vyžaduje, aby **Jana jednorázově zapnula bránu** na serveru (subdoména + certifikát
+ token, viz Část F). Od ní dostaneš dva údaje: **adresu API** a **token**.

**Krok 1 - Bun** (Mac i WSL stejně; když jsi instalovala Zaru, už ho máš):

```bash
curl -fsSL https://bun.sh/install | bash
```

**Krok 2 - stáhni ovladač:**

```bash
mkdir -p ~/bin
curl -fsSL <odkaz-na-holubnik.ts-od-Jany> -o ~/bin/holubnik.ts
```

Případně ti soubor `holubnik.ts` pošle Jana napřímo a ty ho jen ulož do `~/bin/`.

**Krok 3 - udělej z něj příkaz:**

```bash
printf '#!/usr/bin/env bash\nexec bun ~/bin/holubnik.ts "$@"\n' > ~/bin/holubnik
chmod +x ~/bin/holubnik
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshrc     # na Windows/WSL: >> ~/.bashrc
```

**Krok 4 - nastav adresu a token:**

```bash
echo 'export HOLUBNIK_URL="https://api.tvuj-holubnik.cz/api"' >> ~/.zshrc
echo 'export HOLUBNIK_TOKEN="token-ktery-ti-dala-jana"' >> ~/.zshrc
source ~/.zshrc
```

(Na Windows/WSL zaměň `~/.zshrc` za `~/.bashrc`.)

**Krok 5 - ověř:**

```bash
holubnik health
holubnik "ahoj, ozvi se"
```

Když to napíše `403 - chybí/nesedí token`, token nesedí s tím, co je na serveru.
Když `Nepřipojím se k holubníku`, buď neběží služba, nebo je špatná adresa.

## D3. Ať to za tebe dělá Zara (nejpohodlnější)

Nemusíš si pamatovat příkazy. Řekni Zaře v okně `claude`:

> Do mého `~/.claude/CLAUDE.md` přidej tenhle blok:
>
> ```
> ## Holubník
> Můj tým AI agentů (holubník) běží na vlastním serveru a ovládá se příkazem `holubnik`
> v terminálu. Když ti řeknu něco, co má udělat holubník (napiš newsletter, co je na
> nástěnce, kolik jsme utratili, co dělá který holoubek), použij:
>   holubnik "<příkaz přirozenou řečí>"   - úkol pro Rozárku
>   holubnik tasks | usage | agents | health | memory <holoubek>
> Než pošleš úkol, ukaž mi znění příkazu a počkej na moje ano.
> Pozor: tyhle příkazy se účtují z API klíče holubníku, ne z mého předplatného.
> ```

Od té chvíle stačí Zaře napsat „zeptej se holubníku, co je na nástěnce" a ona to spustí,
výstup ti přeloží do lidské řeči a může na něj rovnou navázat (třeba text upravit
a poslat zpátky).

---

# ČÁST E - Denní používání

| Chci | Napíšu |
|---|---|
| začít práci se Zarou | `claude` v terminálu, ve složce projektu |
| aby si Zara něco zapamatovala | „zapamatuj si, že …" |
| co se dělo v jiném okně | `/session-list` |
| přehled dovedností | „jaké skilly máš?" |
| úkol pro holubník | `holubnik "…"` nebo Zaře „zadej holubníku …" |
| co holubník dělal | `holubnik tasks` |
| kolik holubník stojí | `holubnik usage` |
| holubník nereaguje | `holubnik health`, pak `holubnik restart` (přes SSH) |

**Telegram nikam nemizí.** Ovládání z počítače je navíc, ne místo něj. Karty ke
schvalování, hlasovky a rychlé „ano/ne" jsou v Telegramu dál pohodlnější. Počítač je
na dlouhé zadání, práci s texty a na to, když chceš vidět víc než jednu obrazovku.

Skilly Zary se **nespouští samy**. Zara ti napíše „pro tohle by se hodily skilly X, Y -
použít?" a čeká na tvoje ano. Když víš, co chceš, napiš rovnou `/transcript`, `/fal` a podobně.

---

# ČÁST F - Co musí udělat Jana (checklist pro poskytovatele)

Klientka si sama neudělá tohle:

**Vždycky:**

1. Pozvat klientku do repozitáře `3orisky/zara-start` (`gh repo add-collaborator 3orisky/zara-start <username>`), nebo jí poslat ZIP.
2. Vytvořit jí na serveru holubníku uživatelský účet pro SSH a poslat přihlašovací údaje
   bezpečným kanálem (ne e-mailem v plain textu).
3. Ověřit, že `holubnik` CLI je na serveru nainstalované (`/usr/local/bin/holubnik`)
   a že `holubnik health` z její SSH session odpoví.

**Jen když chce variantu D2 (vzdálený přístup):**

4. Subdoména (např. `api.holubnik-klientky.cz`), A záznam na IP serveru.
5. Zkopírovat `deploy/nginx-holubnik-api.conf.example` do `/etc/nginx/sites-available/holubnik-api.conf`,
   přepsat `server_name` a `$expected` token.
6. `ln -s ../sites-available/holubnik-api.conf /etc/nginx/sites-enabled/`
7. `certbot --nginx -d api.holubnik-klientky.cz`
8. Do `.env` holubníku dát `ADMIN_TOKEN=<stejný token>`, restartovat službu.
9. `nginx -t && systemctl reload nginx`
10. Poslat klientce adresu API + token a soubor `scripts/holubnik.ts`.

**Nikdy:** neotvírat port 3001 přímo do internetu. API poslouchá jen na `127.0.0.1`
a ven smí výhradně přes nginx s tokenem a TLS.

---

# ČÁST G - Když se něco pokazí

| Problém | Řešení |
|---|---|
| `claude: command not found` | Zavři a otevři nové okno terminálu. Pořád nic → `export PATH="$HOME/.local/bin:$PATH"` do `~/.zshrc` (Mac) nebo `~/.bashrc` (WSL). |
| `bun: command not found` | `curl -fsSL https://bun.sh/install | bash`, pak nové okno. |
| Zara se chová divně hned po instalaci | Zavři **všechna** okna terminálu a otevři nové. Hooky se načítají při startu. |
| Chci zpátky stav před instalací Zary | Záloha je v `~/.claude-zaloha-<datum>`. Smaž `~/.claude` a zálohu přejmenuj zpátky. |
| `403` u příkazu `holubnik` | Token nesedí. Zkontroluj `HOLUBNIK_TOKEN` proti `ADMIN_TOKEN` na serveru. |
| `Nepřipojím se k holubníku` | Špatná adresa, nebo neběží služba. Přes SSH: `systemctl status holoubci`. |
| `holubnik restart` nefunguje z počítače | Restart jde jen na serveru (SSH), nebo přes Telegram příkaz `/restart`. |
| Windows: `wsl --install` hlásí chybu | Zapni „Platforma virtuálního počítače" a „Podsystém Windows pro Linux" ve funkcích Windows, restartuj. |
| Cokoliv jiného | `claude doctor` vypíše diagnostiku instalace. Nebo chybu zkopíruj a pošli Janě. |

---

# ČÁST H - Bezpečnostní minimum

- **Klíče a tokeny nikdy nepiš do souborů projektu.** Patří do `~/.zshrc` / `~/.bashrc`
  nebo do `.env`, který je v `.gitignore`.
- `HOLUBNIK_TOKEN` má stejnou sílu jako klíč od celého holubníku. Když unikne, řekni
  Janě, ať ho vymění (změna na dvou místech, zabere minutu).
- Do paměti Zary ani do wiki nepiš hesla, čísla účtů a rodná čísla.
- Zara se u nebezpečných příkazů (mazání, přepis) ptá „opravdu?". Čti to, odpovědnost
  je pořád tvoje.
- Když počítač ztratíš nebo prodáváš: smaž `~/.claude`, `~/zara-start` a řádky
  s tokeny z `~/.zshrc` / `~/.bashrc`, a nech Janu vyměnit token.
