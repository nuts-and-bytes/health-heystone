"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CASES, VERDICT_META, EVIDENCE_META, BODY_PARTS, type Case, type Verdict } from "@/data/cases";
import { getDeep } from "@/data/deep";
import { AUDIENCES } from "@/data/audiences";
import { EPISODES } from "@/data/podcasts";
import { game, useGame } from "@/lib/game";
import { sfx } from "@/lib/sfx";
import Mascot from "./Mascot";
import Stamp from "./Stamp";
import StickScene from "./StickScene";
import { CategoryIcon } from "./Icons";
import { RichText, Term } from "./Term";

/* eslint-disable @next/next/no-img-element */

function caseVisual(c: Case): { src: string; caption: string; linkHref: string; linkText: string } {
  if (c.body === "knee") {
    return {
      src: "/anatomy/anatomy-cartilage.jpg",
      caption: "膝关节解剖结构：光滑软骨与半月板负责缓冲减震",
      linkHref: "/body?tab=roles&role=cartilage",
      linkText: "去身体百科看关节软骨 →",
    };
  }
  if (c.body === "heart") {
    return {
      src: "/anatomy/anatomy-cholesterol.jpg",
      caption: "血管结构对比：畅通血管 vs 斑块堆积变窄",
      linkHref: "/body?tab=roles&role=cholesterol",
      linkText: "去身体百科看胆固醇与血管 →",
    };
  }
  if (c.body === "arm" || c.category === "肌肉") {
    return {
      src: "/anatomy/anatomy-muscles-front.jpg",
      caption: "真实骨骼肌分布：肌肉遵循「用进废退」规律",
      linkHref: "/body",
      linkText: "去点真实肌群图谱 →",
    };
  }
  if (c.body === "spine") {
    return {
      src: "/anatomy/anatomy-muscles-back.jpg",
      caption: "背部肌群与脊柱支撑：后链肌肉稳住骨头与腰背",
      linkHref: "/body",
      linkText: "去点真实肌群图谱 →",
    };
  }
  if (c.body === "stomach") {
    return {
      src: "/anatomy/anatomy-organs.jpg",
      caption: "消化与代谢器官位置：胃、胰腺与肠道协同处理食物与血糖",
      linkHref: "/body?tab=roles&role=insulin",
      linkText: "去身体百科看胰岛素与肠道 →",
    };
  }
  return {
    src: "/anatomy/anatomy-adrenal.jpg",
    caption: "内分泌与应激调节：作息与激素节律共同影响恢复",
    linkHref: "/body?tab=roles&role=adrenal",
    linkText: "去身体百科看肾上腺与皮质醇 →",
  };
}

