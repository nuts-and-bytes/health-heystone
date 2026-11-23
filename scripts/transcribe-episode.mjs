#!/usr/bin/env node
/**
 * 一键下载小宇宙单集音频并调用本机 transcribe skill 生成带时间戳的逐字稿 JSON：
 *   OPENAI_API_KEY=sk-... node scripts/transcribe-episode.mjs pineapple-131
 * 输出到 public/transcripts/<episodeId>.json，前端 /podcasts 逐字稿页会自动读取。
 */
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const EPISODES = {
  "pineapple-131": "https://media.xyzcdn.net/6693ae814ce7c8de0f47e220/lr5mhJe44lcUHhzVyLy8kHZMpxdz.m4a",
  "jingjuli-muscle": "https://media.xyzcdn.net/6a6fe5f9d09f30fe00773487/liGfxnUKMog0CKhBWQhP5TWMC0dy.m4a",
  "jingjuli-lipids": "https://media.xyzcdn.net/6a6fe5f9d09f30fe00773487/ljSZY-G6UJVTozfbIoJVqEuMQMKK.m4a",
};

const id = process.argv[2];
if (!id || !EPISODES[id]) {
  console.error(`Usage: OPENAI_API_KEY=... node scripts/transcribe-episode.mjs <${Object.keys(EPISODES).join("|")}>`);
  process.exit(1);
}
if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY env var.");
  process.exit(1);
}

const tmpDir = path.join(os.tmpdir(), "health-podcast-transcribe");
await mkdir(tmpDir, { recursive: true });
const audioPath = path.join(tmpDir, `${id}.m4a`);
const rawJsonPath = path.join(tmpDir, `${id}.raw.json`);

console.log(`Downloading audio for ${id}...`);
const res = await fetch(EPISODES[id]);
if (!res.ok) throw new Error(`Audio download failed: HTTP ${res.status}`);
await writeFile(audioPath, Buffer.from(await res.arrayBuffer()));

const cli = path.join(os.homedir(), ".codex/skills/transcribe/scripts/transcribe_diarize.py");
console.log(`Running transcribe CLI (${cli})...`);
execFileSync("python3", [cli, audioPath, "--model", "gpt-4o-transcribe-diarize", "--response-format", "diarized_json", "--out", rawJsonPath], {
  stdio: "inherit",
});

const raw = JSON.parse(await readFile(rawJsonPath, "utf-8"));
const segments = (raw.segments ?? []).map((s) => ({
  start: Number(s.start ?? 0),
  end: s.end != null ? Number(s.end) : undefined,
  speaker: s.speaker || undefined,
  text: String(s.text ?? "").trim(),
})).filter((s) => s.text);

const outDir = path.join(process.cwd(), "public/transcripts");
await mkdir(outDir, { recursive: true });
const outPath = path.join(outDir, `${id}.json`);
await writeFile(outPath, JSON.stringify({ id, generatedAt: new Date().toISOString(), segments }, null, 2));
console.log(`Saved ${segments.length} transcript segments -> ${outPath}`);
