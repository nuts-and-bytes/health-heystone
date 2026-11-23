import { readFile } from "node:fs/promises";
import path from "node:path";
import { EPISODES, secToTime } from "@/data/podcasts";
import { CASES, VERDICT_META } from "@/data/cases";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

/** 供前端探测当前是否已配置模型（绝不返回密钥本身） */
export async function GET() {
  return Response.json({
    configured: Boolean(process.env.OPENAI_API_KEY?.trim()),
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
  });
}

/** 复刻 SubCast 的 transcriptForModel：把整期带时间戳的文字稿喂给模型 */
async function loadFullTranscript(episodeId: string, limitChars = 220_000): Promise<{ text: string; count: number }> {
  try {
    const raw = await readFile(path.join(process.cwd(), "public/transcripts", `${episodeId}.json`), "utf-8");
    const parsed = JSON.parse(raw) as { segments?: { start: number; text: string }[] };
    const segs = Array.isArray(parsed.segments) ? parsed.segments : [];
    if (!segs.length) return { text: "", count: 0 };
    const lines = segs.map((s) => `[${secToTime(s.start)}] ${s.text}`);
    let text = lines.join("\n");
    if (text.length > limitChars) text = text.slice(0, limitChars);
    return { text, count: segs.length };
  } catch {
    return { text: "", count: 0 };
  }
}

/** 复刻 SubCast 的 QA_SYSTEM 提示词 */
function buildQaSystem(title: string, show: string, guest: string, transcript: string, linkedCases: string) {
  return `你是「懂点健康」播客精读助手（参考 SubCast 精读体系），帮助中文听众吃透一期健康科普播客。
节目：${show}
本期：${title}
嘉宾：${guest}

下面是本期带时间戳的完整文字稿（由语音识别生成，个别同音词可能有误，请结合上下文准确理解）：
<transcript>
${transcript}
</transcript>
${linkedCases ? `\n本站已核验的相关健康判决书（可交叉印证）：\n${linkedCases}\n` : ""}
回答规则：
- 用简体中文回答，先给结论，再给依据；适度使用 Markdown 小标题（##）和列表（-）。
- 只根据文字稿回答；文字稿没有涉及的，明确说「节目里没有提到」，可以补充权威常识但要标明。
- 引用原话或观点时必须附上文字稿中真实存在的时间戳，格式严格为 [mm:ss] 或 [h:mm:ss]，例如 [12:34]，方便用户点击跳转播放。
- 涉及医学术语时，第一次出现顺手用一句大白话解释。`;
}

/** 复刻 SubCast 的 summaryPrompt 导读提示词 */
function buildGuidePrompt(minutes: number) {
  return `请通读整份带时间戳的文字稿（本期总长约 ${minutes} 分钟），为这期节目写一份中文导读，帮听众在一分钟内判断这期讲了什么、值不值得听、该听哪几段。

什么算「要点」：
- 具体、有信息量：带数字、案例、人名、量化建议或明确判断，换一期节目就说不出来的内容。
- 不算要点：寒暄、自我介绍、广告口播、人人都知道的空话。
- 观点写清是谁说的（嘉宾名或「主持人」）。
- 后半段和前半段同样重要，不要只总结开头。

用 Markdown，严格按下面的结构输出，不要开场白，不要结尾客套：

## 一句话总结
（谁和谁聊了什么，最重要的结论是什么。一句话，不超过 60 字）

## 时间线
（按时间顺序覆盖整期，划分 6–10 个话题段落。每段一行，格式严格为：
- [mm:ss] **段落标题**：一两句说清这段的具体内容）

## 核心观点
（5–7 条，按信息量和重要性排序。每条格式：
- **一句话观点**（说话人）：一两句讲清理由、证据或例子 [mm:ss]）

## 值得记住的原话
（3–4 句，挑观点最鲜明或最有画面感的原句，摘自文字稿。每句一行，格式：
> 原句 · 说话人 [mm:ss]）

## 先听这几段
（2–3 段信息密度最高的片段。每段一行，格式：
- [mm:ss] **片段标题**：为什么值得听，约几分钟）

写完后自查：每个时间戳都必须是文字稿里真实存在的时间，格式只用 [mm:ss] 或 [h:mm:ss]。`;
}

