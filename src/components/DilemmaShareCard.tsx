"use client";

import { useRef, useState } from "react";
import { DILEMMA_VERDICT_META, TRACK_META, type Dilemma } from "@/data/dilemmas";

const FONT = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';

/** 按中文字符宽度自动折行（全角算 1，半角算 0.55），防止 SVG 文字溢出 */
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

async function exportSvgToPng(svgEl: SVGSVGElement, filename: string) {
  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", "1080");
  clone.setAttribute("height", "1440");
  const xml = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1440;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, 1080, 1440);
    const png = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = png;
    a.download = filename;
    a.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function DilemmaShareCard({
  dilemma: d,
  compact = false,
}: {
  dilemma: Dilemma;
  compact?: boolean;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const meta = DILEMMA_VERDICT_META[d.verdict];
  const badgeBg = d.verdict === "ok" ? "#ECFDF5" : d.verdict === "adjust" ? "#FFFBEB" : "#FEF2F2";
  const badgeStroke = d.verdict === "ok" ? "#059669" : d.verdict === "adjust" ? "#D97706" : "#DC2626";
  const badgeText = d.verdict === "ok" ? "#065F46" : d.verdict === "adjust" ? "#92400E" : "#991B1B";

  const qLines = wrapLines(d.question, 17, 2);
  const sideALines = wrapLines(`「${d.debate.sideA}」`, 14, 2);
  const sideBLines = wrapLines(`「${d.debate.sideB}」`, 14, 2);
  const reassLines = wrapLines(d.reassurance, 24, 3);
  const sciLines = wrapLines(d.science, 29, 4);
  const actLines = wrapLines(d.actionNow, 29, 3);
  const sourceText = d.sources.map((s) => `${s.org} (${s.year})`).join("  ·  ");

  const handleDownload = async () => {
    if (!svgRef.current || saving) return;
    setSaving(true);
    try {
      await exportSvgToPng(svgRef.current, `懂点健康-${d.shortTag}.png`);
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
      <div className={compact ? "mx-auto max-w-[360px]" : ""}>
        <svg
          ref={svgRef}
          viewBox="0 0 600 800"
          className="w-full rounded-2xl border-[1.5px] border-ink bg-[#FAF8F4] shadow-sm"
          role="img"
          aria-label={`定心丸分享卡：${d.question}`}
        >
          {/* 暖纸白底 + 顶橙边 */}
          <rect width="600" height="800" fill="#FAF8F4" />
          <rect width="600" height="10" fill="#F97316" />

          {/* 顶部品牌栏（小橙耳机芽 + 网站名 + 板块） */}
          <g transform="translate(36 26) scale(0.55)">
            <path d="M32 19 C32 10.5, 39 6, 44.5 6.5 C44.5 13, 39.5 18.5, 32 19 Z" fill="#FED7AA" stroke="#1C1917" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 39 C11 25, 20 18.5, 32 18.5 C44 18.5, 53 25, 53 39" stroke="#1C1917" strokeWidth="4" strokeLinecap="round" fill="none" />
            <rect x="6" y="34" width="8.5" height="14.5" rx="4.25" fill="#FED7AA" stroke="#1C1917" strokeWidth="3.4" />
            <rect x="49.5" y="34" width="8.5" height="14.5" rx="4.25" fill="#FED7AA" stroke="#1C1917" strokeWidth="3.4" />
            <circle cx="32" cy="40" r="17.5" fill="#F97316" />
            <path d="M22.5 38.5 Q25.5 34.5 28.5 38.5" stroke="#1C1917" strokeWidth="3.4" strokeLinecap="round" fill="none" />
            <path d="M35.5 38.5 Q38.5 34.5 41.5 38.5" stroke="#1C1917" strokeWidth="3.4" strokeLinecap="round" fill="none" />
            <path d="M26 45.5 Q32 50.5 38 45.5" stroke="#1C1917" strokeWidth="3.4" strokeLinecap="round" fill="none" />
          </g>
          <text x="80" y="48" fill="#1C1917" fontSize="18" fontWeight="900" fontFamily={FONT}>
            懂点健康
          </text>
          <text x="164" y="47" fill="#635B52" fontSize="12.5" fontWeight="600" fontFamily={FONT}>
            · {TRACK_META[d.track].label}定心丸
          </text>
          <text x="564" y="47" textAnchor="end" fill="#C2410C" fontSize="12.5" fontWeight="800" fontFamily={FONT}>
            {d.evidenceLevel}
          </text>
          <line x1="36" y1="68" x2="564" y2="68" stroke="#E4DDD3" strokeWidth="1.5" />

          {/* 裁决印章 + 原生态问题 */}
          <rect x="36" y="84" width="166" height="30" rx="15" fill={badgeBg} stroke={badgeStroke} strokeWidth="1.6" />
          <circle cx="54" cy="99" r="4.5" fill={meta.dot} />
          <text x="66" y="104" fill={badgeText} fontSize="13.5" fontWeight="800" fontFamily={FONT}>
            {meta.badge}
          </text>

          {qLines.map((line, i) => (
            <text key={i} x="36" y={152 + i * 38} fill="#1C1917" fontSize="26" fontWeight="900" fontFamily={FONT}>
              {line}
            </text>
          ))}

          {/* 网友两派争论 */}
          <rect x="36" y="218" width="256" height="76" rx="14" fill="#FFFFFF" stroke="#E4DDD3" strokeWidth="1.5" />
          <text x="50" y="240" fill="#78716C" fontSize="11.5" fontWeight="700" fontFamily={FONT}>
            评论区焦虑派
          </text>
          {sideALines.map((line, i) => (
            <text key={i} x="50" y={261 + i * 19} fill="#292524" fontSize="13.5" fontWeight="600" fontFamily={FONT}>
              {line}
            </text>
          ))}

          <rect x="308" y="218" width="256" height="76" rx="14" fill="#FFFFFF" stroke="#E4DDD3" strokeWidth="1.5" />
          <text x="322" y="240" fill="#78716C" fontSize="11.5" fontWeight="700" fontFamily={FONT}>
            评论区另一派
          </text>
          {sideBLines.map((line, i) => (
            <text key={i} x="322" y={261 + i * 19} fill="#292524" fontSize="13.5" fontWeight="600" fontFamily={FONT}>
              {line}
            </text>
          ))}

          {/* ① 一句话定心丸（核心高光框） */}
          <rect x="36" y="312" width="528" height="124" rx="18" fill="#FFF7ED" stroke="#1C1917" strokeWidth="2.2" />
          <text x="56" y="340" fill="#C2410C" fontSize="13.5" fontWeight="900" fontFamily={FONT}>
            ① 一句话定心丸 · {d.verdictLabel}
          </text>
          {reassLines.map((line, i) => (
            <text key={i} x="56" y={369 + i * 25} fill="#1C1917" fontSize="18" fontWeight="800" fontFamily={FONT}>
              {line}
            </text>
          ))}

          {/* ② 身体到底发生了什么 */}
          <rect x="36" y="454" width="528" height="132" rx="16" fill="#FFFFFF" stroke="#E4DDD3" strokeWidth="1.5" />
          <text x="56" y="481" fill="#78716C" fontSize="13" fontWeight="800" fontFamily={FONT}>
            ② 身体到底发生了什么
          </text>
          {sciLines.map((line, i) => (
            <text key={i} x="56" y={506 + i * 22} fill="#292524" fontSize="15" fontWeight="500" fontFamily={FONT}>
              {line}
            </text>
          ))}

          {/* ③ 此刻最省心的做法 */}
          <rect x="36" y="600" width="528" height="114" rx="16" fill="#FFFFFF" stroke="#E4DDD3" strokeWidth="1.5" />
          <text x="56" y="627" fill="#C2410C" fontSize="13" fontWeight="800" fontFamily={FONT}>
            ③ 此刻最省心的做法（零商业带货）
          </text>
          {actLines.map((line, i) => (
            <text key={i} x="56" y={652 + i * 22} fill="#1C1917" fontSize="15" fontWeight="600" fontFamily={FONT}>
              {line}
            </text>
          ))}

          {/* 底部权威信源 + 红线声明 */}
          <line x1="36" y1="734" x2="564" y2="734" stroke="#E4DDD3" strokeWidth="1.5" />
          <text x="36" y="758" fill="#1C1917" fontSize="12.5" fontWeight="800" fontFamily={FONT}>
            权威信源：{sourceText}
          </text>
          <text x="36" y="780" fill="#78716C" fontSize="11.5" fontWeight="600" fontFamily={FONT}>
            health.heystone.site · 零带货 · 零医疗诊断 · 仅引一线权威指南
          </text>
        </svg>
      </div>

      {/* 一键操作栏 */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleDownload}
          disabled={saving}
          className="btn flex-1 justify-center !py-2.5 text-xs"
        >
          {saving ? "正在生成高清 PNG…" : "保存定心丸图 (3:4 PNG)"}
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
