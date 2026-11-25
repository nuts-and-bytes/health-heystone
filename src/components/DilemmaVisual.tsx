"use client";

import type { Dilemma } from "@/data/dilemmas";

export type VisualKind =
  | "food-balance"
  | "water-drop"
  | "sleep-stop"
  | "muscle-grow"
  | "period-care"
  | "posture-alert";

export function pickVisualKind(d: Dilemma): { kind: VisualKind; caption: string } {
  const s = d.slug;
  if (
    s.includes("kfc") ||
    s.includes("cola") ||
    s.includes("milk-tea") ||
    s.includes("alcohol") ||
    s.includes("9pm") ||
    s.includes("fasted") ||
    s.includes("americano") && d.track === "fitness-eat"
  ) {
    return { kind: "food-balance", caption: "看长期总账，别为一顿饭焦虑" };
  }
  if (s.includes("hotpot") || s.includes("beginner-weight") || s.includes("pms")) {
    return { kind: "water-drop", caption: "秤上多出来的，多半是水分波动" };
  }
  if (s.includes("stay-up") || s.includes("dizzy") || s.includes("cold") || s.includes("sore-muscle")) {
    return { kind: "sleep-stop", caption: "红灯先歇，休息也是训练的一部分" };
  }
  if (s.includes("period")) {
    return { kind: "period-care", caption: "不硬扛也不躺废，跟着体感走" };
  }
  if (
    s.includes("traps") ||
    s.includes("acne") ||
    s.includes("hair-loss") ||
    s.includes("body-fat") ||
    s.includes("crunches") ||
    s.includes("tired")
  ) {
    return { kind: "posture-alert", caption: "先看身体信号，别交焦虑智商税" };
  }
  return { kind: "muscle-grow", caption: "规律练 + 吃够蛋白，稳步长力量" };
}

