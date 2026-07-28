#!/usr/bin/env bun
/**
 * fal video — rozpohybování fotky (image-to-video) přes fal.ai queue API.
 *
 *   bun video.ts --image <soubor|url> --prompt "..." [--model kling|kling-std|seedance|hailuo]
 *                [--duration 5|10] [--out <soubor>]
 *
 * Klíč: $FAL_KEY (~/.zshrc). Nikdy necommitovat.
 */

const MODELS: Record<string, string> = {
  kling: "fal-ai/kling-video/v2.5-turbo/pro/image-to-video",
  "kling-std": "fal-ai/kling-video/v2.1/standard/image-to-video",
  seedance: "fal-ai/bytedance/seedance/v1/pro/image-to-video",
  hailuo: "fal-ai/minimax/hailuo-02/standard/image-to-video",
};

function arg(name: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
}

const key = process.env.FAL_KEY;
if (!key) { console.error("❌ chybí FAL_KEY"); process.exit(1); }

const image = arg("image");
const prompt = arg("prompt");
if (!image || !prompt) { console.error("❌ použití: --image <soubor|url> --prompt \"...\""); process.exit(1); }

const model = MODELS[arg("model", "kling")!] ?? arg("model")!;
const duration = arg("duration", "5")!;
const out = arg("out") ?? `${process.env.HOME}/Downloads/fal/video-${Date.now()}.mp4`;

// lokální soubor → data URI
async function toUrl(src: string): Promise<string> {
  if (/^https?:\/\//.test(src)) return src;
  const file = Bun.file(src.replace(/^~/, process.env.HOME!));
  const buf = Buffer.from(await file.arrayBuffer());
  return `data:${file.type || "image/png"};base64,${buf.toString("base64")}`;
}

const headers = { Authorization: `Key ${key}`, "Content-Type": "application/json" };

console.log(`⏳ ${model} … "${prompt.slice(0, 60)}…"`);

const submit = await fetch(`https://queue.fal.run/${model}`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    prompt,
    image_url: await toUrl(image),
    duration,
    negative_prompt: "blur, distort, warped face, morphing, low quality, text, watermark",
  }),
});

if (!submit.ok) { console.error(`❌ ${submit.status}: ${await submit.text()}`); process.exit(1); }
const { status_url, response_url } = await submit.json();

console.log(`   status_url: ${status_url}`);

// polling — síťová chyba nebo timeout render neshodí, jen se zkusí znovu
for (let i = 0; i < 240; i++) {
  await Bun.sleep(5000);
  let st: { status?: string; error?: unknown };
  try {
    st = await (await fetch(status_url, { headers })).json();
  } catch (e) {
    console.log(`   … poll selhal (${(e as Error).name}), zkouším dál`);
    continue;
  }
  if (st.status === "COMPLETED") break;
  if (st.status === "FAILED" || st.error) { console.error(`❌ ${JSON.stringify(st).slice(0, 400)}`); process.exit(1); }
  if (i % 6 === 5) console.log(`   … ${st.status} (${(i + 1) * 5}s)`);
}

const result = await (await fetch(response_url, { headers })).json();
const url = result?.video?.url ?? result?.videos?.[0]?.url;
if (!url) { console.error(`❌ bez videa: ${JSON.stringify(result).slice(0, 400)}`); process.exit(1); }

const outPath = out.replace(/^~/, process.env.HOME!);
await Bun.write(outPath, await fetch(url));
console.log(outPath);
