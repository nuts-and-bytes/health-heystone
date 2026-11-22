import { CASES, VERDICT_META, type Case } from "./cases";

const bigrams = (s: string) => {
  const t = s.replace(/[\s，。！？、,.!?「」“”"'：:；;（）()]/g, "");
  const out = new Set<string>();
  for (let i = 0; i < t.length - 1; i++) out.add(t.slice(i, i + 2));
  return out;
};

export function matchCases(query: string, limit = 3) {
  const q = query.trim();
  const qb = bigrams(q);
  const scored = CASES.map((c) => {
    let score = 0;
    for (const k of c.keywords) if (q.includes(k)) score += 3 + k.length * 0.5;
    const cb = bigrams(c.claim + c.hook);
    let overlap = 0;
    qb.forEach((b) => cb.has(b) && overlap++);
    score += overlap * 1.2;
    return { c, score };
  })
    .filter((x) => x.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  const top = scored[0]?.score ?? 0;
  return scored.filter((x) => x.score >= top * 0.45);
}

export function caseBrief(c: Case) {
  return [
    `[${c.slug}] 说法：「${c.claim}」`,
    `判决：${VERDICT_META[c.verdict].label}。${c.verdictLine}`,
    `证据：${c.points.join(" ")}`,
    `建议：${c.takeaway}`,
    `来源：${c.sources.map((s) => s.label).join("；")}`,
  ].join("\n");
}
