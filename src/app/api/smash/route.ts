import { VERDICT_META } from "@/data/cases";
import { matchCases, caseBrief } from "@/data/search";
import { matchDilemmas, type Dilemma } from "@/data/dilemmas";
import { dispatchFeedback } from "@/lib/feedback-notify";

interface RedLineNotice {
  type: "medical" | "commerce";
  title: string;
  message: string;
}

const MEDICAL_RULES: { re: RegExp; dept: string }[] = [
  { re: /闭经|停经|异常出血|痛经剧烈|经量.*大|多囊|产后.*漏尿|腹直肌/, dept: "妇科 / 产后康复科" },
  { re: /胸痛|胸闷|心悸|心跳.*快|晕厥|眼前发黑|心肌炎/, dept: "心内科 / 急诊科" },
  { re: /发烧|高烧|发热/, dept: "发热门诊 / 呼吸内科" },
  { re: /吃什么药|吃药|开药|处方|剂量|异维A酸|减肥药|司美格鲁肽|用药/, dept: "相应专科医生（本站严禁提供任何用药或剂量建议）" },
  { re: /骨折|撕裂|韧带|关节.*刺痛|肿胀淤青|麻木/, dept: "骨科 / 运动医学科" },
  { re: /甲亢|甲减|贫血|铁蛋白|糖尿病|高血压|肿瘤|抑郁|催吐/, dept: "内分泌科 / 全科 / 心理科" },
  { re: /扁桃体炎|化脓|脓包|囊肿|感染|发炎/, dept: "皮肤科 / 耳鼻喉科 / 全科" },
];

const COMMERCE_RE = /推荐.*(牌子|品牌|蛋白粉|肌酸|补剂|代餐|护肤品|奶茶|茶饮)|买哪(个|款)|什么牌子好|求推荐|购买链接|瘦肩针|医美|打肉毒/;

function detectRedLines(q: string): RedLineNotice[] {
  const notices: RedLineNotice[] = [];
  for (const rule of MEDICAL_RULES) {
    if (rule.re.test(q)) {
      notices.push({
        type: "medical",
        title: "触发医疗红线 · 建议线下就医",
        message: `你提到的情况涉及症状、疾病或用药范畴。本站严守「零医疗诊断、零用药建议」红线，建议优先前往线下医院（参考科室：${rule.dept}）由医生面诊评估。`,
      });
      break;
    }
  }
  if (COMMERCE_RE.test(q)) {
    notices.push({
      type: "commerce",
      title: "触发零带货红线 · 仅科普不推产品",
      message: "本站严守「零商业带货」原则，绝不推荐任何具体品牌、补剂商品、医美项目或购买链接，下面只为你客观拆解背后的科学机制与判断原则。",
    });
  }
  return notices;
}

