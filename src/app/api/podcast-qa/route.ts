import { EPISODES } from "@/data/podcasts";
import { CASES, VERDICT_META } from "@/data/cases";
import { readFile } from "node:fs/promises";
import path from "node:path";

const SYSTEM = `你是「健康谣言法庭 · 播客精读助手」。
规则：
1. 只能基于下面提供的「单集简介、官方时间轴、逐字稿片段（如有）以及站内关联判决书」来回答用户关于这期播客的问题，不要编造嘉宾原话。
2. 回答里提到节目具体段落时，务必带上 [MM:SS] 格式的时间点（例如 [25:49]），方便用户点击跳播。
3. 如果逐字稿还没导入、只有时间轴，诚实说明这是基于官方时间轴和站内关联证据整理的，并建议用户点对应时间码听原声。
4. 语言简洁、口语化、分点清晰，不超过 220 字。`;

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
      temperature: 0.5,
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
      generationConfig: { temperature: 0.5 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const j = await res.json();
  return j.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") as string | undefined;
}

export async function POST(req: Request) {
  const { episodeId, question } = (await req.json().catch(() => ({}))) as { episodeId?: string; question?: string };
  const ep = EPISODES.find((e) => e.id === episodeId);
  const q = (question ?? "").trim().slice(0, 300);
  if (!ep || q.length < 2) return Response.json({ error: "请输入关于本期播客的问题" }, { status: 400 });

  const chapters = ep.sections.flatMap((s) => s.chapters);
  const chapterText = chapters.map((ch) => `[${ch.time}] ${ch.title}`).join("\n");

  const linkedSlugs = new Set(chapters.map((c) => c.caseSlug).filter(Boolean));
  const linkedCases = CASES.filter((c) => linkedSlugs.has(c.slug))
    .map((c) => `「${c.claim}」(${VERDICT_META[c.verdict].label})：${c.verdictLine} ${c.takeaway}`)
    .join("\n");

  let transcriptSnippet = "";
  try {
    const raw = await readFile(path.join(process.cwd(), "public/transcripts", `${ep.id}.json`), "utf-8");
    const parsed = JSON.parse(raw) as { segments?: { start: number; text: string }[] };
    if (Array.isArray(parsed.segments) && parsed.segments.length) {
      // 取最相关的 20 句或前 20 句
      const matched = parsed.segments.filter((s) => q.split(/\s+/).some((w) => w.length >= 2 && s.text.includes(w))).slice(0, 20);
      const pick = matched.length ? matched : parsed.segments.slice(0, 20);
      transcriptSnippet =
        "\n\n逐字稿参考片段：\n" +
        pick
          .map((s) => {
            const m = String(Math.floor(s.start / 60)).padStart(2, "0");
            const r = String(Math.floor(s.start % 60)).padStart(2, "0");
            return `[${m}:${r}] ${s.text}`;
          })
          .join("\n");
    }
  } catch {}

  const prompt = `单集：《${ep.show}》${ep.title}\n嘉宾：${ep.guest}\n简介：${ep.hook}\n\n官方时间轴：\n${chapterText}\n\n站内关联判决书：\n${linkedCases}${transcriptSnippet}\n\n用户提问：${q}`;

  let answer: string | null | undefined = null;
  let mode: "ai" | "local" = "local";
  try {
    answer = (await callOpenAI(prompt)) ?? (await callGemini(prompt));
    if (answer) mode = "ai";
  } catch (e) {
    console.error("[podcast-qa] LLM error", e);
  }

  if (!answer) {
    // 无 Key 时的本地精准时间轴匹配兜底
    const hits = chapters.filter((ch) => q.split("").some((chChar) => chChar.trim() && ch.title.includes(chChar)));
    const top = (hits.length ? hits : chapters).slice(0, 3);
    answer =
      `本期《${ep.title}》里和这个问题最相关的段落在这里（点击时间码可直接跳播）：\n` +
      top.map((ch) => `• [${ch.time}] ${ch.title}`).join("\n") +
      `\n（配置 OPENAI_API_KEY 后将由 AI 结合完整内容深度回答）`;
  }

  return Response.json({ answer, mode });
}
