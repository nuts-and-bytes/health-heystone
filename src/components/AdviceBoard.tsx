"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { AUDIENCES, GENERAL_ADVICE, getAudience, type Advice } from "@/data/audiences";
import { useGame } from "@/lib/game";
import { sfx } from "@/lib/sfx";

function FlipCard({ a, i, color }: { a: Advice; i: number; color: string }) {
  const [flip, setFlip] = useState(false);
  return (
    <motion.div initial={{ y: 30, opacity: 0, rotate: i % 2 ? 3 : -3 }} animate={{ y: 0, opacity: 1, rotate: 0 }} transition={{ delay: i * 0.06, type: "spring", stiffness: 240, damping: 18 }} className="h-64 [perspective:1000px]">
      <motion.button
        onClick={() => {
          sfx.tap();
          setFlip((f) => !f);
        }}
        animate={{ rotateY: flip ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
        whileHover={{ y: -4 }}
        className="relative h-full w-full text-left [transform-style:preserve-3d]"
        aria-label={`${a.title}，点击翻面`}
      >
        <div className="panel absolute inset-0 flex flex-col p-5 [backface-visibility:hidden]" style={{ background: `color-mix(in srgb, ${color} 20%, white)` }}>
          <span className="text-5xl">{a.emoji}</span>
          <span className="font-display mt-3 text-2xl">{a.title}</span>
          <span className="mt-2 text-lg font-black leading-snug">{a.dose}</span>
          <span className="mt-auto text-xs font-bold text-ink-soft">点一下翻面看为什么 ↻</span>
        </div>
        <div className="panel absolute inset-0 flex flex-col p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="text-xs font-black text-ink-soft">为什么</span>
          <p className="mt-2 text-[16px]">{a.why}</p>
          <a href={a.source.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="mt-auto text-xs font-bold underline decoration-2 underline-offset-4">
            📎 {a.source.label} ↗
          </a>
        </div>
      </motion.button>
    </motion.div>
  );
}

export default function AdviceBoard() {
  const sp = useSearchParams();
  const g = useGame();
  const aud = getAudience(sp.get("for")) ?? getAudience(g.audience);

  return (
    <div>
      <h1 className="font-display text-4xl">🃏 最低有效剂量</h1>
      <p className="mt-1 text-ink-soft">不用一步到位，先做到卡片上的量就有收获。每张卡背面都有出处。</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {AUDIENCES.map((a) => (
          <Link
            key={a.id}
            href={`/advice?for=${a.id}`}
            className={`rounded-full border-2 border-ink px-3 py-1 text-sm font-bold transition ${aud?.id === a.id ? "bg-ink text-cream" : "bg-white hover:-translate-y-0.5"}`}
          >
            {a.emoji} {a.label}
          </Link>
        ))}
      </div>

      {aud && (
        <section className="mt-6">
          <h2 className="font-display mb-4 text-3xl">
            {aud.emoji} 给{aud.label}的 {aud.advice.length} 张卡
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {aud.advice.map((a, i) => (
              <FlipCard key={a.title} a={a} i={i} color={aud.color} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="font-display mb-4 text-3xl">🌍 人人适用</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GENERAL_ADVICE.map((a, i) => (
            <FlipCard key={a.title} a={a} i={i} color={["var(--yellow)", "var(--green)", "var(--blue)", "var(--purple)", "var(--red)"][i % 5]} />
          ))}
        </div>
      </section>
    </div>
  );
}