function dilemmaBrief(d: Dilemma) {
  const srcs = d.sources.map((s) => `${s.org} (${s.year})`).join("、");
  return [
    `【站内已核验高频纠结】${d.question}`,
    `结论：${d.verdictLabel}（${d.evidenceLevel}）`,
    `定心丸：${d.reassurance}`,
    `科学原理：${d.science}`,
    `当下做法：${d.actionNow}`,
    `权威来源：${srcs}`,
    d.redLine ? `安全红线：${d.redLine}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

const SYSTEM = `你是「懂点健康」的反焦虑健康决策助手，聚焦「健身练吃」与「女性状态」。
你必须严格遵守以下不可违背的红线：
1. 【零商业带货】严禁推荐任何具体商品、品牌、补剂购买渠道、减肥产品、课程或医美项目。如果用户问买哪款，明确说明本站不推品牌，只讲核心成分与看配料表的原则。
2. 【零医疗与用药建议】严禁诊断疾病、推荐药物、给出用药/保健品剂量或替代医生。涉及明确疾病、闭经、剧痛、胸闷晕厥、发烧或用药问题，必须先明确提醒线下就医并给出建议科室。
3. 【只认权威证据】优先依据下面提供的「站内已核验资料」回答；若资料未完全覆盖，只引用 ACSM / ISSN / WHO / ACOG / IOC / AAD /《中国居民膳食指南》级别共识，学界尚无定论的坦诚说「目前学界尚无定论」，绝不编造论文或数字。
4. 【回答格式】用温暖、克制、反焦虑的简体中文，严格分三段输出（总字数 220 字以内）：
   - **定心丸**：一句话直接定调（能 / 别慌 / 换个做法 / 建议停下或就医）。
   - **身体发生了什么**：2–3 句大白话讲清原理，括号标出信源机构。
   - **此刻怎么做**：1–2 条当下就能照做、零推销的省心做法。`;

async function callOpenAI(prompt: string) {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return null;
  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");
  for (let i = 0; i < 2; i++) {
    try {
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: prompt },
          ],
          temperature: 0.45,
        }),
      });
      if (!res.ok) throw new Error(`OpenAI ${res.status}`);
      const j = await res.json();
      return j.choices?.[0]?.message?.content as string | undefined;
    } catch (err) {
      if (i === 1) throw err;
      await new Promise((r) => setTimeout(r, 600));
    }
  }
  return null;
}

async function callGemini(prompt: string) {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) return null;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.45 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const j = await res.json();
  return j.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") as string | undefined;
}

async function savePending(text: string) {
  await dispatchFeedback({ kind: "unmatched", content: text });
}

export async function POST(req: Request) {
  const { text } = (await req.json().catch(() => ({}))) as { text?: string };
  const q = (text ?? "").trim().slice(0, 300);
  if (q.length < 2) return Response.json({ error: "把你正在纠结的事说具体一点吧" }, { status: 400 });

  const redLines = detectRedLines(q);
  const dilemmaHits = matchDilemmas(q, 3);
  const caseHits = matchCases(q);

  const matchedDilemmas = dilemmaHits.map(({ d, score }) => ({
    slug: d.slug,
    shortTag: d.shortTag,
    question: d.question,
    verdict: d.verdict,
    verdictLabel: d.verdictLabel,
    reassurance: d.reassurance,
    evidenceLevel: d.evidenceLevel,
    sources: d.sources,
    score,
  }));

  const matches = caseHits.map(({ c, score }) => ({
    slug: c.slug,
    claim: c.claim,
    emoji: c.emoji,
    verdict: c.verdict,
    verdictLine: c.verdictLine,
    takeaway: c.takeaway,
    score,
  }));

  if (!dilemmaHits.length && !caseHits.length) {
    await savePending(q);
  }

  const contextBlocks = [
    ...dilemmaHits.map((h) => dilemmaBrief(h.d)),
    ...caseHits.slice(0, 2).map((h) => caseBrief(h.c)),
  ];

  const prompt = [
    `用户此刻正在纠结的问题：「${q}」`,
    redLines.length ? `系统已触发红线提醒：${redLines.map((r) => r.title).join("、")}（回答中必须严格遵守，不可越界）` : "",
    contextBlocks.length
      ? `站内已核验参考资料：\n${contextBlocks.join("\n\n")}`
      : "站内暂未精准收录该条目，请基于一线权威医学/运动营养共识给出克制、反焦虑、守红线的回答；若属学界尚无定论或必须线下就医的情况，请坦诚说明。",
  ]
    .filter(Boolean)
    .join("\n\n");

  let answer: string | null | undefined = null;
  let mode: "ai" | "local" = "local";
  try {
    answer = (await callOpenAI(prompt)) ?? (await callGemini(prompt));
    if (answer) mode = "ai";
  } catch (e) {
    console.error("[smash] LLM error", e);
  }

  if (!answer) {
    if (dilemmaHits.length) {
      const top = dilemmaHits[0].d;
      answer = `**定心丸**：${top.verdictLabel}。${top.reassurance}\n\n**身体发生了什么**：${top.science}\n\n**此刻怎么做**：${top.actionNow}`;
    } else if (caseHits.length) {
      const top = caseHits[0].c;
      answer = `**定心丸**：${VERDICT_META[top.verdict].label}！${top.verdictLine}\n\n**此刻怎么做**：${top.takeaway}`;
    } else {
      answer =
        "这个问题我们已记入待核验选题库，核对一线权威指南后会上架。当下若涉及明显不适、疼痛或用药疑问，请优先咨询线下医生。";
    }
  }

  return Response.json({
    matches,
    matchedDilemmas,
    redLines,
    unmatched: !dilemmaHits.length && !caseHits.length,
    mode,
    answer,
  });
}
