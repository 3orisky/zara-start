#!/usr/bin/env bun
// fal.ai image client — generate + edit/compose + chain. Náhrada Freepik Spaces.
// Auth: Authorization: Key $FAL_KEY (formát id:secret)
// Sync endpoint https://fal.run/<model> (blokuje do hotova — žádný polling).
//
// Použití:
//   bun client.ts gen --prompt "..." [--model nano|nano-pro|flux|seedream]
//                      [--ref <url|soubor> ...] [--ar 3:4] [--n 1]
//                      [--out <soubor|adresář>]
//
//   • bez --ref  → text→foto
//   • s  --ref   → edit/kompozice (Nano Banana): konzistentní postava, produkt do scény,
//                  navazující řetězení (předchozí --out dáš jako další --ref)

const API_KEY = process.env.FAL_KEY;
if (!API_KEY) {
  console.error("❌ FAL_KEY není v env. Přidej do ~/.zshrc: export FAL_KEY=\"id:secret\"");
  process.exit(1);
}

// model alias → [text-to-image path, edit/reference path]
const MODELS: Record<string, { t2i: string; edit: string }> = {
  // Nano Banana = Gemini image. Nejlepší na konzistenci postavy + řetězení.
  nano: { t2i: "fal-ai/nano-banana", edit: "fal-ai/nano-banana/edit" },
  // Nano Banana Pro = "Nano Banana 2" (Gemini 3 Pro Image). Nejvyšší kvalita.
  "nano-pro": { t2i: "fal-ai/nano-banana-pro", edit: "fal-ai/nano-banana-pro/edit" },
  // Flux 1.1 Pro — fotorealismus, čistý text→foto.
  flux: { t2i: "fal-ai/flux-pro/v1.1", edit: "fal-ai/flux-pro/v1.1" },
  // Seedream v4 — vysoká kvalita + edit s referencemi.
  seedream: {
    t2i: "fal-ai/bytedance/seedream/v4/text-to-image",
    edit: "fal-ai/bytedance/seedream/v4/edit",
  },
};

// ---- arg parsing -----------------------------------------------------------
type Args = { _: string[]; refs: string[]; [k: string]: string | string[] | boolean };
function parseArgs(argv: string[]): Args {
  const out: Args = { _: [], refs: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--ref") out.refs.push(argv[++i]);
    else if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) out[key] = true;
      else out[key] = argv[++i];
    } else out._.push(a);
  }
  return out;
}

// ---- helpers ---------------------------------------------------------------
const IMG_MIME: Record<string, string> = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
  webp: "image/webp", gif: "image/gif",
};

async function toImageUrl(ref: string): Promise<string> {
  if (/^https?:\/\//.test(ref) || ref.startsWith("data:")) return ref;
  // lokální soubor → data URI
  const file = Bun.file(ref);
  if (!(await file.exists())) throw new Error(`Reference neexistuje: ${ref}`);
  const ext = ref.split(".").pop()?.toLowerCase() ?? "png";
  const mime = IMG_MIME[ext] ?? "image/png";
  const b64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  return `data:${mime};base64,${b64}`;
}

interface FalImage { url?: string }
interface FalResult { images?: (FalImage | string)[]; image?: FalImage | string }

async function callFal(model: string, body: Record<string, unknown>): Promise<FalResult> {
  const res = await fetch(`https://fal.run/${model}`, {
    method: "POST",
    headers: { Authorization: `Key ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`fal ${model} → ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<FalResult>;
}

function extractImageUrls(result: FalResult): string[] {
  const imgs = result.images ?? (result.image ? [result.image] : []);
  return imgs
    .map((im) => (typeof im === "string" ? im : im?.url))
    .filter((u): u is string => Boolean(u));
}

async function saveImages(urls: string[], outArg: string | undefined): Promise<string[]> {
  const baseDir = `${process.env.HOME}/Downloads/fal`;
  let dir = baseDir;
  let stem: string | null = null;
  if (outArg) {
    if (/\.(png|jpg|jpeg|webp)$/i.test(outArg)) {
      const parts = outArg.split("/");
      stem = parts.pop()!.replace(/\.[^.]+$/, "");
      dir = parts.length ? parts.join("/") : baseDir;
    } else {
      dir = outArg; // adresář
    }
  }
  await Bun.$`mkdir -p ${dir}`.quiet();
  const saved: string[] = [];
  for (let i = 0; i < urls.length; i++) {
    const r = await fetch(urls[i]);
    const buf = Buffer.from(await r.arrayBuffer());
    const ext = (r.headers.get("content-type")?.split("/")[1] ?? "png").replace("jpeg", "jpg");
    const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const name = stem
      ? `${stem}${urls.length > 1 ? `-${i + 1}` : ""}.${ext}`
      : `fal-${ts}-${i + 1}.${ext}`;
    const path = `${dir}/${name}`;
    await Bun.write(path, buf);
    saved.push(path);
  }
  return saved;
}

// ---- main ------------------------------------------------------------------
const args = parseArgs(Bun.argv.slice(2));
const cmd = args._[0] ?? "gen";

if (cmd !== "gen") {
  console.error(`Neznámý příkaz "${cmd}". Použij: gen`);
  process.exit(1);
}

const prompt = typeof args.prompt === "string" ? args.prompt : undefined;
if (!prompt) {
  console.error('❌ Chybí --prompt "..."');
  process.exit(1);
}

const alias = (typeof args.model === "string" ? args.model : null) ?? (args.refs.length ? "nano" : "flux");
const m = MODELS[alias];
if (!m) {
  console.error(`❌ Neznámý model "${alias}". Vyber: ${Object.keys(MODELS).join(", ")}`);
  process.exit(1);
}

const n = typeof args.n === "string" ? Number(args.n) : 1;
const ar = typeof args.ar === "string" ? args.ar : undefined;

try {
  let model: string;
  const body: Record<string, unknown> = { prompt, num_images: n };

  if (args.refs.length) {
    // edit / kompozice / konzistence
    model = m.edit;
    const urls = await Promise.all(args.refs.map(toImageUrl));
    body.image_urls = urls;
    if (alias === "flux") {
      // Flux nemá multi-ref edit → spadni na nano
      console.error("ℹ️  Flux neumí reference, používám Nano Banana edit.");
      model = MODELS.nano.edit;
    }
  } else {
    model = m.t2i;
  }
  if (ar) body.aspect_ratio = ar; // nano/seedream respektují; flux ignoruje

  console.error(`⏳ ${model} … "${prompt.slice(0, 60)}${prompt.length > 60 ? "…" : ""}"`);
  const result = await callFal(model, body);
  const urls = extractImageUrls(result);
  if (!urls.length) {
    console.error("⚠️  Žádný obrázek ve výsledku:", JSON.stringify(result).slice(0, 400));
    process.exit(1);
  }
  const saved = await saveImages(urls, args.out as string | undefined);
  console.log(saved.join("\n"));
} catch (e) {
  console.error("❌", e instanceof Error ? e.message : String(e));
  process.exit(1);
}
