// Magnific API client — async create/poll/webhook helper
// Auth: x-magnific-api-key header (env: MAGNIFIC_API_KEY)

const BASE_URL = "https://api.magnific.com";
const API_KEY = process.env.MAGNIFIC_API_KEY;

if (!API_KEY) {
  throw new Error("MAGNIFIC_API_KEY not set in env. Add to ~/.zshrc.");
}

type Status = "CREATED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

interface TaskResponse<T = unknown> {
  data: {
    task_id: string;
    status: Status;
    generated?: string[];
    has_nsfw?: boolean[];
    error?: string;
  } & T;
}

async function request<T>(method: "POST" | "GET", path: string, body?: unknown): Promise<TaskResponse<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "x-magnific-api-key": API_KEY!,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw new Error(`Magnific ${method} ${path} failed: ${res.status} ${await res.text()}`);
  }
  return res.json() as Promise<TaskResponse<T>>;
}

export const magnific = {
  /** Create a generation task. Returns task_id + initial status. */
  async create<T = unknown>(model: string, body: Record<string, unknown>) {
    const res = await request<T>("POST", `/v1/ai/${model}`, body);
    return res.data;
  },

  /** Poll a single task once. */
  async status<T = unknown>(taskId: string, model: string) {
    const res = await request<T>("GET", `/v1/ai/${model}/${taskId}`);
    return res.data;
  },

  /** Poll until COMPLETED/FAILED. Default: 3s interval, 10min timeout. */
  async waitFor<T = unknown>(
    taskId: string,
    model: string,
    opts: { intervalMs?: number; timeoutMs?: number } = {},
  ) {
    const interval = opts.intervalMs ?? 3000;
    const timeout = opts.timeoutMs ?? 600_000;
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const data = await this.status<T>(taskId, model);
      if (data.status === "COMPLETED" || data.status === "FAILED") return data;
      await new Promise((r) => setTimeout(r, interval));
    }
    throw new Error(`Magnific task ${taskId} timed out after ${timeout}ms`);
  },

  /** Convenience: create + wait. */
  async generate<T = unknown>(
    model: string,
    body: Record<string, unknown>,
    opts?: { intervalMs?: number; timeoutMs?: number },
  ) {
    const task = await this.create<T>(model, body);
    return this.waitFor<T>(task.task_id, model, opts);
  },
};

// Quick smoke test: `bun run ~/.claude/skills/magnific/client.ts ping`
if (import.meta.main && process.argv[2] === "ping") {
  console.log("MAGNIFIC_API_KEY present:", !!API_KEY, "len:", API_KEY?.length);
}
