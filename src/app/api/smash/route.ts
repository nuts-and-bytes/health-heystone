import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { VERDICT_META } from "@/data/cases";
import { matchCases, caseBrief } from "@/data/search";

const SYSTEM = `你是「健康谣言法庭」的肌肉法官，说话幽默、亲切、简短，像多邻国的吉祥物。
规则：
1. 只能依据下面提供的「站内判决书」回答，不得编造研究、数字或来源。
2. 先用一句话给出判决（实锤 / 冤案 / 看情况），再用 2–3 句解释，最后给一条能马上做到的建议。
3. 如果用户的说法和判决书只是部分相关，要说清楚哪部分有证据、哪部分站内还没审过。
4. 涉及疾病、用药、疼痛或具体症状时，提醒去看医生。
5. 全文不超过 150 字，用中文。`;

async function callOpenAI(prompt: string) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}`);
  const j = await res.json();
  return j.choices?.[0]?.message?.content as string | undefined;
}

async function callGemini(prompt: string) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.6 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const j = await res.json();
  return j.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") as string | undefined;
}

async function savePending(text: string) {
  try {
    const dir = path.join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });
    await appendFile(path.join(dir, "pending.jsonl"), JSON.stringify({ text, at: new Date().toISOString() }) + "\n");
  } catch {
    // 只读环境（如 Serverless）下忽略，正式版改为写数据库
  }
}

export async function POST(req: Request) {
  const { text } = (await req.json().catch(() => ({}))) as { text?: string };
  const q = (text ?? "").trim().slice(0, 300);
  if (q.length < 2) return Response.json({ error: "说得再具体一点吧" }, { status: 400 });

  const hits = matchCases(q);
  const matches = hits.map(({ c, score }) => ({
    slug: c.slug,
    claim: c.claim,
    emoji: c.emoji,
    verdict: c.verdict,
    verdictLine: c.verdictLine,
    takeaway: c.takeaway,
    score,
  }));

  if (!hits.length) {
    await savePending(q);
    return Response.json({
      matches: [],
      unmatched: true,
      mode: "local",
      answer: "这个案子还没开庭！法官已经把它记进待审卷宗，查清证据后会上架。在那之前，别急着转发哦。",
    });
  }

  const prompt = `用户看到的说法：「${q}」\n\n站内判决书：\n${hits.map((h) => caseBrief(h.c)).join("\n\n")}`;
  let answer: string | null | undefined = null;
  let mode: "ai" | "local" = "local";
  try {
    answer = (await callOpenAI(prompt)) ?? (await callGemini(prompt));
    if (answer) mode = "ai";
  } catch (e) {
    console.error("[smash] LLM error", e);
  }

  if (!answer) {
    const top = hits[0].c;
    answer = `${VERDICT_META[top.verdict].emoji} 判决：${VERDICT_META[top.verdict].label}！${top.verdictLine}${top.takeaway}`;
  }

  return Response.json({ matches, unmatched: false, mode, answer });
}
