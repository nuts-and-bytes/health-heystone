import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

export interface FeedbackPayload {
  kind: "unmatched" | "dilemma" | "correction";
  content: string;
  slug?: string | null;
}

const KIND_LABEL: Record<FeedbackPayload["kind"], string> = {
  unmatched: "未命中真实提问",
  dilemma: "新纠结投稿",
  correction: "内容纠错/论文补充",
};

/**
 * 统一线上真实反馈推送器（全部走免费通道，配置任意一种即可实时收到）：
 * 1. FEEDBACK_WEBHOOK_URL — 飞书 / 企业微信 / Discord / Slack 群机器人 Webhook
 * 2. TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID — Telegram Bot 实时直达私信
 * 3. GITHUB_FEEDBACK_TOKEN — 自动在 nuts-and-bytes/health-heystone 建一条 GitHub Issue
 * 4. 本地开发顺手写 data/feedback.jsonl
 */
export async function dispatchFeedback(payload: FeedbackPayload): Promise<{ delivered: boolean; channels: string[] }> {
  const channels: string[] = [];
  const label = KIND_LABEL[payload.kind];
  const suffix = payload.slug ? `\n来源页面：https://health.heystone.site/d/${payload.slug}` : "";
  const fullText = `【懂点健康 · ${label}】\n${payload.content}${suffix}`;

  // 1) 飞书 / 企微 / Discord / Slack Webhook
  const webhook = process.env.FEEDBACK_WEBHOOK_URL?.trim();
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          msg_type: "text",
          content: { text: fullText },
          text: fullText,
        }),
      });
      if (res.ok) channels.push("webhook");
    } catch {}
  }

  // 2) Telegram Bot
  const tgToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const tgChat = process.env.TELEGRAM_CHAT_ID?.trim();
  if (tgToken && tgChat) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: tgChat, text: fullText }),
      });
      if (res.ok) channels.push("telegram");
    } catch {}
  }

  // 3) GitHub Issues 自动收集（免费永久存档）
  const ghToken = process.env.GITHUB_FEEDBACK_TOKEN?.trim();
  const ghRepo = process.env.GITHUB_FEEDBACK_REPO?.trim() || "nuts-and-bytes/health-heystone";
  if (ghToken) {
    try {
      const res = await fetch(`https://api.github.com/repos/${ghRepo}/issues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${ghToken}`,
        },
        body: JSON.stringify({
          title: `[${label}] ${payload.content.slice(0, 48)}`,
          body: `${payload.content}${suffix}\n\n---\n提交时间：${new Date().toISOString()}`,
        }),
      });
      if (res.ok) channels.push("github-issue");
    } catch {}
  }

  // 4) 本地开发落盘
  try {
    const dir = path.join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });
    await appendFile(
      path.join(dir, "feedback.jsonl"),
      JSON.stringify({ ...payload, at: new Date().toISOString() }) + "\n"
    );
    channels.push("local-file");
  } catch {
    // Vercel Serverless 只读文件系统自动跳过
  }

  return { delivered: channels.length > 0, channels };
}
