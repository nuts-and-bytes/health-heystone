"use client";

import { useRef, useState } from "react";
import { DILEMMA_VERDICT_META, TRACK_META, type Dilemma } from "@/data/dilemmas";
import { getDilemmaScene } from "./DilemmaVisual";
import StickScene from "./StickScene";

const FONT = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';

/** 按中文字符宽度自动折行（全角算 1，半角算 0.55），防止 Canvas 文字溢出 */
function wrapLines(text: string, maxUnits: number, maxLines: number): string[] {
  const lines: string[] = [];
  let cur = "";
  let units = 0;
  for (const ch of text) {
    const w = /[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/.test(ch) ? 1 : 0.55;
    if (units + w > maxUnits && cur) {
      lines.push(cur);
      cur = ch;
      units = w;
      if (lines.length === maxLines) {
        lines[maxLines - 1] = lines[maxLines - 1].slice(0, -1) + "…";
        return lines;
      }
    } else {
      cur += ch;
      units += w;
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, maxLines);
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** 直接把当前 live <stick-scene> 的画布帧合成到 1080×1440 3:4 高清 PNG 中 */
async function exportPosterWithScene(d: Dilemma, sceneHost: HTMLElement | null) {
  const W = 1080;
  const H = 1440;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const meta = DILEMMA_VERDICT_META[d.verdict];
  const badgeBg = d.verdict === "ok" ? "#ECFDF5" : d.verdict === "adjust" ? "#FFFBEB" : "#FEF2F2";
  const badgeStroke = d.verdict === "ok" ? "#059669" : d.verdict === "adjust" ? "#D97706" : "#DC2626";
  const badgeText = d.verdict === "ok" ? "#065F46" : d.verdict === "adjust" ? "#92400E" : "#991B1B";

  // 1) 暖纸白底 + 顶部橙边
  ctx.fillStyle = "#FAF8F4";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#F97316";
  ctx.fillRect(0, 0, W, 18);

  // 2) 顶栏品牌 + 板块 + 证据等级
  ctx.fillStyle = "#1C1917";
  ctx.font = `900 32px ${FONT}`;
  ctx.fillText("懂点健康", 64, 86);
  ctx.fillStyle = "#635B52";
  ctx.font = `600 22px ${FONT}`;
  ctx.fillText(`· ${TRACK_META[d.track].label}定心丸`, 210, 84);
  ctx.fillStyle = "#C2410C";
  ctx.font = `800 22px ${FONT}`;
  ctx.textAlign = "right";
  ctx.fillText(d.evidenceLevel, W - 64, 84);
  ctx.textAlign = "left";

  ctx.strokeStyle = "#E4DDD3";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(64, 114);
  ctx.lineTo(W - 64, 114);
  ctx.stroke();

  // 3) 裁决徽章 + 原生态问题
  drawRoundedRect(ctx, 64, 144, 290, 52, 26);
  ctx.fillStyle = badgeBg;
  ctx.fill();
  ctx.strokeStyle = badgeStroke;
  ctx.lineWidth = 2.8;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(96, 170, 8, 0, Math.PI * 2);
  ctx.fillStyle = meta.dot;
  ctx.fill();

  ctx.fillStyle = badgeText;
  ctx.font = `800 24px ${FONT}`;
  ctx.fillText(meta.badge, 116, 179);

  const qLines = wrapLines(d.question, 18, 2);
  ctx.fillStyle = "#1C1917";
  ctx.font = `900 46px ${FONT}`;
  qLines.forEach((line, i) => ctx.fillText(line, 64, 264 + i * 64));

  // 4) 嵌入当前专属手绘橙线 <stick-scene> 实时画布帧（点阵白纸框）
  const boxX = 64, boxY = 368, boxW = W - 128, boxH = 380;
  drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 28);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.strokeStyle = "#1C1917";
  ctx.lineWidth = 3;
  ctx.stroke();

  // 点阵底纹
  ctx.save();
  drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 28);
  ctx.clip();
  ctx.fillStyle = "#E7E2DA";
  for (let gx = boxX + 22; gx < boxX + boxW; gx += 24) {
    for (let gy = boxY + 22; gy < boxY + boxH; gy += 24) {
      ctx.beginPath();
      ctx.arc(gx, gy, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const liveCanvas = sceneHost?.querySelector("canvas") as HTMLCanvasElement | null;
  if (liveCanvas && liveCanvas.width > 0 && liveCanvas.height > 0) {
    const scale = Math.min((boxW - 40) / liveCanvas.width, (boxH - 40) / liveCanvas.height);
    const dw = liveCanvas.width * scale;
    const dh = liveCanvas.height * scale;
    ctx.drawImage(liveCanvas, boxX + (boxW - dw) / 2, boxY + (boxH - dh) / 2, dw, dh);
  }
  ctx.restore();

  // 5) ① 一句话定心丸
  drawRoundedRect(ctx, 64, 778, W - 128, 224, 28);
  ctx.fillStyle = "#FFF7ED";
  ctx.fill();
  ctx.strokeStyle = "#1C1917";
  ctx.lineWidth = 3.5;
  ctx.stroke();

  ctx.fillStyle = "#C2410C";
  ctx.font = `900 25px ${FONT}`;
  ctx.fillText(`结论 · ${d.verdictLabel}`, 100, 828);

  const reassLines = wrapLines(d.reassurance, 24, 3);
  ctx.fillStyle = "#1C1917";
  ctx.font = `800 33px ${FONT}`;
  reassLines.forEach((line, i) => ctx.fillText(line, 100, 882 + i * 48));

  // 6) ② 此刻最省心的做法
  drawRoundedRect(ctx, 64, 1030, W - 128, 250, 26);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.strokeStyle = "#E4DDD3";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = "#C2410C";
  ctx.font = `800 24px ${FONT}`;
  ctx.fillText("此刻最省心的做法（零商业带货）", 100, 1080);

  const actLines = wrapLines(d.actionNow, 27, 4);
  ctx.fillStyle = "#1C1917";
  ctx.font = `600 28px ${FONT}`;
  actLines.forEach((line, i) => ctx.fillText(line, 100, 1130 + i * 40));

  // 7) 底部权威信源 + 网址水印
  ctx.strokeStyle = "#E4DDD3";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(64, 1320);
  ctx.lineTo(W - 64, 1320);
  ctx.stroke();

  const sourceText = d.sources.map((s) => `${s.org} (${s.year})`).join(" · ");
  ctx.fillStyle = "#1C1917";
  ctx.font = `800 22px ${FONT}`;
  ctx.fillText(`权威信源：${sourceText}`, 64, 1362);

  ctx.fillStyle = "#78716C";
  ctx.font = `600 20px ${FONT}`;
  ctx.fillText("health.heystone.site · 零带货 · 零医疗诊断 · 仅引一线权威指南", 64, 1400);

  const png = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = png;
  a.download = `懂点健康-${d.shortTag}.png`;
  a.click();
}

export default function DilemmaShareCard({
  dilemma: d,
  compact = false,
}: {
  dilemma: Dilemma;
  compact?: boolean;
}) {
  const sceneWrapRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const meta = DILEMMA_VERDICT_META[d.verdict];
  const cfg = getDilemmaScene(d.slug);

  const handleDownload = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await exportPosterWithScene(d, sceneWrapRef.current);
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://health.heystone.site";
    const shareUrl = `${origin}/d/${d.slug}`;
    try {
      await navigator.clipboard.writeText(`${d.question}\n定心丸：${d.verdictLabel} — ${d.reassurance}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="space-y-3">
      {/* 实时可点击互动的 3:4 定心丸分享卡预览（内嵌原版手绘橙线 <stick-scene>） */}
      <div className={compact ? "mx-auto max-w-[380px]" : ""}>
        <div className="overflow-hidden rounded-2xl border-2 border-ink bg-[#FAF8F4] shadow-sm">
          <div className="h-2 bg-accent" />
          <div className="space-y-3.5 p-4">
            <div className="flex items-center justify-between border-b border-line pb-2.5 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-base text-ink">懂点健康</span>
                <span className="text-ink-soft">· {TRACK_META[d.track].label}定心丸</span>
              </div>
              <span className="font-mono text-[11px] font-bold text-accent-dark">{d.evidenceLevel}</span>
            </div>

            <div className="space-y-1.5">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${meta.tone}`}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta.dot }} />
                {meta.badge}
              </span>
              <h3 className="font-display text-lg leading-snug text-ink">{d.question}</h3>
            </div>

            {/* 内嵌可点击互动的手绘橙线小人动画（导出 PNG 时同步截取当前帧） */}
            <div ref={sceneWrapRef}>
              <StickScene
                key={`share-${d.slug}`}
                scene={cfg.scene}
                caption={cfg.caption}
                play="click"
                height={170}
                compact
              />
            </div>

            <div className="rounded-xl border-[1.5px] border-ink bg-accent-soft/60 p-3">
              <p className="text-[11px] font-extrabold text-accent-dark">结论 · {d.verdictLabel}</p>
              <p className="mt-1 text-xs font-bold leading-relaxed text-ink">{d.reassurance}</p>
            </div>

            <div className="rounded-xl border border-line bg-white p-3">
              <p className="text-[11px] font-bold text-accent-dark">此刻最省心的做法（零带货）</p>
              <p className="mt-1 text-xs leading-relaxed text-ink/90">{d.actionNow}</p>
            </div>

            <div className="border-t border-line pt-2.5 text-[10px] text-ink-soft">
              <p className="font-bold text-ink">
                权威信源：{d.sources.map((s) => `${s.org} (${s.year})`).join(" · ")}
              </p>
              <p className="mt-0.5">health.heystone.site · 零带货 · 零医疗诊断</p>
            </div>
          </div>
        </div>
      </div>

      {/* 一键导出与复制栏 */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleDownload}
          disabled={saving}
          className="btn flex-1 justify-center !py-2.5 text-xs"
        >
          {saving ? "正在合成高清 PNG…" : "保存带图解定心丸 (3:4 PNG)"}
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="cursor-pointer rounded-xl border-2 border-line bg-white px-4 py-2.5 text-xs font-bold text-ink transition hover:border-ink"
        >
          {copied ? "已复制链接 ✓" : "复制专属链接"}
        </button>
      </div>
    </div>
  );
}
