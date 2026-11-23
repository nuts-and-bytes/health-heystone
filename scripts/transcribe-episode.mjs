#!/usr/bin/env node
/**
 * 一键下载小宇宙单集音频，用 ffmpeg 按 15 分钟切片并调用 OpenAI Whisper API 生成带时间码的逐字稿 JSON：
 *   node scripts/transcribe-episode.mjs pineapple-131
 * 会自动读取项目根目录的 .env.local 中的 OPENAI_API_KEY。
 * 输出到 public/transcripts/<episodeId>.json，前端 /podcasts 字幕页会自动加载。
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const EPISODES = {
  "pineapple-131": "https://media.xyzcdn.net/6693ae814ce7c8de0f47e220/lr5mhJe44lcUHhzVyLy8kHZMpxdz.m4a",
  "jingjuli-muscle": "https://media.xyzcdn.net/6a6fe5f9d09f30fe00773487/liGfxnUKMog0CKhBWQhP5TWMC0dy.m4a",
  "jingjuli-lipids": "https://media.xyzcdn.net/6a6fe5f9d09f30fe00773487/ljSZY-G6UJVTozfbIoJVqEuMQMKK.m4a",
};

// 自动加载 .env.local
const envPath = path.join(process.cwd(), ".env.local");
if (!process.env.OPENAI_API_KEY && existsSync(envPath)) {
  const txt = await readFile(envPath, "utf-8");
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
  }
}

const id = process.argv[2];
if (!id || !EPISODES[id]) {
  console.error(`Usage: node scripts/transcribe-episode.mjs <${Object.keys(EPISODES).join("|")}>`);
  process.exit(1);
}
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("Missing OPENAI_API_KEY (set env var or put it in .env.local).");
  process.exit(1);
}

const ffmpeg = existsSync("/Users/tone-stone/.local/bin/ffmpeg") ? "/Users/tone-stone/.local/bin/ffmpeg" : "ffmpeg";
const CHUNK_SEC = 600; // 10 分钟一段，约 3.5 MB，避免长音频服务端超时
const workDir = path.join(os.tmpdir(), `health-transcribe-${id}`);
await rm(workDir, { recursive: true, force: true });
await mkdir(workDir, { recursive: true });

const audioPath = path.join(workDir, `${id}.m4a`);
console.log(`[${id}] Downloading audio...`);
const res = await fetch(EPISODES[id], { headers: { "User-Agent": "Mozilla/5.0" } });
if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`);
await writeFile(audioPath, Buffer.from(await res.arrayBuffer()));

console.log(`[${id}] Splitting into ${CHUNK_SEC / 60}-min mono mp3 chunks with ffmpeg...`);
execFileSync(
  ffmpeg,
  [
    "-y",
    "-i",
    audioPath,
    "-ac",
    "1",
    "-ar",
    "16000",
    "-b:a",
    "48k",
    "-f",
    "segment",
    "-segment_time",
    String(CHUNK_SEC),
    path.join(workDir, "chunk_%03d.mp3"),
  ],
  { stdio: "pipe" },
);

const chunks = (await readdir(workDir)).filter((f) => f.startsWith("chunk_") && f.endsWith(".mp3")).sort();
console.log(`[${id}] ${chunks.length} chunks ready. Transcribing via OpenAI whisper-1...`);

const allSegments = [];
for (let i = 0; i < chunks.length; i++) {
  const chunkPath = path.join(workDir, chunks[i]);
  const buf = await readFile(chunkPath);
  const fd = new FormData();
  fd.append("file", new Blob([buf], { type: "audio/mpeg" }), chunks[i]);
  fd.append("model", "whisper-1");
  fd.append("language", "zh");
  fd.append("prompt", "以下是简体中文普通话健康科普播客的逐字稿，请全部使用简体中文标点与汉字输出。");
  fd.append("response_format", "verbose_json");
  fd.append("timestamp_granularities[]", "segment");

  console.log(`[${id}] Chunk ${i + 1}/${chunks.length} (${(buf.length / 1024 / 1024).toFixed(1)} MB)...`);
  let data = null;
  for (let attempt = 1; attempt <= 4; attempt++) {
    const tr = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: fd,
    });
    if (tr.ok) {
      data = await tr.json();
      break;
    }
    const errText = await tr.text().catch(() => "");
    console.warn(`[${id}] Chunk ${i + 1} attempt ${attempt} failed (HTTP ${tr.status}): ${errText.slice(0, 120)}`);
    if (attempt === 4) throw new Error(`Whisper HTTP ${tr.status}: ${errText}`);
    await new Promise((r) => setTimeout(r, attempt * 4000));
  }
  const offset = i * CHUNK_SEC;
  for (const s of data.segments ?? []) {
    const text = String(s.text ?? "").trim();
    if (!text) continue;
    allSegments.push({
      start: Math.round((offset + Number(s.start ?? 0)) * 10) / 10,
      end: Math.round((offset + Number(s.end ?? 0)) * 10) / 10,
      text,
    });
  }
}

const outDir = path.join(process.cwd(), "public/transcripts");
await mkdir(outDir, { recursive: true });
const outPath = path.join(outDir, `${id}.json`);
await writeFile(outPath, JSON.stringify({ id, model: "whisper-1", generatedAt: new Date().toISOString(), segments: allSegments }, null, 2));
await rm(workDir, { recursive: true, force: true });
console.log(`[${id}] DONE! Saved ${allSegments.length} segments -> ${outPath}`);