/** 带退避重试的上游请求，抵抗偶发 TLS / ECONNRESET 抖动 */
async function fetchOpenAIWithRetry(url: string, init: RequestInit, attempts = 3): Promise<Response> {
  let lastErr: unknown = null;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, init);
      if (res.ok || (res.status >= 400 && res.status < 500 && res.status !== 429)) {
        return res;
      }
      if (i === attempts - 1) return res;
    } catch (err) {
      lastErr = err;
      if (i === attempts - 1) throw err;
    }
    await new Promise((r) => setTimeout(r, 650 * (i + 1)));
  }
  throw lastErr ?? new Error("网络请求失败");
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    episodeId?: string;
    action?: "chat" | "guide";
    question?: string;
    messages?: Msg[];
  };

  const ep = EPISODES.find((e) => e.id === body.episodeId);
  if (!ep) return Response.json({ error: "未找到该期播客", code: "NOT_FOUND" }, { status: 404 });

  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  if (!openaiKey) {
    return Response.json(
      { error: "尚未配置 AI 模型密钥（OPENAI_API_KEY）", code: "NO_API_KEY" },
      { status: 503 }
    );
  }

  const action = body.action ?? "chat";
  const chapters = ep.sections.flatMap((s) => s.chapters);
  const { text: fullTranscript } = await loadFullTranscript(ep.id);
  const transcriptSource =
    fullTranscript || chapters.map((ch) => `[${ch.time}] ${ch.title}`).join("\n");

  const linkedSlugs = new Set(chapters.map((c) => c.caseSlug).filter(Boolean));
  const linkedCases = CASES.filter((c) => linkedSlugs.has(c.slug))
    .map((c) => `- 「${c.claim}」（${VERDICT_META[c.verdict].label}）：${c.verdictLine}`)
    .join("\n");

  const system = buildQaSystem(ep.title, ep.show, ep.guest, transcriptSource, linkedCases);
  const userMessages: Msg[] =
    action === "guide"
      ? [{ role: "user", content: buildGuidePrompt(ep.minutes) }]
      : Array.isArray(body.messages) && body.messages.length
        ? body.messages.slice(-12)
        : [{ role: "user", content: (body.question ?? "").trim().slice(0, 500) }];

  if (!userMessages[userMessages.length - 1]?.content) {
    return Response.json({ error: "请输入问题", code: "EMPTY_INPUT" }, { status: 400 });
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");

  let upstream: Response;
  try {
    upstream = await fetchOpenAIWithRetry(
      `${baseUrl}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model,
          stream: true,
          temperature: 0.45,
          messages: [{ role: "system", content: system }, ...userMessages],
        }),
      },
      3
    );
  } catch (err) {
    const causeCode = (err as { cause?: { code?: string } })?.cause?.code;
    return Response.json(
      {
        error:
          causeCode === "ECONNRESET" || causeCode === "ETIMEDOUT"
            ? `连接模型时网络波动（${causeCode}），已自动重试 3 次，请稍后再点重试`
            : "暂时无法连接到模型服务，请检查网络或代理后重试",
        code: "NETWORK_ERROR",
      },
      { status: 502 }
    );
  }

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => "");
    return Response.json(
      {
        error:
          upstream.status === 401
            ? "模型密钥无效或已过期，请检查 .env.local 中的 OPENAI_API_KEY"
            : upstream.status === 429
              ? "模型请求频率达到上限或额度不足，请稍后再试"
              : `模型服务返回异常（HTTP ${upstream.status}）${errText ? `：${errText.slice(0, 100)}` : ""}`,
        code: upstream.status === 401 ? "NO_API_KEY" : "UPSTREAM_ERROR",
      },
      { status: 502 }
    );
  }

  // 解析 OpenAI SSE 流并直接向下游输出纯文本增量，零缓冲延迟
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader();
      let buf = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const payload = trimmed.slice(5).trim();
            if (payload === "[DONE]") continue;
            try {
              const json = JSON.parse(payload);
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {}
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
