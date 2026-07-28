# Co Zara umí

99 skillů a 12 agentů. Nemusíš je znát nazpaměť - stačí říct, co potřebuješ, a Zara sama navrhne, který použít. Když víš, co chceš, napiš rovnou `/nazev-skillu`.

**Skilly se nespouští samy.** Zara se nejdřív zeptá "použít?" a čeká na tvoje ano. Tak se nestane, že ti bez ptaní spálí čas a peníze.

---

## Jádro systému

| Skill | Na co |
|---|---|
| `PAI` | mozek celého systému, jak Zara přemýšlí a v jakých krocích |
| `PAIUpgrade` | aktualizace systému na novější verzi |
| `Agents` | vytvoření vlastního specializovaného agenta |
| `CreateSkill`, `skill-creator` | naučíš Zaru novou dovednost |
| `CreateCLI` | vygeneruje ti vlastní příkaz do terminálu |
| `plugin-troubleshooting` | když skill nefunguje nebo drží starou verzi |
| `VoiceServer` | hlasová oznámení |
| `Evals` | testy, jestli agent dělá, co má |

## Přemýšlení a rozhodování

| Skill | Na co |
|---|---|
| `advisor` | druhý názor od silnějšího modelu uprostřed práce (klíč Anthropic) |
| `fusion` | panel modelů (Claude + GPT + Gemini) na jednu otázku, soudce je sjednotí (klíč OpenRouter) |
| `Council` | debata více úhlů pohledu nad tvým rozhodnutím |
| `FirstPrinciples` | rozložení problému na základní principy |
| `BeCreative` | režim hlubokého přemýšlení |
| `Prompting` | jak psát lepší zadání |
| `Telos` | tvoje cíle, mise, výzvy - kompas, ke kterému se Zara vrací |
| `Aphorisms` | sbírka tvých hlášek a citátů |

## Rešerše a obsah

| Skill | Na co |
|---|---|
| `Research` | rešerše na webu ve třech hloubkách (rychlá / standardní / důkladná) |
| `Fabric` | 240+ hotových vzorců na analýzu textu (shrň, vytěž moudrost, najdi rizika) |
| `NotebookLM` | práce s Google NotebookLM přes API |
| `YouTubeSearch` | hledání a analýza videí |
| `transcript` | přepis a překlad videa do češtiny (YouTube, Instagram, TikTok, X, FB) |
| `captions` | titulky z lokálního videa (SRT) |
| `Apify`, `BrightData` | stahování dat z webu a sociálních sítí |

## Obrázky, video, zvuk

| Skill | Na co |
|---|---|
| `Art` | ilustrace, diagramy, vizualizace |
| `fal` | generování a editace fotek, konzistentní postava napříč fotkami |
| `magnific` | upscaling, video (Kling, Hailuo), hudba, odstranění pozadí |
| `heygen-hyperframes` | video s mluvícím avatarem |
| `remotion` | video z Reactu (shorts, reels) |
| `lukas-image-generation`, `lukas-image-sourcing` | generování a hledání obrázků |
| `lukas-video-generation`, `lukas-music-generation`, `lukas-speech-generation` | video, hudba, namluvení textu |
| `diagram-generation` | schémata a diagramy (Mermaid, D3, Draw.io) |
| `blender-3d` | 3D modely |

## Web, design, nasazení

| Skill | Na co |
|---|---|
| `Browser` | ovládání prohlížeče, screenshoty, ladění webu |
| `AgentBrowser` | rychlý headless prohlížeč pro agenty |
| `web-design-guidelines` | pravidla dobrého webu |
| `lukas-styleguide`, `lukas-design-system` | vizuální identita, paleta, typografie, kontrast |
| `lukas-frontend-aesthetics` | "vypadá to genericky" → konkrétní návod, jak to zlepšit |
| `lukas-icon-library`, `lukas-svg-mastery` | ikony a práce s SVG |
| `deploy-to-vercel`, `vercel-*` | nasazení a osvědčené postupy pro React/Next |

## Vývoj a projekty

| Skill | Na co |
|---|---|
| `engineering-team` | 23 rolí (architekt, frontend, backend, QA, DevOps, bezpečnost) |
| `spec-kit` | specifikace projektu před psaním kódu |
| `dex-orchestrator`, `ralph-wigum-loop` | dlouhá autonomní implementace, "pusť to a jdi spát" |
| `lukas-work-planning`, `lukas-infrastructure-planning` | plánování práce a infrastruktury |
| `lukas-git-pr` | branch, commit, pull request jedním příkazem |
| `lukas-dead-code`, `lukas-update-dependencies` | úklid mrtvého kódu, aktualizace závislostí |
| `lukas-update-docs`, `lukas-update-readme`, `lukas-sync-spec-kit` | dokumentace, která nezastarává |
| `composio`, `n8n`, `langflow` | propojování aplikací a automatizace |

## Kancelář a byznys

| Skill | Na co |
|---|---|
| `Documents` | zpracování PDF, Wordu, tabulek |
| `lukas-docx`, `lukas-pptx`, `lukas-xlsx` | Word, PowerPoint, Excel na míru |
| `office-creative-workflow` | prezentace a marketingové materiály přes Gamma a Canvu |
| `gws-gmail*` | čtení, třídění, psaní a odesílání pošty |
| `gws-calendar*` | kalendář a schůzky |
| `gws-drive*`, `gws-docs*`, `gws-forms` | Disk, dokumenty, formuláře |
| `lukas-stripe` | platby, předplatné, faktury |
| `lukas-zasilkovna` | zásilkovna a doprava |

## Bezpečnost

| Skill | Na co |
|---|---|
| `WebAssessment`, `RedTeam`, `Recon` | bezpečnostní audit vlastního webu |
| `PromptInjection` | obrana proti podvrženým instrukcím v obsahu |
| `OSINT`, `PrivateInvestigator` | prověření protistrany z veřejných zdrojů |
| `SECUpdates`, `AnnualReports` | bezpečnostní novinky a reporty |

---

## Agenti

Agent je samostatný pracant, kterému Zara předá kus práce. Spouští se sami podle typu úkolu.

| Agent | Co dělá |
|---|---|
| `Engineer` | implementace, testy, refaktoring |
| `Architect` | návrh systému, specifikace, plán |
| `Designer` | UX a UI |
| `QATester` | ověří, že to fakt funguje, než se řekne hotovo |
| `Intern` | chytrý generalista na složité zamotané zadání |
| `Algorithm` | hlídá kvalitu a kritéria hotového výsledku |
| `Artist` | vizuály |
| `ClaudeResearcher`, `GeminiResearcher`, `GrokResearcher`, `CodexResearcher` | rešerše z různých modelů a úhlů |
| `Pentester` | bezpečnostní testování |

---

## Co v balíčku není

Skilly navázané na konkrétní podnikání původní majitelky (její marketingová metodika, SEO postupy pro její web, její produktová AI). Chybí i její paměť a wiki obsah. Kostra a pravidla zůstaly, obsah si naplníš vlastní.
