"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CASES, BODY_PARTS, VERDICT_META, type BodyPart } from "@/data/cases";
import { useGame } from "@/lib/game";
import { sfx } from "@/lib/sfx";

const SPOTS: { id: BodyPart; x: number; y: number }[] = [
  { id: "brain", x: 160, y: 62 },
  { id: "heart", x: 140, y: 175 },
  { id: "arm", x: 252, y: 190 },
  { id: "stomach", x: 160, y: 245 },
  { id: "spine", x: 186, y: 300 },
  { id: "knee", x: 122, y: 405 },
  { id: "feet", x: 205, y: 495 },
];

const INK = "#2b2118";

export default function BodyMap() {
  const [sel, setSel] = useState<BodyPart>("knee");
  const g = useGame();
  const cases = CASES.filter((c) => c.body === sel);
  const part = BODY_PARTS[sel];

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,360px)_1fr]">
      <div className="panel relative mx-auto w-full max-w-[360px] bg-cream p-4">
        <svg viewBox="0 0 320 540" className="w-full" role="img" aria-label="可点击的人体地图">
          {/* body */}
          <g stroke={INK} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
            {/* legs */}
            <path d="M118 340 L108 470 Q106 492 128 494 L140 494 L150 350 Z" fill="#4ea8ff" />
            <path d="M202 340 L212 470 Q214 492 192 494 L180 494 L170 350 Z" fill="#4ea8ff" />
            {/* shoes */}
            <path d="M100 488 Q100 512 132 512 L150 512 Q156 500 144 490 Z" fill="#ff5a4e" />
            <path d="M220 488 Q220 512 188 512 L170 512 Q164 500 176 490 Z" fill="#ff5a4e" />
            {/* arms */}
            <path d="M92 150 Q52 200 62 270 Q66 284 80 280 Q90 230 112 190 Z" fill="#ffc9a8" />
            <path d="M228 150 Q272 168 280 222 Q284 238 270 240 Q258 205 220 190 Z" fill="#ffc9a8" />
            {/* bicep bump */}
            <path d="M240 168 Q262 150 274 178" fill="none" />
            {/* torso */}
            <path d="M96 140 Q160 118 224 140 L218 350 Q160 366 102 350 Z" fill="#ffd23f" />
            {/* neck + head */}
            <rect x="145" y="105" width="30" height="26" rx="10" fill="#ffc9a8" />
            <circle cx="160" cy="68" r="52" fill="#ffc9a8" />
            {/* hair */}
            <path d="M110 58 Q118 14 160 16 Q206 16 212 60 Q190 40 160 44 Q130 40 110 58 Z" fill={INK} />
            {/* face */}
            <circle cx="142" cy="74" r="5" fill={INK} stroke="none" />
            <circle cx="178" cy="74" r="5" fill={INK} stroke="none" />
            <path d="M146 94 Q160 106 174 94" fill="none" />
            <circle cx="128" cy="90" r="7" fill="#ff8a7a" stroke="none" opacity=".6" />
            <circle cx="192" cy="90" r="7" fill="#ff8a7a" stroke="none" opacity=".6" />
            {/* shirt detail */}
            <path d="M160 140 L160 200" fill="none" strokeWidth="3" />
          </g>

          {SPOTS.map((s) => {
            const active = s.id === sel;
            return (
              <g
                key={s.id}
                className="cursor-pointer outline-none"
                onClick={() => {
                  sfx.tap();
                  setSel(s.id);
                }}
                role="button"
                tabIndex={0}
                aria-label={BODY_PARTS[s.id].label}
                onFocus={() => setSel(s.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSel(s.id);
                }}
              >
                <circle cx={s.x} cy={s.y} r="16" fill={active ? "#ff5a4e" : "#fff"} className="pulse-ring" style={{ transformOrigin: `${s.x}px ${s.y}px`, transformBox: "view-box" }} opacity=".6" />
                <circle cx={s.x} cy={s.y} r="17" fill={active ? "#ff5a4e" : "#fff"} stroke={INK} strokeWidth="4" />
                <text x={s.x} y={s.y + 6} textAnchor="middle" fontSize="17">
                  {BODY_PARTS[s.id].emoji}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="text-center text-xs font-bold text-ink-soft">点身体上的圆点 👆</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={sel} initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 26 }}>
          <div className="bubble">
            <p className="font-display text-3xl">
              {part.emoji} {part.label}
            </p>
            <p className="text-ink-soft">{part.blurb}</p>
          </div>
          <div className="mt-8 grid gap-3">
            {cases.map((c, i) => {
              const ans = c.slug in g.answered;
              const m = VERDICT_META[c.verdict];
              return (
                <motion.div key={c.slug} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.06 * i }}>
                  <Link href={`/cases/${c.slug}`} className="panel flex items-center gap-4 p-4 transition hover:-translate-y-1 hover:rotate-[-0.5deg]">
                    <span className="text-4xl">{c.emoji}</span>
                    <span className="flex-1">
                      <span className="block font-display text-xl leading-snug">「{c.claim}」</span>
                      <span className="text-sm text-ink-soft">{c.hook}</span>
                    </span>
                    {ans ? (
                      <span className="stamp !text-sm" style={{ color: m.dark }}>
                        {m.label}
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-ink-soft">🔒 去猜</span>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
