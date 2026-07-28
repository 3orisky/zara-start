#!/usr/bin/env bun
/**
 * SessionCheckpoint.hook.ts - Per-Session Full Memory Checkpoint
 *
 * PURPOSE:
 * Writes/updates a human-readable markdown checkpoint of the full session to
 * ~/.claude/session-memory/<session-id>.md after every assistant response.
 *
 * This gives the user a temporary memory she can read, resume from, and wipe.
 *
 * TRIGGER: Stop
 * OUTPUT: Markdown file per session ID. Overwrites each time (stays in sync).
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const SESSION_MEMORY_DIR = join(homedir(), '.claude', 'session-memory');

interface HookInput {
  session_id: string;
  transcript_path: string;
  hook_event_name: string;
}

async function readStdin(): Promise<HookInput | null> {
  try {
    const decoder = new TextDecoder();
    const reader = Bun.stdin.stream().getReader();
    let input = '';
    const timeoutPromise = new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 500);
    });
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

function extractText(content: any): string {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((block) => {
        if (typeof block === 'string') return block;
        if (block?.type === 'text') return block.text || '';
        if (block?.type === 'tool_use') {
          const name = block.name || 'tool';
          const input = block.input ? JSON.stringify(block.input).slice(0, 300) : '';
          return `\n> **[tool: ${name}]** ${input}${input.length >= 300 ? '…' : ''}`;
        }
        if (block?.type === 'tool_result') {
          const result =
            typeof block.content === 'string'
              ? block.content.slice(0, 500)
              : JSON.stringify(block.content || '').slice(0, 500);
          return `\n> **[tool result]** ${result}${result.length >= 500 ? '…' : ''}`;
        }
        return '';
      })
      .filter(Boolean)
      .join('\n');
  }
  return '';
}

function isHiddenUserText(text: string): boolean {
  const t = text.trim();
  if (!t) return true;
  if (t.startsWith('<command-name>')) return true;
  if (t.startsWith('<system-reminder>')) return true;
  if (t.startsWith('<local-command-stdout>')) return true;
  if (t.startsWith('<user-prompt-submit-hook>')) return true;
  if (t.startsWith('Caveat: The messages below')) return true;
  return false;
}

function parseTranscript(path: string): Array<{ role: string; text: string; ts?: string }> {
  if (!existsSync(path)) return [];
  const lines = readFileSync(path, 'utf-8').split('\n').filter(Boolean);
  const turns: Array<{ role: string; text: string; ts?: string }> = [];
  for (const line of lines) {
    try {
      const entry = JSON.parse(line);
      if (entry.type !== 'user' && entry.type !== 'assistant') continue;
      const msg = entry.message;
      if (!msg) continue;
      const text = extractText(msg.content);
      if (!text) continue;
      if (entry.type === 'user' && isHiddenUserText(text)) continue;
      turns.push({ role: entry.type, text, ts: entry.timestamp });
    } catch {
      continue;
    }
  }
  return turns;
}

function firstUserLine(turns: Array<{ role: string; text: string }>): string {
  const first = turns.find((t) => t.role === 'user');
  if (!first) return 'untitled';
  const line = first.text.trim().split('\n')[0].slice(0, 80);
  return line || 'untitled';
}

function formatCheckpoint(sessionId: string, turns: Array<{ role: string; text: string; ts?: string }>): string {
  const topic = firstUserLine(turns);
  const firstTs = turns[0]?.ts || new Date().toISOString();
  const lastTs = turns[turns.length - 1]?.ts || new Date().toISOString();
  const updated = new Date().toISOString();

  const header = [
    '---',
    `session_id: ${sessionId}`,
    `topic: ${JSON.stringify(topic)}`,
    `started: ${firstTs}`,
    `last_activity: ${lastTs}`,
    `updated: ${updated}`,
    `turns: ${turns.length}`,
    '---',
    '',
    `# Session: ${topic}`,
    '',
    `**Session ID:** \`${sessionId}\``,
    '',
  ].join('\n');

  const body = turns
    .map((t) => {
      const label = t.role === 'user' ? '## 👤 User' : '## 🤖 Claude';
      const tsLine = t.ts ? `*${t.ts}*` : '';
      return `${label}\n${tsLine}\n\n${t.text}\n`;
    })
    .join('\n---\n\n');

  return `${header}\n${body}\n`;
}

async function main() {
  const input = await readStdin();
  if (!input || !input.session_id || !input.transcript_path) {
    process.exit(0);
  }

  try {
    if (!existsSync(SESSION_MEMORY_DIR)) {
      mkdirSync(SESSION_MEMORY_DIR, { recursive: true });
    }
    const turns = parseTranscript(input.transcript_path);
    if (turns.length === 0) process.exit(0);

    const outPath = join(SESSION_MEMORY_DIR, `${input.session_id}.md`);
    const content = formatCheckpoint(input.session_id, turns);
    writeFileSync(outPath, content, 'utf-8');
  } catch (err) {
    // Fail silently — checkpoint is best-effort, must never block Stop
  }
  process.exit(0);
}

main();
