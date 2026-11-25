import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

/** 线上真实提问与纠错收集：支持 Webhook（飞书/企微/Slack/Discord）+ 本地日志 + GitHub Issue 零配置兜底 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    type?: "dilemma" | "correction";
    content?: string;
    slug?: string;
  };
  const content = (body.content ?? "").trim().slice(0, 400);
  if (content.length < 3) {
    return Response.json({ error: "多写几个字，方便我们准确核对证据哦" }, { status: 400 });
  }

  const kind = body.type === "correction" ? "correction" : "dilemma";
  const record = {
    type: kind,
    content,
    slug: body.slug ?? null,
    at: new Date().toISOString(),
  };

  // 1) 若配置了 FEEDBACK_WEBHOOK_URL（飞书/企微/Discord 等），直接推送实时提醒
  let delivered = false;
  const webhook = process.env.FEEDBACK_WEBHOOK_URL?.trim();
  if (webhook) {
    try {
      const label = kind === "correction" ? "【纠错/论文补充】" : "【新纠结投稿】";
      const text = `${label} ${content}${body.slug ? ` (页面: /d/${body.slug})` : ""}`;
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          msg_type: "text",
          content: { text },
          text,
        }),
      });
      delivered = true;
    } catch {}
  }

  // 2) 本地环境顺手落盘
  try {
    const dir = path.join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });
    await appendFile(path.join(dir, "feedback.jsonl"), JSON.stringify(record) + "\n");
    delivered = true;
  } catch {
    // Serverless 只读环境忽略
  }

  const issueTitle = kind === "correction" ? `[纠错] ${content.slice(0, 40)}` : `[新纠结投稿] ${content.slice(0, 40)}`;
  const issueUrl = `https://github.com/nuts-and-bytes/health-heystone/issues/new?title=${encodeURIComponent(
    issueTitle
  )}&body=${encodeURIComponent(`内容：${content}\n来源页面：${body.slug ? `/d/${body.slug}` : "/"}\n`)}`;

  return Response.json({ ok: true, delivered, issueUrl });
}
