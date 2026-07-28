/**
 * claude-telefon — samostatný Telegram bot, který na Macu spouští Claude Code.
 * Žádná Rozárka, žádný Tailscale, žádný holubník. Jeden soubor, čistý Bun + fetch.
 *
 * Tok:  telefon (Telegram) → bot (běží na Macu, polluje Telegram) → claude -p → výsledek zpět.
 * Spuštění:  bun run bot.ts   (nebo přes run.sh / launchd)
 *
 * .env:
 *   TELEGRAM_BOT_TOKEN=   (od @BotFather)
 *   TELEGRAM_CHAT_ID=     (tvé číselné chat id — jen ty smíš bota ovládat)
 *   WORKDIR=__HOME__/Projects   (kde Claude pracuje)
 */

import { spawn } from "bun";
import { homedir } from "os";

const BOT = process.env.TELEGRAM_BOT_TOKEN ?? "";
const CHAT = process.env.TELEGRAM_CHAT_ID ?? "";
const WORKDIR = process.env.WORKDIR ?? `${homedir()}/Projects`;

if (!BOT) {
  console.error("✗ Chybí TELEGRAM_BOT_TOKEN v .env");
  process.exit(1);
}

const API = `https://api.telegram.org/bot${BOT}`;

// Allowlist — Claude smí jen tohle. Cokoli mimo se s dontAsk tiše odmítne.
const ALLOWED_TOOLS = [
  "Read", "Edit", "Write", "Glob", "Grep",
  "Bash(git *)", "Bash(bun *)", "Bash(npm *)", "Bash(node *)",
  "Bash(ls *)", "Bash(cat *)", "Bash(pwd)", "Bash(echo *)",
  "Bash(mkdir *)", "Bash(grep *)", "Bash(find *)", "Bash(rg *)",
  "Bash(python3 *)",
];

// session_id pro každý chat → plynulé navazování konverzace
const sessions: Record<string, string> = {};

// Odstraní PAI šum (hlavička 🤖, oddělovače ═, závěrečné 🗣️).
function cleanResult(s: string): string {
  return s
    .replace(/^🤖[^\n]*\n+/gm, "")
    .replace(/^[═\s]*PAI ALGORITHM[^\n]*\n+/gim, "")
    .replace(/^[═]{3,}\s*$/gm, "")
    .replace(/^🗣️[^\n]*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function tg(method: string, payload: Record<string, unknown>) {
  return fetch(`${API}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

async function send(chatId: string, text: string) {
  // fallback: když čištění vše smaže, pošli aspoň surový text (nikdy ne prázdno)
  const t = cleanResult(text) || text.trim() || "(Claude nevrátil text — zkus úkol přeformulovat.)";
  const MAX = 4000;
  for (let i = 0; i < t.length; i += MAX) {
    await tg("sendMessage", { chat_id: chatId, text: t.slice(i, i + MAX) });
  }
}

// Spustí claude headless a vrátí {text, sessionId}.
async function runClaude(chatId: string, task: string): Promise<{ text: string; sessionId?: string }> {
  const args = ["-p", task, "--output-format", "json", "--permission-mode", "dontAsk"];
  for (const t of ALLOWED_TOOLS) args.push("--allowedTools", t);
  if (sessions[chatId]) args.push("--resume", sessions[chatId]);

  const proc = spawn(["claude", ...args], {
    cwd: WORKDIR,
    stdout: "pipe",
    stderr: "pipe",
    env: { ...process.env },
  });
  const out = await new Response(proc.stdout).text();
  const err = await new Response(proc.stderr).text();
  const code = await proc.exited;

  if (code !== 0 && !out.trim()) {
    return { text: `❌ Chyba: ${err.slice(0, 800) || "claude skončil s kódem " + code}` };
  }
  try {
    const data = JSON.parse(out);
    return { text: data.result ?? out, sessionId: data.session_id };
  } catch {
    return { text: out.slice(0, 6000) };
  }
}

// ── Dlouhý polling Telegramu ────────────────────────────────────────
let offset = 0;
console.log(`🤖 claude-telefon běží. WORKDIR=${WORKDIR}. Povolený chat: ${CHAT || "(zatím nikdo)"}`);

while (true) {
  try {
    const res = await fetch(`${API}/getUpdates?timeout=30&offset=${offset}`);
    const data = (await res.json()) as any;
    for (const upd of data.result ?? []) {
      offset = upd.update_id + 1;
      const msg = upd.message;
      if (!msg?.text) continue;
      const chatId = String(msg.chat.id);
      const text = msg.text.trim();

      // Bezpečnost: jen povolený chat
      if (CHAT && chatId !== CHAT) {
        await tg("sendMessage", { chat_id: chatId, text: `⛔ Nemáš přístup.\nTvoje Chat ID: ${chatId}` });
        continue;
      }
      // Když ještě nikdo není povolený, prozraď chat id pro nastavení
      if (!CHAT) {
        await tg("sendMessage", { chat_id: chatId, text: `Tvoje Chat ID je: ${chatId}\nVlož ho do .env jako TELEGRAM_CHAT_ID a restartuj.` });
        continue;
      }
      if (text === "/start") { await send(chatId, "Ahoj 🪄 Napiš mi úkol (česky, normálně) a spustím ho v Claudovi na laptopu.\n\n/okno = otevři okno na Macu a dopíšu to u počítače (naváže na naši konverzaci)\n/new = nová konverzace"); continue; }
      // /okno — otevři živé okno Terminálu na Macu, navázané na tuhle konverzaci (handoff k počítači)
      if (text === "/okno" || text === "/window") {
        const sid = sessions[chatId];
        const shellCmd = `cd '${WORKDIR}' && claude ${sid ? `--resume ${sid} ` : ""}`;
        const esc = shellCmd.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
        spawn(["osascript", "-e", `tell application "Terminal"\nactivate\ndo script "${esc}"\nend tell`]);
        await send(chatId, sid
          ? "🪄 Otevřela jsem okno na Macu — navazuje na naši konverzaci. Sedni k počítači a dopiš to. (Až skončíš, klidně piš zase sem.)"
          : "🪄 Otevřela jsem na Macu čisté okno Clauda. Sedni k počítači.");
        continue;
      }
      // /new — i když je na stejném řádku: vyresetuj a zbytek řádku ber jako úkol
      let task = text;
      if (task === "/new") { delete sessions[chatId]; await send(chatId, "🆕 Nová konverzace. Napiš úkol."); continue; }
      if (task.startsWith("/new ")) { delete sessions[chatId]; task = task.slice(5).trim(); }

      if (!task) { await send(chatId, "Napiš mi po /new i samotný úkol. 🪄"); continue; }
      await tg("sendChatAction", { chat_id: chatId, action: "typing" });
      console.log(`▶ úkol: ${task.slice(0, 70)}`);
      const { text: result, sessionId } = await runClaude(chatId, task);
      if (sessionId) sessions[chatId] = sessionId;
      await send(chatId, result);
      console.log(`■ odesláno (session ${sessionId ?? "?"})`);
    }
  } catch (e) {
    console.error("polling chyba:", e instanceof Error ? e.message : e);
    await new Promise((r) => setTimeout(r, 3000));
  }
}
