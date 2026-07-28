#!/usr/bin/env bun
/**
 * LoadSessionMemory.hook.ts - SessionStart: Resume from checkpoint
 *
 * PURPOSE:
 * At SessionStart, check ~/.claude/session-memory/<session-id>.md. If a
 * checkpoint exists for THIS session ID (crash recovery / --resume), inject
 * a short summary into context so Claude knows where it left off.
 *
 * Also lists the 3 most recent *other* session checkpoints for quick reference.
 *
 * OUTPUT: prints markdown context to stdout (consumed by Claude Code).
 */

import { readdirSync, readFileSync, statSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const SESSION_MEMORY_DIR = join(homedir(), '.claude', 'session-memory');

interface HookInput {
  session_id: string;
  source?: string;
  hook_event_name: string;
}

async function readStdin(): Promise<HookInput | null> {
  try {
    const decoder = new TextDecoder();
    const reader = Bun.stdin.stream().getReader();
    let input = '';
    const timeoutPromise = new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
    const readPromise = (async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        input += decoder.decode(value, { stream: true });
      }
    })();
    await Promise.race([readPromise, timeoutPromise]);
    return input ? JSON.parse(input) : null;
  } catch {
    return null;
  }
}

function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const out: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (m) out[m[1]] = m[2].replace(/^"|"$/g, '').replace(/^'|'$/g, '');
  }
  return out;
}

function lastTurns(content: string, n: number): string {
  const parts = content.split(/\n---\n\n/);
  return parts.slice(-n).join('\n---\n\n');
}

async function main() {
  const input = await readStdin();
  if (!input?.session_id) process.exit(0);

  if (!existsSync(SESSION_MEMORY_DIR)) {
    mkdirSync(SESSION_MEMORY_DIR, { recursive: true });
    process.exit(0);
  }

  const currentFile = join(SESSION_MEMORY_DIR, `${input.session_id}.md`);
  const lines: string[] = [];

  // Current session resume (crash recovery)
  if (existsSync(currentFile)) {
    const content = readFileSync(currentFile, 'utf-8');
    const fm = parseFrontmatter(content);
    lines.push('## 🔁 Session Memory — Resuming Previous State');
    lines.push('');
    lines.push(`Tato session (\`${input.session_id}\`) už má checkpoint. Shrnutí:`);
    lines.push('');
    lines.push(`- **Téma:** ${fm.topic || 'untitled'}`);
    lines.push(`- **Start:** ${fm.started || '?'}`);
    lines.push(`- **Poslední aktivita:** ${fm.last_activity || '?'}`);
    lines.push(`- **Počet tahů:** ${fm.turns || '?'}`);
    lines.push('');
    lines.push('**Poslední 2 tahy pro rychlý kontext:**');
    lines.push('');
    lines.push(lastTurns(content, 2));
    lines.push('');
    lines.push(`Plný checkpoint: \`${currentFile}\``);
    lines.push('');
  }

  // Recent other sessions for reference
  try {
    const files = readdirSync(SESSION_MEMORY_DIR)
      .filter((f) => f.endsWith('.md') && f !== `${input.session_id}.md`)
      .map((f) => {
        const p = join(SESSION_MEMORY_DIR, f);
        return { name: f, path: p, mtime: statSync(p).mtimeMs };
      })
      .sort((a, b) => b.mtime - a.mtime)
      .slice(0, 3);

    if (files.length > 0) {
      lines.push('## 📚 Nedávné session checkpointy (ostatní okna)');
      lines.push('');
      for (const f of files) {
        try {
          const content = readFileSync(f.path, 'utf-8');
          const fm = parseFrontmatter(content);
          const id = f.name.replace('.md', '');
          lines.push(`- \`${id.slice(0, 8)}…\` — ${fm.topic || 'untitled'} *(${fm.last_activity || '?'})*`);
        } catch {
          continue;
        }
      }
      lines.push('');
      lines.push('Pro správu: `/session-list`, `/session-clear <id>`, `/session-wipe`.');
      lines.push('');
    }
  } catch {
    // ignore
  }

  if (lines.length > 0) {
    console.log(lines.join('\n'));
  }
  process.exit(0);
}

main();
