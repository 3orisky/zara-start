#!/usr/bin/env bun
// advisor-cli — polož otázku Claudovi (executor), který se uprostřed přemýšlení
// poradí se silnějším poradcem (Fable 5) přes Anthropic Advisor tool (beta).
//
// Claude Code (uzavřený harness) si advisor tool do vlastního běhu injektovat
// neumí — tohle je obchvat: samostatné volání Messages API s advisor toolem.
//
// Použití:
//   bun advisor.ts "Mám spustit letní produkt za 500 Kč teď, nebo počkat?"
//   bun advisor.ts --force --executor=claude-sonnet-5 "..."   # vynutí konzultaci Fable
//   echo "dlouhý text..." | bun advisor.ts --system="Jsi stratég" -
//
// Flagy:
//   --executor=MODEL   výchozí claude-opus-4-8
//   --advisor=MODEL    výchozí claude-fable-5  (musí být >= schopnost executoru)
//   --force            tool_choice = advisor (zaručí aspoň jednu radu Fable)
//   --system=TEXT      systémový prompt
//   --max=N            max_tokens executoru (výchozí 4096)
//   --advisor-max=N    max_tokens poradce na volání (výchozí 2048, min 1024)
//   --json             vypiš celou poslední odpověď jako JSON
//   --quiet            jen výsledek, bez patičky o konzultaci
//
// Doc: https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

// --- klíč: z env nebo ze sousedního .env (Bun .env nemusí být načteno mimo cwd) ---
function loadKey(): string {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
  try {
    const env = readFileSync(join(HERE, ".env"), "utf8");
    const m = env.match(/^ANTHROPIC_API_KEY=(.+)$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  } catch {}
  console.error("Chybí ANTHROPIC_API_KEY (env ani .env vedle skriptu).");
  process.exit(1);
}

// --- argumenty ---
const args = process.argv.slice(2);
const opts: Record<string, string> = {};
const positional: string[] = [];
for (const a of args) {
  if (a.startsWith("--")) {
    const [k, v] = a.slice(2).split("=", 2);
    opts[k] = v ?? "true";
  } else positional.push(a);
}

let prompt = positional.filter((p) => p !== "-").join(" ").trim();
// stdin (když je "-" nebo když nic nepřišlo v argumentech a stdin je pipe)
if (positional.includes("-") || (!prompt && !process.stdin.isTTY)) {
  const stdin = readFileSync(0, "utf8").trim();
  prompt = (prompt ? prompt + "\n\n" : "") + stdin;
}
if (!prompt) {
  console.error('Použití: bun advisor.ts "tvá otázka"   (nebo přes stdin s "-")');
  process.exit(1);
}

const EXECUTOR = opts.executor ?? "claude-opus-4-8";
const ADVISOR = opts.advisor ?? "claude-fable-5";
const MAX = parseInt(opts.max ?? "4096", 10);
const ADVISOR_MAX = Math.max(1024, parseInt(opts["advisor-max"] ?? "2048", 10));

const advisorTool: Record<string, unknown> = {
  type: "advisor_20260301",
  name: "advisor",
  model: ADVISOR,
  max_tokens: ADVISOR_MAX,
};

const body: Record<string, unknown> = {
  model: EXECUTOR,
  max_tokens: MAX,
  tools: [advisorTool],
  messages: [{ role: "user", content: prompt }],
};
if (opts.system) body.system = opts.system;
if (opts.force) body.tool_choice = { type: "tool", name: "advisor" };

// --- agent loop: řeší pause_turn (advisor běží server-side, re-send beze změny) ---
const KEY = loadKey();
async function call(b: Record<string, unknown>) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "advisor-tool-2026-03-01",
      "content-type": "application/json",
    },
    body: JSON.stringify(b),
  });
  const j = await r.json();
  if (!r.ok) {
    console.error(`API ${r.status}:`, JSON.stringify(j.error ?? j, null, 2));
    process.exit(1);
  }
  return j;
}

let resp: any;
let advisorCalls = 0;
let advisorTokens = 0;
for (let i = 0; i < 8; i++) {
  resp = await call(body);
  for (const it of resp.usage?.iterations ?? []) {
    if (it.type === "advisor_message") {
      advisorCalls++;
      advisorTokens += it.output_tokens ?? 0;
    }
  }
  if (resp.stop_reason === "pause_turn") {
    // poradce ještě běží — přidej dosavadní obsah a pošli znovu (žádná user zpráva)
    (body.messages as unknown[]).push({ role: "assistant", content: resp.content });
    continue;
  }
  break;
}

if (opts.json) {
  console.log(JSON.stringify(resp, null, 2));
} else {
  const text = (resp.content ?? [])
    .filter((b: any) => b.type === "text")
    .map((b: any) => b.text)
    .join("\n")
    .trim();
  console.log(text);
  if (!opts.quiet) {
    const note =
      advisorCalls > 0
        ? `\n\x1b[2m— ${EXECUTOR} se ${advisorCalls}× poradil s ${ADVISOR} (${advisorTokens} tok. rady)\x1b[0m`
        : `\n\x1b[2m— ${ADVISOR} nekonzultován (executor to zvládl sám)\x1b[0m`;
    console.error(note);
  }
}
