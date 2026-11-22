"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CASES, VERDICT_META, EVIDENCE_META, BODY_PARTS, type Case, type Verdict } from "@/data/cases";
import { AUDIENCES } from "@/data/audiences";
import { EPISODES } from "@/data/podcasts";
import { game, useGame } from "@/lib/game";
import { sfx } from "@/lib/sfx";
import Mascot from "./Mascot";
import Stamp from "./Stamp";

export default function CaseDetail({ c }: { c: Case }) {
  const g = useGame();
  const [guess, setGuess] = useState<Verdict | null>(null);
  const revealed = guess !== null || c.slug in g.answered;
  const m = VERDICT_META[c.verdict];
  const ep = EPISODES[0];
  const forWho = AUDIENCES.filter((a) => a.cases.includes(c.slug));
  const related = CASES.filter((x) => x.slug !== c.slug && (x.body === c.body || x.category === c.category)).slice(0, 3);

  const vote = (v: Verdict) => {
    setGuess(v);
    const ok = v === c.verdict;
    if (!(c.slug in g.answered)) game.answer(c.slug, ok);
    if (ok) sfx.correct();
    else sfx.wrong();
    setTimeout(() => sfx.stamp(), 300);
  };

  return (
    <article className="mx-auto max-w-3xl space-y-5">
      <Link href="/cases" className="text-sm font-bold text-ink-soft hover:text-ink">
        ← 档案室
      </Link>

      {/* panel 1 */}
      <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="panel p-6">
        <div className="flex items-center justify-between text-xs font-black text-ink-soft">
          <span>案件 No.{String(c.no).padStart(3, "0")} · 第一格 · 传闻</span>
          <span>
            {BODY_PARTS[c.body].emoji} {BODY_PARTS[c.body].label}
          </span>
        </div>
        <div className="mt-4 flex items-start gap-4">
          <span className="text-7xl">{c.emoji}</span>
          <div className="bubble flex-1">
            <p>{c.hook}</p>
          </div>
        </div>
        <h1 className="font-display mt-6 text-4xl leading-tight sm:text-5xl">「{c.claim}」</h1>
        {forWho.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {forWho.map((a) => (
              <span key={a.id} className="rounded-full border-2 border-ink px-2 py-0.5 text-xs font-bold" style={{ background: `color-mix(in srgb, ${a.color} 30%, white)` }}>
                {a.emoji} {a.label}常见
              </span>
            ))}
          </div>
        )}
      </motion.section>

      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.section key="gate" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="panel flex flex-col items-center p-6 text-center">
            <Mascot mood="thinking" className="w-32 rounded-xl" />
            <p className="font-display mt-2 text-2xl">先别偷看判决！你觉得呢？</p>
            <div className="mt-5 grid w-full max-w-md grid-cols-3 gap-3">
              <button className="btn btn-red whitespace-nowrap !px-2 sm:!px-5" onClick={() => vote("false")}>
                ❌ 假
              </button>
              <button className="btn btn-yellow whitespace-nowrap !px-2 sm:!px-5" onClick={() => vote("depends")}>
                ⚖️ 看情况
              </button>
              <button className="btn whitespace-nowrap !px-2 sm:!px-5" onClick={() => vote("true")}>
                ✅ 真
              </button>
            </div>
          </motion.section>
        ) : (
          <motion.div key="verdict" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            {guess && (
              <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="panel flex items-center gap-3 p-3" style={{ background: guess === c.verdict ? "#d9f8e9" : "#ffe1de" }}>
                <Mascot mood={guess === c.verdict ? "happy" : "shocked"} className="w-14 rounded-lg border-2 border-ink" />
                <b className="font-display text-xl">{guess === c.verdict ? "猜对了！+10⚡" : "被骗了！看看为什么 👇"}</b>
              </motion.div>
            )}

            {/* panel 2 */}
            <section className="panel p-6">
              <div className="text-xs font-black text-ink-soft">第二格 · 证据</div>
              <ul className="mt-4 space-y-3">
                {c.points.map((p, i) => (
                  <motion.li key={p} initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 + i * 0.12 }} className="flex gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-yellow text-sm font-black">{i + 1}</span>
                    <span className="text-[17px]">{p}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span>证据等级</span>
                  <span>{EVIDENCE_META[c.evidence]}</span>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4].map((n) => (
                    <motion.div
                      key={n}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.4 + n * 0.1, type: "spring" }}
                      className="h-4 origin-bottom rounded-md border-2 border-ink"
                      style={{ background: n <= c.evidence ? "var(--green)" : "#fff" }}
                    />
                  ))}
                </div>
                <div className="mt-1 flex justify-between text-[11px] text-ink-soft">
                  <span>专家意见</span>
                  <span>观察研究</span>
                  <span>随机对照</span>
                  <span>荟萃 / 指南</span>
                </div>
              </div>
            </section>

            {/* panel 3 */}
            <section className="panel relative overflow-hidden p-6" style={{ background: "#fffdf7" }}>
              <div className="text-xs font-black text-ink-soft">第三格 · 判决</div>
              <div className="mt-4 flex flex-wrap items-center gap-5">
                <Stamp verdict={c.verdict} big delay={0.2} />
                <p className="font-display flex-1 text-2xl leading-snug">{c.verdictLine}</p>
              </div>
              <div className="mt-5 rounded-2xl border-[3px] border-ink p-4" style={{ background: `color-mix(in srgb, ${m.color} 25%, white)` }}>
                <b>📌 一句话带走：</b>
                {c.takeaway}
              </div>
            </section>

            {/* sources */}
            <section className="panel-flat p-5">
              <h2 className="font-black">📎 证据来源</h2>
              <ul className="mt-2 space-y-1.5 text-sm">
                {c.sources.map((s) => (
                  <li key={s.label}>
                    <a href={s.url} target="_blank" rel="noreferrer" className="underline decoration-2 underline-offset-4 hover:text-blue-dark">
                      {s.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
              {!c.verified && <p className="mt-3 text-xs font-bold text-yellow-dark">⚠️ 本条来源仍在复核中，上线前会再核对一次原文。</p>}
            </section>

            {c.podcast && (
              <Link href="/podcasts" className="panel flex items-center gap-4 p-4 transition hover:-rotate-1" style={{ background: "#efe6ff" }}>
                <span className="text-4xl">🎧</span>
                <span className="flex-1">
                  <span className="block text-xs font-bold text-ink-soft">
                    {ep.show} {ep.vol}
                    {c.podcast.time !== "00:00" && ` · ${c.podcast.time}`}
                  </span>
                  <span className="font-bold">也聊过：{c.podcast.topic}</span>
                </span>
                <span className="font-black">→</span>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <section>
        <h2 className="font-display mb-3 text-2xl">🔗 相关案件</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {related.map((r) => (
            <Link key={r.slug} href={`/cases/${r.slug}`} className="panel p-3 transition hover:-translate-y-1">
              <span className="text-2xl">{r.emoji}</span>
              <p className="mt-1 font-bold leading-snug">{r.claim}</p>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
