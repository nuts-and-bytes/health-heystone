"use client";

import { useState } from "react";
import type { Episode } from "@/data/podcasts";
import { timeToSec } from "@/data/podcasts";

/* eslint-disable @next/next/no-img-element */

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const ch of text) {
    const test = line + ch;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = ch;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

async function exportPosterPng(ep: Episode) {
  const W = 1080;
  const H = 1440;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const vs = ep.visualSummary;

  // 纸白背景 + 顶栏橙色细条
  ctx.fillStyle = "#FAF8F4";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#F97316";
  ctx.fillRect(0, 0, W, 14);

  // 顶部标签
  ctx.fillStyle = "#C2410C";
  ctx.font = '700 26px "PingFang SC", "Hiragino Sans GB", sans-serif';
  ctx.fillText(`一图读懂 · ${ep.show} ${ep.vol}`, 64, 86);

  // 右上角加载官方封面缩略图
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const im = new Image();
      im.crossOrigin = "anonymous";
      im.onload = () => resolve(im);
      im.onerror = reject;
      im.src = ep.cover;
    });
    ctx.save();
    roundRect(ctx, W - 204, 54, 140, 140, 24);
    ctx.clip();
    ctx.drawImage(img, W - 204, 54, 140, 140);
    ctx.restore();
    ctx.strokeStyle = "#E4DDD3";
    ctx.lineWidth = 3;
    roundRect(ctx, W - 204, 54, 140, 140, 24);
    ctx.stroke();
  } catch {}

  // 核心大标题
  ctx.fillStyle = "#1C1917";
  ctx.font = '800 46px "PingFang SC", "Hiragino Sans GB", sans-serif';
  const headLines = wrapLines(ctx, vs.headline, W - 290);
  let y = 148;
  for (const l of headLines.slice(0, 2)) {
    ctx.fillText(l, 64, y);
    y += 60;
  }

  // 嘉宾一行
  ctx.fillStyle = "#635B52";
  ctx.font = '500 24px "PingFang SC", "Hiragino Sans GB", sans-serif';
  ctx.fillText(ep.guest.slice(0, 36), 64, Math.max(y + 10, 232));

  // 数据亮点横排卡片
  const statY = 278;
  const gap = 24;
  const statW = (W - 128 - gap * (vs.stats.length - 1)) / vs.stats.length;
  vs.stats.forEach((st, i) => {
    const sx = 64 + i * (statW + gap);
    roundRect(ctx, sx, statY, statW, 148, 22);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.strokeStyle = "#E4DDD3";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = "#F97316";
    ctx.font = '800 44px "PingFang SC", sans-serif';
    ctx.fillText(st.value, sx + 26, statY + 72);

    ctx.fillStyle = "#635B52";
    ctx.font = '600 23px "PingFang SC", sans-serif';
    ctx.fillText(st.label, sx + 26, statY + 116);
  });

  // 高亮核心要点区
  let curY = 474;
  ctx.fillStyle = "#1C1917";
  ctx.font = '700 28px "PingFang SC", sans-serif';
  ctx.fillText("核心重点提炼", 64, curY);
  curY += 30;

  vs.highlights.slice(0, 4).forEach((hl, idx) => {
    const cardH = 152;
    roundRect(ctx, 64, curY, W - 128, cardH, 22);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.strokeStyle = "#E4DDD3";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 橙色序号胶囊
    roundRect(ctx, 88, curY + 24, 152, 36, 10);
    ctx.fillStyle = "#FFEDD5";
    ctx.fill();
    ctx.fillStyle = "#C2410C";
    ctx.font = '700 21px "PingFang SC", sans-serif';
    ctx.fillText(`0${idx + 1} · ${hl.tag}`, 102, curY + 50);

    // 时间码
    ctx.fillStyle = "#9A9085";
    ctx.font = '600 21px monospace';
    ctx.fillText(hl.time, W - 160, curY + 50);

    // 正文
    ctx.fillStyle = "#1C1917";
    ctx.font = '600 26px "PingFang SC", sans-serif';
    const lines = wrapLines(ctx, hl.text, W - 180);
    lines.slice(0, 2).forEach((ln, li) => {
      ctx.fillText(ln, 88, curY + 98 + li * 36);
    });

    curY += cardH + 20;
  });

  // 底部行动卡
  const actY = Math.max(curY + 12, 1188);
  roundRect(ctx, 64, actY, W - 128, 122, 22);
  ctx.fillStyle = "#1C1917";
  ctx.fill();
  ctx.fillStyle = "#F97316";
  ctx.font = '700 22px "PingFang SC", sans-serif';
  ctx.fillText("明天就能照着做", 94, actY + 44);
  ctx.fillStyle = "#FAF8F4";
  ctx.font = '600 26px "PingFang SC", sans-serif';
  const actLines = wrapLines(ctx, vs.action, W - 190);
  ctx.fillText(actLines[0] ?? vs.action, 94, actY + 90);

  // 页脚水印
  ctx.fillStyle = "#635B52";
  ctx.font = '600 22px "PingFang SC", sans-serif';
  ctx.fillText("懂点健康 · health.heystone.site · 科普参考，不替代医生诊断", 64, H - 46);

  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = `一图读懂-${ep.id}.png`;
  a.click();
}