/** 一图胜千言：6 套手绘橙线小橙动画微场景 */
export default function DilemmaVisual({ dilemma }: { dilemma: Dilemma }) {
  const { kind, caption } = pickVisualKind(dilemma);

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-cream/75 px-4 py-3 text-center">
      {kind === "food-balance" && (
        <svg viewBox="0 0 220 130" className="h-28 w-48" fill="none" aria-hidden="true">
          <ellipse cx="110" cy="112" rx="72" ry="10" fill="#FED7AA" opacity="0.55" />
          {/* 支架 */}
          <path d="M110 108 L110 46" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M94 108 L126 108" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
          {/* 轻轻摇晃的天平梁 */}
          <g>
            <animateTransform attributeName="transform" type="rotate" values="-5 110 52; 4 110 52; -5 110 52" dur="2.8s" repeatCount="indefinite" />
            <line x1="52" y1="52" x2="168" y2="52" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
            {/* 左边：小汉堡 */}
            <line x1="60" y1="52" x2="60" y2="76" stroke="#1C1917" strokeWidth="1.6" />
            <path d="M46 76 C46 66, 74 66, 74 76 Z" fill="#F97316" stroke="#1C1917" strokeWidth="1.8" />
            <line x1="45" y1="80" x2="75" y2="80" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
            <rect x="46" y="83" width="28" height="6" rx="3" fill="#FED7AA" stroke="#1C1917" strokeWidth="1.6" />
            {/* 右边：小哑铃 */}
            <line x1="160" y1="52" x2="160" y2="78" stroke="#1C1917" strokeWidth="1.6" />
            <line x1="146" y1="82" x2="174" y2="82" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
            <rect x="142" y="75" width="6" height="14" rx="2" fill="#F97316" stroke="#1C1917" strokeWidth="1.6" />
            <rect x="172" y="75" width="6" height="14" rx="2" fill="#F97316" stroke="#1C1917" strokeWidth="1.6" />
          </g>
          {/* 小橙在旁边比 OK */}
          <circle cx="110" cy="28" r="10" fill="#F97316" stroke="#1C1917" strokeWidth="2" />
          <path d="M106 27 Q108 25 110 27 M111 27 Q113 25 115 27" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M107 32 Q110 34.5 113 32" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}

      {kind === "water-drop" && (
        <svg viewBox="0 0 220 130" className="h-28 w-48" fill="none" aria-hidden="true">
          <ellipse cx="110" cy="112" rx="70" ry="10" fill="#FED7AA" opacity="0.55" />
          {/* 体重秤 */}
          <rect x="74" y="92" width="72" height="18" rx="6" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.2" />
          <rect x="97" y="96" width="26" height="8" rx="3" fill="#FFF7ED" stroke="#F97316" strokeWidth="1.4" />
          {/* 小橙站秤上 */}
          <g>
            <animateTransform attributeName="transform" type="translate" values="0 0; 0 -2.5; 0 0" dur="2s" repeatCount="indefinite" />
            <circle cx="110" cy="40" r="12" fill="#F97316" stroke="#1C1917" strokeWidth="2.2" />
            <circle cx="106" cy="39" r="1.4" fill="#1C1917" />
            <circle cx="114" cy="39" r="1.4" fill="#1C1917" />
            <path d="M107 44 Q110 46.5 113 44" stroke="#1C1917" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="110" y1="52" x2="110" y2="76" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M110 76 L102 92 M110 76 L118 92" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M110 60 L92 54 M110 60 L128 54" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
          </g>
          {/* 飘走的小水滴（代表水钠潴留自然排出） */}
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M${142 + i * 16} ${68 - i * 10} C${138 + i * 16} ${76 - i * 10}, ${146 + i * 16} ${76 - i * 10}, ${142 + i * 16} ${68 - i * 10} Z`}
              fill="#38BDF8"
              stroke="#0284C7"
              strokeWidth="1.5"
            >
              <animateTransform attributeName="transform" type="translate" values="0 4; 0 -10; 0 4" dur={`${1.7 + i * 0.35}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.35;1;0.35" dur={`${1.7 + i * 0.35}s`} repeatCount="indefinite" />
            </path>
          ))}
        </svg>
      )}

      {kind === "sleep-stop" && (
        <svg viewBox="0 0 220 130" className="h-28 w-48" fill="none" aria-hidden="true">
          <ellipse cx="110" cy="110" rx="74" ry="10" fill="#FED7AA" opacity="0.55" />
          {/* 温暖小枕头 + 歇一歇 */}
          <rect x="48" y="84" width="124" height="22" rx="11" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.2" />
          {/* 趴着休息的小橙 */}
          <g>
            <animateTransform attributeName="transform" type="translate" values="0 0; 0 -2; 0 0" dur="2.6s" repeatCount="indefinite" />
            <circle cx="82" cy="70" r="13" fill="#F97316" stroke="#1C1917" strokeWidth="2.2" />
            <path d="M77 70 Q80 72.5 83 70 M85 70 Q88 72.5 91 70" stroke="#1C1917" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M95 76 Q122 66 148 80" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
          </g>
          {/* 漂浮的 Zzz */}
          <text x="116" y="48" fill="#F97316" fontSize="15" fontWeight="900">
            Z
            <animate attributeName="opacity" values="0.2;1;0.2" dur="2.2s" repeatCount="indefinite" />
          </text>
          <text x="132" y="34" fill="#EA580C" fontSize="19" fontWeight="900">
            Z
            <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2.2s" repeatCount="indefinite" />
          </text>
          <text x="150" y="24" fill="#FB923C" fontSize="12" fontWeight="900">
            z
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite" />
          </text>
        </svg>
      )}

      {kind === "muscle-grow" && (
        <svg viewBox="0 0 220 130" className="h-28 w-48" fill="none" aria-hidden="true">
          <ellipse cx="110" cy="112" rx="70" ry="10" fill="#FED7AA" opacity="0.55" />
          {/* 小橙开心地举小哑铃 */}
          <g>
            <circle cx="110" cy="40" r="12" fill="#F97316" stroke="#1C1917" strokeWidth="2.2" />
            <path d="M105 39 Q107 36.5 109 39 M111 39 Q113 36.5 115 39" stroke="#1C1917" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M106 44 Q110 47.5 114 44" stroke="#1C1917" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="110" y1="52" x2="110" y2="82" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M110 82 L98 106 M110 82 L122 106" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" />
            {/* 举起的手臂和哑铃 */}
            <g>
              <animateTransform attributeName="transform" type="translate" values="0 4; 0 -5; 0 4" dur="1.6s" repeatCount="indefinite" />
              <path d="M110 62 L84 52 L74 36 M110 62 L136 52 L146 36" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="62" y1="34" x2="158" y2="34" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
              <rect x="56" y="25" width="9" height="18" rx="3" fill="#F97316" stroke="#1C1917" strokeWidth="1.8" />
              <rect x="155" y="25" width="9" height="18" rx="3" fill="#F97316" stroke="#1C1917" strokeWidth="1.8" />
            </g>
          </g>
          {/* 能量小闪星 */}
          <path d="M174 52 L176 47 L178 52 L183 54 L178 56 L176 61 L174 56 L169 54 Z" fill="#F97316">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
          </path>
        </svg>
      )}

      {kind === "period-care" && (
        <svg viewBox="0 0 220 130" className="h-28 w-48" fill="none" aria-hidden="true">
          <ellipse cx="110" cy="112" rx="72" ry="10" fill="#FED7AA" opacity="0.55" />
          {/* 小橙温柔散步 + 暖色小爱心 */}
          <g>
            <animateTransform attributeName="transform" type="translate" values="0 0; 0 -2.5; 0 0" dur="2.2s" repeatCount="indefinite" />
            <circle cx="96" cy="40" r="12" fill="#F97316" stroke="#1C1917" strokeWidth="2.2" />
            <path d="M91 39 Q93 36.5 95 39 M97 39 Q99 36.5 101 39" stroke="#1C1917" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M93 44 Q96 47 99 44" stroke="#1C1917" strokeWidth="1.6" strokeLinecap="round" />
            {/* 暖围巾 */}
            <path d="M88 53 Q96 57 104 53" stroke="#FB7185" strokeWidth="4" strokeLinecap="round" />
            <line x1="96" y1="54" x2="96" y2="82" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M96 82 L86 106 M96 82 L106 106" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M96 64 L80 74 M96 64 L114 70" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
          </g>
          {/* 暖茶杯 */}
          <g transform="translate(132 76)">
            <rect x="0" y="6" width="22" height="22" rx="5" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2" />
            <path d="M22 11 C28 11, 28 21, 22 21" stroke="#1C1917" strokeWidth="2" />
            <path d="M7 1 C5 -4, 11 -7, 9 -12" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round">
              <animate attributeName="opacity" values="0.2;0.9;0.2" dur="2s" repeatCount="indefinite" />
            </path>
            <path d="M14 1 C12 -4, 18 -7, 16 -12" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round">
              <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2s" repeatCount="indefinite" />
            </path>
          </g>
          {/* 飘起的小暖心 */}
          <path d="M126 36 C126 32, 132 31, 134 35 C136 31, 142 32, 142 36 C142 41, 134 46, 134 46 C134 46, 126 41, 126 36 Z" fill="#FB7185">
            <animateTransform attributeName="transform" type="translate" values="0 3; 0 -5; 0 3" dur="2.2s" repeatCount="indefinite" />
          </path>
        </svg>
      )}

      {kind === "posture-alert" && (
        <svg viewBox="0 0 220 130" className="h-28 w-48" fill="none" aria-hidden="true">
          <ellipse cx="110" cy="112" rx="70" ry="10" fill="#FED7AA" opacity="0.55" />
          {/* 挺拔舒展的小橙 + 头顶小灯泡 */}
          <g>
            <circle cx="102" cy="46" r="12" fill="#F97316" stroke="#1C1917" strokeWidth="2.2" />
            <circle cx="98" cy="45" r="1.4" fill="#1C1917" />
            <circle cx="106" cy="45" r="1.4" fill="#1C1917" />
            <path d="M99 50 Q102 52.5 105 50" stroke="#1C1917" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="102" y1="58" x2="102" y2="86" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M102 86 L92 108 M102 86 L112 108" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M102 68 L84 78 M102 68 L124 62" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
          </g>
          {/* 亮起的小灯泡（看清原理） */}
          <g transform="translate(132 24)">
            <circle cx="14" cy="16" r="10" fill="#FEF08A" stroke="#1C1917" strokeWidth="2">
              <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
            </circle>
            <line x1="10" y1="28" x2="18" y2="28" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
            <path d="M14 2 L14 -2 M27 16 L31 16 M23 6 L26 3" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      )}

      <p className="mt-1 text-[11px] font-bold text-ink-soft">{caption}</p>
    </div>
  );
}
