import { dispatchFeedback } from "@/lib/feedback-notify";

/** 线上真实提问与纠错收集：支持飞书/企微 Webhook、Telegram Bot、GitHub Issues 自动建单 + 零配置 Issue 链接兜底 */
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
  const { delivered, channels } = await dispatchFeedback({
    kind,
    content,
    slug: body.slug ?? null,
  });

  const issueTitle = kind === "correction" ? `[纠错] ${content.slice(0, 40)}` : `[新纠结投稿] ${content.slice(0, 40)}`;
  const issueUrl = `https://github.com/nuts-and-bytes/health-heystone/issues/new?title=${encodeURIComponent(
    issueTitle
  )}&body=${encodeURIComponent(`内容：${content}\n来源页面：${body.slug ? `/d/${body.slug}` : "/"}\n`)}`;

  return Response.json({ ok: true, delivered, channels, issueUrl });
}
