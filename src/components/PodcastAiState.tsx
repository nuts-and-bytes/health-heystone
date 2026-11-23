"use client";

import { useEffect, useState } from "react";

export type AiStateKind = "idle-guide" | "thinking" | "no-key" | "error";

const THINKING_LINES_GUIDE = [
  "正在戴上耳机，帮你把整期逐字稿先听一遍…",
  "正在筛掉寒暄口播，挑出真正有料的核心观点…",
  "正在摘录嘉宾最有画面感的原话金句…",
  "正在给每条结论贴上可点击跳播的时间戳…",
];

const THINKING_LINES_QA = [
  "正在翻看整期简体逐字稿，找最贴切的那几段…",
  "正在核对嘉宾原话和对应的时间戳…",
  "正在把专业医学词翻译成好懂的大白话…",
];

function SvgThinking() {
  return (
    <svg viewBox="0 0 220 132" className="mx-auto h-28 w-48" fill="none" aria-hidden="true">
      {/* 暖黄台灯光晕 */}
      <ellipse cx="110" cy="96" rx="76" ry="22" fill="#FEF3C7" opacity="0.7" />
      <path d="M168 38 L138 92 L198 92 Z" fill="#FED7AA" opacity="0.45">
        <animate attributeName="opacity" values="0.35;0.58;0.35" dur="2.6s" repeatCount="indefinite" />
      </path>

      {/* 小台灯 */}
      <path d="M164 38 L174 38 L180 50 L158 50 Z" fill="#F97316" stroke="#1C1917" strokeWidth="2" strokeLinejoin="round" />
      <path d="M172 50 L182 82 L176 102" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="162" y1="102" x2="188" y2="102" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />

      {/* 桌面 */}
      <line x1="30" y1="102" x2="196" y2="102" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />

      {/* 左侧跳动声波 */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={36 + i * 7} y="74" width="3.5" height="16" rx="1.8" fill="#F97316">
          <animate
            attributeName="height"
            values={i % 2 === 0 ? "8;24;8" : "20;8;20"}
            dur={`${0.9 + i * 0.18}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            values={i % 2 === 0 ? "86;70;86" : "74;86;74"}
            dur={`${0.9 + i * 0.18}s`}
            repeatCount="indefinite"
          />
        </rect>
      ))}

      {/* 小橙（戴耳机伏案记笔记） */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0; 0 -2; 0 0" dur="1.8s" repeatCount="indefinite" />
        {/* 耳机头梁 */}
        <path d="M84 52 C84 36, 114 36, 114 52" stroke="#F97316" strokeWidth="3.2" strokeLinecap="round" />
        {/* 头部 */}
        <circle cx="99" cy="54" r="13" fill="#FFFBF5" stroke="#1C1917" strokeWidth="2.2" />
        {/* 耳机耳罩 */}
        <rect x="81" y="49" width="6" height="11" rx="3" fill="#F97316" stroke="#1C1917" strokeWidth="1.6" />
        <rect x="111" y="49" width="6" height="11" rx="3" fill="#F97316" stroke="#1C1917" strokeWidth="1.6" />
        {/* 专注微笑眼睛 */}
        <circle cx="95" cy="54" r="1.4" fill="#1C1917" />
        <circle cx="104" cy="54" r="1.4" fill="#1C1917" />
        <path d="M96.5 59 Q100 62 103.5 59" stroke="#1C1917" strokeWidth="1.6" strokeLinecap="round" />
        {/* 身体 */}
        <path d="M99 67 L96 92" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
        {/* 写字的手与橙色铅笔 */}
        <g>
          <animateTransform attributeName="transform" type="rotate" values="-4 98 76; 6 98 76; -4 98 76" dur="0.7s" repeatCount="indefinite" />
          <path d="M98 76 L116 86 L124 88" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="121" y1="92" x2="132" y2="80" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>

      {/* 笔记本 */}
      <path d="M108 92 L144 92 L148 102 L104 102 Z" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2" strokeLinejoin="round" />
      <line x1="114" y1="96" x2="136" y2="96" stroke="#F97316" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="16">
        <animate attributeName="stroke-dashoffset" values="16;0;16" dur="1.4s" repeatCount="indefinite" />
      </line>

      {/* 飘起的小想法泡泡 */}
      <circle cx="118" cy="30" r="3" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5">
        <animate attributeName="cy" values="34;20;34" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;1;0.3" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="128" cy="20" r="4.5" fill="#FFF7ED" stroke="#F97316" strokeWidth="1.5">
        <animate attributeName="cy" values="26;12;26" dur="2.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function SvgIdleGuide() {
  return (
    <svg viewBox="0 0 220 124" className="mx-auto h-24 w-44" fill="none" aria-hidden="true">
      <ellipse cx="110" cy="98" rx="68" ry="14" fill="#FEF3C7" opacity="0.65" />

      {/* 翻开的小笔记 */}
      <g transform="translate(116 54)">
        <rect x="0" y="6" width="44" height="36" rx="5" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2" />
        <line x1="8" y1="16" x2="34" y2="16" stroke="#F97316" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="8" y1="24" x2="30" y2="24" stroke="#D6D3D1" strokeWidth="2" strokeLinecap="round" />
        <line x1="8" y1="32" x2="24" y2="32" stroke="#D6D3D1" strokeWidth="2" strokeLinecap="round" />
        {/* 闪光小星 */}
        <path d="M48 4 L50 0 L52 4 L56 6 L52 8 L50 12 L48 8 L44 6 Z" fill="#F97316">
          <animateTransform attributeName="transform" type="scale" values="0.85;1.15;0.85" additive="sum" dur="2.2s" repeatCount="indefinite" />
        </path>
      </g>

      {/* 小橙戴耳机招手 */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0; 0 -2.5; 0 0" dur="2.6s" repeatCount="indefinite" />
        <path d="M62 44 C62 28, 92 28, 92 44" stroke="#F97316" strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="77" cy="46" r="13" fill="#FFFBF5" stroke="#1C1917" strokeWidth="2.2" />
        <rect x="59" y="41" width="6" height="11" rx="3" fill="#F97316" stroke="#1C1917" strokeWidth="1.6" />
        <rect x="89" y="41" width="6" height="11" rx="3" fill="#F97316" stroke="#1C1917" strokeWidth="1.6" />
        <circle cx="73" cy="46" r="1.4" fill="#1C1917" />
        <circle cx="82" cy="46" r="1.4" fill="#1C1917" />
        <path d="M74 51 Q77.5 54 81 51" stroke="#1C1917" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="77" y1="59" x2="77" y2="85" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M77 85 L68 98 M77 85 L86 98" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
        {/* 指向笔记的手 */}
        <path d="M77 68 L104 68" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M77 68 L62 76" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function SvgNoKey() {
  return (
    <svg viewBox="0 0 220 128" className="mx-auto h-28 w-48" fill="none" aria-hidden="true">
      <ellipse cx="110" cy="102" rx="74" ry="15" fill="#FEF3C7" opacity="0.65" />

      {/* 暖茶杯与袅袅热气 */}
      <g transform="translate(148 70)">
        <path d="M6 2 C4 -4, 10 -8, 8 -14" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" opacity="0.8">
          <animate attributeName="opacity" values="0.2;0.9;0.2" dur="2.2s" repeatCount="indefinite" />
        </path>
        <path d="M14 2 C12 -4, 18 -8, 16 -14" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" opacity="0.6">
          <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.2s" repeatCount="indefinite" />
        </path>
        <rect x="0" y="6" width="22" height="22" rx="5" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2" />
        <path d="M22 11 C28 11, 28 22, 22 22" stroke="#1C1917" strokeWidth="2" />
        <rect x="3" y="13" width="16" height="12" rx="3" fill="#FED7AA" />
      </g>

      {/* 右侧等待连接的虚线插座 */}
      <rect x="114" y="54" width="22" height="22" rx="6" fill="#FFF7ED" stroke="#F97316" strokeWidth="1.8" strokeDasharray="3 2.5" />
      <line x1="121" y1="62" x2="121" y2="68" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
      <line x1="129" y1="62" x2="129" y2="68" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />

      {/* 小橙双手捧着可爱小插头 */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0; 2 0; 0 0" dur="2.2s" repeatCount="indefinite" />
        <circle cx="66" cy="46" r="13" fill="#FFFBF5" stroke="#1C1917" strokeWidth="2.2" />
        <circle cx="62" cy="46" r="1.4" fill="#1C1917" />
        <circle cx="71" cy="46" r="1.4" fill="#1C1917" />
        <path d="M64 51 Q67 53.5 70 51" stroke="#1C1917" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="66" y1="59" x2="66" y2="87" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M66 87 L57 100 M66 87 L75 100" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
        {/* 递出插头的手 */}
        <path d="M66 68 L90 65" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
        <rect x="89" y="58" width="11" height="14" rx="3" fill="#F97316" stroke="#1C1917" strokeWidth="1.8" />
        <line x1="100" y1="62" x2="106" y2="62" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
        <line x1="100" y1="68" x2="106" y2="68" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function SvgError() {
  return (
    <svg viewBox="0 0 220 124" className="mx-auto h-24 w-44" fill="none" aria-hidden="true">
      <ellipse cx="110" cy="98" rx="68" ry="14" fill="#FEF3C7" opacity="0.65" />

      {/* 飘动的小云朵 */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0; 6 0; 0 0" dur="3.4s" repeatCount="indefinite" />
        <path
          d="M132 34 C132 28, 140 24, 146 27 C150 22, 160 23, 162 29 C168 30, 169 38, 163 40 L135 40 C130 40, 129 35, 132 34 Z"
          fill="#FFFFFF"
          stroke="#1C1917"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </g>

      {/* 微微摇晃的小信号天线 */}
      <g>
        <animateTransform attributeName="transform" type="rotate" values="-6 138 96; 6 138 96; -6 138 96" dur="2s" repeatCount="indefinite" />
        <line x1="138" y1="96" x2="138" y2="56" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="138" cy="53" r="4.5" fill="#F97316" stroke="#1C1917" strokeWidth="1.8" />
        <path d="M128 47 C132 42, 144 42, 148 47" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" opacity="0.65">
          <animate attributeName="opacity" values="0.2;0.9;0.2" dur="1.6s" repeatCount="indefinite" />
        </path>
      </g>

      {/* 歪头的小橙 */}
      <g>
        <circle cx="82" cy="48" r="13" fill="#FFFBF5" stroke="#1C1917" strokeWidth="2.2" />
        <circle cx="78" cy="47" r="1.4" fill="#1C1917" />
        <circle cx="87" cy="48" r="1.4" fill="#1C1917" />
        <path d="M80 53 Q83 51.5 86 53" stroke="#1C1917" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="82" y1="61" x2="82" y2="86" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M82 86 L73 98 M82 86 L91 98" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M82 70 L108 66" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M82 70 L68 78" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default function PodcastAiState({
  kind,
  mode = "guide",
  detail,
  segmentCount,
  onPrimary,
  primaryLabel,
  onSecondary,
  secondaryLabel,
}: {
  kind: AiStateKind;
  mode?: "guide" | "qa";
  detail?: string;
  segmentCount?: number;
  onPrimary?: () => void;
  primaryLabel?: string;
  onSecondary?: () => void;
  secondaryLabel?: string;
}) {
  const lines = mode === "guide" ? THINKING_LINES_GUIDE : THINKING_LINES_QA;
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    if (kind !== "thinking") return;
    const t = setInterval(() => {
      setLineIdx((i) => (i + 1) % lines.length);
    }, 2800);
    return () => clearInterval(t);
  }, [kind, lines.length]);

  if (kind === "thinking") {
    return (
      <div className="rounded-2xl border border-accent/35 bg-gradient-to-b from-cream/90 to-white px-5 py-6 text-center">
        <SvgThinking />
        <p className="mt-2 text-sm font-bold text-ink">{lines[lineIdx]}</p>
        <p className="mt-1 text-xs text-ink-soft">
          {segmentCount ? `正在阅读全部 ${segmentCount} 段简体逐字稿，首字到达后会实时流式展开` : "模型思考中，首字到达后会实时流式展开"}
        </p>
        <div className="mx-auto mt-3 h-1.5 w-40 overflow-hidden rounded-full bg-accent-soft">
          <div className="h-full w-1/2 animate-[pulse_1.4s_ease-in-out_infinite] rounded-full bg-accent" />
        </div>
        {onPrimary && (
          <button
            type="button"
            onClick={onPrimary}
            className="mt-4 cursor-pointer rounded-xl border border-line bg-white px-3.5 py-1.5 text-xs font-bold text-ink-soft transition hover:border-ink hover:text-ink"
          >
            {primaryLabel ?? "先停一下"}
          </button>
        )}
      </div>
    );
  }

  if (kind === "no-key") {
    return (
      <div className="rounded-2xl border border-line bg-gradient-to-b from-cream/85 to-white px-5 py-6 text-center">
        <SvgNoKey />
        <p className="font-display mt-1 text-xl text-ink">AI 精读小助手还没通上电呢</p>
        <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-ink-soft">
          先泡杯热茶不着急——不配模型也能照常听完整播客、看简体字幕、保存「一图读懂」和下方官方章节对照。
        </p>
        <div className="mx-auto mt-3 max-w-sm rounded-xl border border-dashed border-accent/50 bg-white px-3.5 py-2.5 text-left text-[11px] leading-relaxed text-ink-soft">
          <p className="font-bold text-ink">想唤醒流式 AI 导读与问答？</p>
          <p className="mt-1">
            在项目根目录 <code className="rounded bg-cream px-1 py-0.5 font-mono text-accent-dark">.env.local</code> 填入{" "}
            <code className="rounded bg-cream px-1 py-0.5 font-mono text-accent-dark">OPENAI_API_KEY</code>，重启开发服务即可。
          </p>
        </div>
        {onPrimary && (
          <button
            type="button"
            onClick={onPrimary}
            className="mt-4 cursor-pointer rounded-xl border border-ink bg-white px-4 py-1.5 text-xs font-bold text-ink transition hover:bg-cream"
          >
            {primaryLabel ?? "我已配好，重新检测"}
          </button>
        )}
      </div>
    );
  }

  if (kind === "error") {
    return (
      <div className="rounded-2xl border border-accent/35 bg-gradient-to-b from-cream/85 to-white px-5 py-6 text-center">
        <SvgError />
        <p className="font-display mt-1 text-xl text-ink">刚刚网络打了个盹</p>
        <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-ink-soft">
          {detail || "和 AI 模型的连接短暂断开了一下，点下面再试一次就好。"}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {onPrimary && (
            <button
              type="button"
              onClick={onPrimary}
              className="cursor-pointer rounded-xl bg-accent px-4 py-1.5 text-xs font-bold text-white transition hover:bg-accent-dark"
            >
              {primaryLabel ?? "再试一次"}
            </button>
          )}
          {onSecondary && (
            <button
              type="button"
              onClick={onSecondary}
              className="cursor-pointer rounded-xl border border-line bg-white px-3.5 py-1.5 text-xs font-bold text-ink-soft hover:border-ink hover:text-ink"
            >
              {secondaryLabel ?? "先看官方章节"}
            </button>
          )}
        </div>
      </div>
    );
  }

  // idle-guide
  return (
    <div className="rounded-2xl border border-line bg-gradient-to-b from-cream/85 to-white px-5 py-6 text-center">
      <SvgIdleGuide />
      <p className="font-display mt-1 text-xl text-ink">1 分钟摸清这期精华</p>
      <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-ink-soft">
        我帮你通读整期 {segmentCount ?? ""} 段简体逐字稿，提炼「一句话总结、时间线、核心观点、原话金句、先听这几段」，每条带时间戳，点一下直接跳播。
      </p>
      {onPrimary && (
        <button
          type="button"
          onClick={onPrimary}
          className="mt-4 cursor-pointer rounded-xl bg-ink px-5 py-2 text-xs font-bold text-white transition hover:bg-accent"
        >
          {primaryLabel ?? "生成 AI 导读"}
        </button>
      )}
    </div>
  );
}