export default function PodcastInfographic({
  ep,
  onSeek,
}: {
  ep: Episode;
  onSeek: (sec: number) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const vs = ep.visualSummary;

  const copySummary = async () => {
    const text = [
      `【一图读懂】${ep.show}：${ep.title}`,
      `核心结论：${vs.headline}`,
      "",
      ...vs.highlights.map((h, i) => `${i + 1}. [${h.time}] ${h.tag}：${h.text}`),
      "",
      `明天就能做：${vs.action}`,
      `来源：health.heystone.site`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportPosterPng(ep);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 顶部导出与复制操作栏 */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-ink-soft">3:4 视觉精华卡（点时间码可跳播）</span>
        <div className="flex gap-2">
          <button
            onClick={copySummary}
            className="cursor-pointer rounded-lg border border-line bg-white px-2.5 py-1 text-xs font-bold text-ink hover:border-ink"
          >
            {copied ? "已复制 ✓" : "复制文字"}
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="cursor-pointer rounded-lg bg-accent px-3 py-1 text-xs font-bold text-white hover:brightness-105 disabled:opacity-50"
          >
            {exporting ? "生成中…" : "导出 3:4 分享图 PNG"}
          </button>
        </div>
      </div>

      {/* 页面内预览的图解卡片 */}
      <div className="overflow-hidden rounded-2xl border-[1.5px] border-ink bg-cream">
        <div className="h-1.5 bg-accent" />
        <div className="space-y-4 p-4">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-accent-dark">
                一图读懂 · {ep.show}
              </p>
              <h3 className="font-display mt-1 text-2xl leading-snug text-ink">{vs.headline}</h3>
            </div>
            <img src={ep.cover} alt={ep.show} className="h-14 w-14 shrink-0 rounded-xl border border-line object-cover" />
          </div>

          {/* 数字亮点条 */}
          <div className="grid grid-cols-3 gap-2">
            {vs.stats.map((st) => (
              <div key={st.label} className="rounded-xl border border-line bg-white p-2.5 text-center">
                <p className="font-display text-xl text-accent">{st.value}</p>
                <p className="mt-0.5 text-[11px] leading-tight text-ink-soft">{st.label}</p>
              </div>
            ))}
          </div>

          {/* 4 条视觉高亮重点 */}
          <ul className="space-y-2">
            {vs.highlights.map((hl, i) => (
              <li key={hl.tag} className="rounded-xl border border-line bg-white p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded bg-accent-soft px-1.5 py-0.5 text-[11px] font-bold text-accent-dark">
                    0{i + 1} · {hl.tag}
                  </span>
                  <button
                    onClick={() => onSeek(timeToSec(hl.time))}
                    className="cursor-pointer font-mono text-[11px] font-bold text-ink-soft hover:text-accent-dark"
                    title="点一下跳到音频这一秒"
                  >
                    ▶ {hl.time}
                  </button>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink">{hl.text}</p>
              </li>
            ))}
          </ul>

          {/* 明天就能做 */}
          <div className="rounded-xl bg-ink p-3.5 text-cream">
            <p className="text-[11px] font-bold text-accent">明天就能照着做</p>
            <p className="mt-1 text-sm font-medium leading-relaxed">{vs.action}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