export default function CaseDetail({ c }: { c: Case }) {
  const g = useGame();
  const [guess, setGuess] = useState<Verdict | null>(null);
  const revealed = guess !== null || c.slug in g.answered;
  const deep = getDeep(c.slug);
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

  const evidenceWord = c.evidence === 4 ? "荟萃分析" : c.evidence === 3 ? "随机对照试验" : c.evidence === 2 ? "观察研究" : "专家意见";

  return (
    <article className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center justify-between text-xs text-ink-soft">
        <Link href="/cases" className="font-medium hover:text-ink">
          ← 返回档案室
        </Link>
        <span>
          案件 No.{String(c.no).padStart(3, "0")} · {BODY_PARTS[c.body].emoji} {BODY_PARTS[c.body].label}
        </span>
      </div>

      {/* 传闻头部：开阔排版，去 emoji 堆砌 */}
      <header className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-accent-dark">
          <CategoryIcon category={c.category} width={15} height={15} />
          <span>{c.category}</span>
          <span className="text-line">·</span>
          <span className="font-normal text-ink-soft">{c.hook}</span>
        </div>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">「{c.claim}」</h1>
        {forWho.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {forWho.map((a) => (
              <span key={a.id} className="rounded-full border border-line bg-white px-2.5 py-0.5 text-xs text-ink-soft">
                {a.label}常问
              </span>
            ))}
          </div>
        )}
      </header>

      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.section
            key="gate"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="panel-comic flex flex-col items-center p-7 text-center"
          >
            <Mascot mood="thinking" className="w-28 rounded-2xl" />
            <p className="font-display mt-3 text-2xl">先站队，再揭晓判决与原理</p>
            <p className="mt-1 text-sm text-ink-soft">直觉觉得这个说法是真的还是假的？</p>
            <div className="mt-5 grid w-full max-w-md grid-cols-3 gap-3">
              <button className="btn btn-red whitespace-nowrap !px-2 sm:!px-5" onClick={() => vote("false")}>
                ❌ 假
              </button>
              <button className="btn btn-yellow whitespace-nowrap !px-2 sm:!px-5" onClick={() => vote("depends")}>
                ⚖️ 看情况
              </button>
              <button className="btn btn-green whitespace-nowrap !px-2 sm:!px-5" onClick={() => vote("true")}>
                ✅ 真
              </button>
            </div>
          </motion.section>
        ) : (
          <motion.div key="verdict" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
            {guess && (
              <div
                className="flex items-center gap-3 rounded-2xl border px-4 py-3"
                style={{
                  background: guess === c.verdict ? "#ecfdf5" : "#fef2f2",
                  borderColor: guess === c.verdict ? "#86efac" : "#fca5a5",
                }}
              >
                <Mascot mood={guess === c.verdict ? "happy" : "shocked"} className="w-12 rounded-xl border border-line" />
                <p className="font-bold text-ink">{guess === c.verdict ? "猜对了！+10⚡" : "被套路了！往下看背后的原理 👇"}</p>
              </div>
            )}

            {/* 判决摘要（全页唯一重点卡片） */}
            <section className="panel-comic p-6">
              <div className="flex flex-wrap items-center gap-4">
                <Stamp verdict={c.verdict} big delay={0.15} />
                <p className="font-display flex-1 text-2xl leading-snug text-ink">{c.verdictLine}</p>
              </div>
              <p className="mt-5 rounded-xl bg-cream px-4 py-3 text-[15px] text-ink">
                <span className="font-bold text-accent-dark">一句话带走：</span>
                {c.takeaway}
              </p>

              {/* 证据等级 + 可点术语 */}
              <div className="mt-5 border-t border-line pt-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-ink">
                    证据强度：<Term word={evidenceWord}>{EVIDENCE_META[c.evidence]}</Term>
                  </span>
                  <Link href="/guide" className="text-accent-dark hover:underline">
                    看不懂这些词？点这里 →
                  </Link>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="h-2.5 rounded-full"
                      style={{ background: n <= c.evidence ? m.color : "#ebe5dc" }}
                    />
                  ))}
                </div>
                <div className="mt-1.5 flex justify-between text-[11px] text-ink-soft">
                  <Term word="专家意见">专家意见</Term>
                  <Term word="观察研究">观察研究</Term>
                  <Term word="随机对照试验">随机对照</Term>
                  <Term word="荟萃分析">荟萃 / 指南</Term>
                </div>
              </div>
            </section>

            {/* 1 分钟速览要点（无卡片嵌套，干净排版） */}
            <section className="space-y-3">
              <h2 className="font-display text-2xl text-ink">三点结论速览</h2>
              <ul className="space-y-2.5 text-[16px] leading-relaxed text-ink">
                {c.points.map((p, i) => (
                  <li key={p} className="flex gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent-dark">
                      {i + 1}
                    </span>
                    <span>
                      <RichText text={p} />
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 深挖一层：原理、动画演示、来龙去脉（杂志长文阅读感） */}
            {deep && (
              <section className="space-y-8 border-t border-line pt-8">
                <div>
                  <p className="text-xs font-bold text-accent-dark">深挖一层 · 原理与来龙去脉</p>
                  <h2 className="font-display mt-1 text-3xl text-ink">为什么会这样？</h2>
                  <p className="mt-1 text-xs text-ink-soft">文中带橙色虚线的词都可以点开看大白话解释。</p>
                </div>

                {deep.scene ? (
                  <StickScene scene={deep.scene} caption={deep.sceneCaption} play="view" height={235} />
                ) : (
                  (() => {
                    const v = caseVisual(c);
                    return (
                      <figure className="overflow-hidden rounded-2xl border-[1.5px] border-line bg-white">
                        <div className="grid items-center gap-4 p-4 sm:grid-cols-[200px_1fr]">
                          <div className="flex h-44 items-center justify-center rounded-xl bg-cream p-2">
                            <img src={v.src} alt={v.caption} className="max-h-full max-w-full rounded-lg object-contain" />
                          </div>
                          <div className="space-y-2.5">
                            <div className="rounded-xl border border-red/30 bg-red/5 px-3.5 py-2.5 text-sm">
                              <span className="block text-[11px] font-bold text-red-dark">常见直觉误区</span>
                              <span className="text-ink">{c.hook}</span>
                            </div>
                            <div className="rounded-xl border border-green/35 bg-green/5 px-3.5 py-2.5 text-sm">
                              <span className="block text-[11px] font-bold text-green-dark">身体里的真相</span>
                              <span className="font-medium text-ink">{c.verdictLine}</span>
                            </div>
                          </div>
                        </div>
                        <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-line/70 px-4 py-2.5 text-xs text-ink-soft">
                          <span>{v.caption}</span>
                          <Link href={v.linkHref} className="font-bold text-accent-dark hover:underline">
                            {v.linkText}
                          </Link>
                        </figcaption>
                      </figure>
                    );
                  })()
                )}

                <div className="space-y-3">
                  <h3 className="font-display text-xl text-ink">① 这个说法从哪来</h3>
                  {deep.origin.map((para, i) => (
                    <p key={i} className="text-[16px] leading-[1.85] text-ink/90">
                      <RichText text={para} />
                    </p>
                  ))}
                </div>

                <div className="space-y-3">
                  <h3 className="font-display text-xl text-ink">② 身体里到底发生了什么</h3>
                  {deep.mechanism.map((para, i) => (
                    <p key={i} className="text-[16px] leading-[1.85] text-ink/90">
                      <RichText text={para} />
                    </p>
                  ))}
                </div>

                <div className="space-y-3">
                  <h3 className="font-display text-xl text-ink">③ 证据是怎么得来的</h3>
                  {deep.study.map((para, i) => (
                    <p key={i} className="text-[16px] leading-[1.85] text-ink/90">
                      <RichText text={para} />
                    </p>
                  ))}
                </div>

                <div className="rounded-2xl border border-line bg-white p-5 space-y-2.5">
                  <h3 className="font-bold text-ink">⚠️ 哪些人情况不一样</h3>
                  {deep.exceptions.map((para, i) => (
                    <p key={i} className="text-[15px] leading-relaxed text-ink-soft">
                      <RichText text={para} />
                    </p>
                  ))}
                </div>

                {!deep.confident && (
                  <p className="text-xs text-ink-soft">注：本篇部分历史或细节表述仍在人工复核中，上线前会核对原文。</p>
                )}
              </section>
            )}

            {/* 证据来源 */}
            <section className="border-t border-line pt-6">
              <h2 className="text-sm font-bold text-ink">📎 原始来源（可点开核对）</h2>
              <ul className="mt-2.5 space-y-1.5 text-sm text-ink-soft">
                {c.sources.map((s) => (
                  <li key={s.label}>
                    <a href={s.url} target="_blank" rel="noreferrer" className="underline decoration-line decoration-2 underline-offset-4 hover:text-accent-dark hover:decoration-accent">
                      {s.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
              {!c.verified && <p className="mt-2 text-xs text-accent-dark">本条来源仍在复核中，上线前会再核对一次原文。</p>}
            </section>

            {/* 播客关联 */}
            {c.podcast && (
              <Link href="/podcasts" className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 transition hover:border-accent">
                <span className="text-2xl">🎧</span>
                <span className="flex-1">
                  <span className="block text-xs text-ink-soft">
                    {ep.show} {ep.vol}
                    {c.podcast.time !== "00:00" && ` · ${c.podcast.time}`}
                  </span>
                  <span className="text-sm font-bold text-ink">播客里也聊过：{c.podcast.topic}</span>
                </span>
                <span className="text-sm font-bold text-accent-dark">去听 →</span>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 相关案件（轻量列表） */}
      <section className="border-t border-line pt-8">
        <h2 className="font-display text-xl text-ink">继续看相关案件</h2>
        <ul className="mt-3 divide-y divide-line">
          {related.map((r) => (
            <li key={r.slug}>
              <Link href={`/cases/${r.slug}`} className="flex items-center gap-3 py-3 text-sm transition hover:text-accent-dark">
                <span className="text-xl">{r.emoji}</span>
                <span className="flex-1 font-medium text-ink">「{r.claim}」</span>
                <span className="text-xs text-ink-soft">去审 →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
