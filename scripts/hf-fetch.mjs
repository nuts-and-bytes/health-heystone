#!/usr/bin/env node
/**
 * 从 Hugging Face Datasets Server 拉取公开健康数据候选样本，供人工筛选与复核来源后入库。
 * 用法：
 *   node scripts/hf-fetch.mjs --source pubhealth --limit 25
 *   node scripts/hf-fetch.mjs --source huatuo --query 甲状腺 --limit 10
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);
const getArg = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};

const source = getArg("source", "pubhealth");
const query = getArg("query", "");
const limit = Math.min(100, Number(getArg("limit", "20")) || 20);
const offset = Number(getArg("offset", "0")) || 0;

const DATASETS = {
  pubhealth: {
    dataset: "bigbio/pubhealth",
    config: "pubhealth_bigbio_pairs",
    split: "train",
    license: "MIT / public fact-check corpus (verify per-source citation)",
  },
  huatuo: {
    dataset: "FreedomIntelligence/huatuo_encyclopedia_qa",
    config: "default",
    split: "train",
    license: "Apache-2.0",
  },
  huatuo_kg: {
    dataset: "FreedomIntelligence/huatuo_knowledge_graph_qa",
    config: "default",
    split: "train",
    license: "Apache-2.0",
  },
};

const cfg = DATASETS[source];
if (!cfg) {
  console.error(`Unknown --source "${source}". Available: ${Object.keys(DATASETS).join(", ")}`);
  process.exit(1);
}

const rowsEndpoint = `https://datasets-server.huggingface.co/rows?dataset=${encodeURIComponent(cfg.dataset)}&config=${encodeURIComponent(cfg.config)}&split=${encodeURIComponent(cfg.split)}&offset=${offset}&length=${limit}`;
const endpoint = query
  ? `https://datasets-server.huggingface.co/search?dataset=${encodeURIComponent(cfg.dataset)}&config=${encodeURIComponent(cfg.config)}&split=${encodeURIComponent(cfg.split)}&query=${encodeURIComponent(query)}&offset=${offset}&length=${limit}`
  : rowsEndpoint;

console.log(`Fetching ${cfg.dataset} (${query ? `query="${query}"` : `offset=${offset}`}, limit=${limit})...`);
let res = await fetch(endpoint, { headers: { "User-Agent": "health-heystone/1.0" } });
if (!res.ok && query) {
  console.warn(`Search index unavailable (HTTP ${res.status}), falling back to /rows...`);
  res = await fetch(rowsEndpoint, { headers: { "User-Agent": "health-heystone/1.0" } });
}
if (!res.ok) {
  console.error(`HTTP ${res.status}: ${await res.text()}`);
  process.exit(1);
}
const json = await res.json();
const rows = (json.rows ?? []).map((r) => r.row);

const outDir = path.join(process.cwd(), "data");
await mkdir(outDir, { recursive: true });
const outFile = path.join(outDir, `hf-${source}${query ? `-${query}` : ""}.json`);
await writeFile(
  outFile,
  JSON.stringify(
    {
      source,
      dataset: cfg.dataset,
      license: cfg.license,
      fetchedAt: new Date().toISOString(),
      query: query || null,
      count: rows.length,
      rows,
    },
    null,
    2,
  ),
);

console.log(`Saved ${rows.length} rows -> ${outFile}`);
for (const r of rows.slice(0, 5)) {
  const preview =
    source === "pubhealth"
      ? `[${r.label}] ${String(r.premise ?? r.claim ?? "").slice(0, 90)}`
      : `${JSON.stringify(r.questions ?? "").slice(0, 80)}`;
  console.log("  -", preview);
}
