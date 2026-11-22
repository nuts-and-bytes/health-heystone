"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CASES, VERDICT_META } from "@/data/cases";
import { getAudience } from "@/data/audiences";
import { EPISODES } from "@/data/podcasts";
import { useGame } from "@/lib/game";
import Mascot from "./Mascot";
import AudiencePicker from "./AudiencePicker";

/* eslint-disable @next/next/no-img-element */

function dailyCase() {
  const d = new Date();
  const n = d.getFullYear() * 1000 + d.getMonth() * 40 + d.getDate();
  return CASES[n % CASES.length];
}

const DOORS = [
  { href: "/court", title: "开庭审案", desc: "滑卡站队，看判决", emoji: "⚖️", cls: "btn-red" },
  { href: "/quiz", title: "段位测验", desc: "10 题测你的常识段位", emoji: "🏆", cls: "btn-yellow" },
  { href: "/body", title: "身体地图", desc: "点哪儿查哪儿", emoji: "🫀", cls: "btn-blue" },
  { href: "/smash", title: "谣言粉碎机", desc: "粘贴一句话，AI 帮你查", emoji: "🔨", cls: "btn-purple" },
];

const pop = {
  hidden: { y: 30, opacity: 0 },
  show: (i: number) => ({ y: 0, opacity: 1, transition: { delay: i * 0.08, type: "spring" as const, stiffness: 260, damping: 20 } }),
};

export default function Home() {
  const g = useGame();
  const aud = getAudience(g.audience);
  const [today, setToday] = useState(CASES[0]);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setToday(dailyCase()), []);
  const done = Object.keys(g.answered).length;
  const ep = EPISODES[0];
  const myCases = aud ? CASES.filter((c) => aud.cases.includes(c.slug)) : [];

  return (
    <div className="space-y-10">
      {/* HERO panel */}
      <motion.section initial="hidden" animate="show" custom={0} variants={pop} className="panel grid overflow-hidden md:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col justify-center p-6 sm:p-8">
          <span className="w-fit -rotate-2 rounded-lg border-2 border-ink bg-yellow px-2 py-0.5 text-sm font-black">今日开庭 · 第 {done + 1} 案</span>
          <h1 className="font-display mt-4 text-5xl leading-[1.05] sm:text-6xl">
            健康谣言
            <br />
            <span className="text-red">送上法庭</span>
          </h1>
          <p className="mt-4 text-lg text-ink-soft">先站队，再看证据。跑步伤膝？一万步？蛋黄不能吃？每条判决都附权威来源。</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link href="/court" className="btn btn-red text-lg">
              ⚖️ 开始审案
            </Link>
            <Link href="/quiz" className="btn btn-white">
              🏆 测测我的段位
            </Link>
          </div>
        </div>
        <div className="relative border-t-[3px] border-ink bg-cream md:border-l-[3px] md:border-t-0">
          <Mascot mood="hero" className="animate-float h-full w-full object-cover" />
        </div>
      </motion.section>

      {/* WHO ARE YOU */}
      <motion.section initial="hidden" animate="show" custom={1} variants={pop}>
        {!aud ? (
          <div className="panel p-6">
            <div className="flex items-center gap-4">
              <Mascot mood="thinking" className="w-20 rounded-xl border-2 border-ink" />
              <div className="bubble flex-1">
                <p className="font-bold">先告诉法官，你是哪一类人？我会把和你最相关的案子排在前面。</p>
              </div>
            </div>
            <div className="mt-6">
              <AudiencePicker compact />
            </div>
          </div>
        ) : (
          <div className="panel p-6" style={{ background: `color-mix(in srgb, ${aud.color} 16%, white)` }}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-ink-soft">
                  {aud.emoji} {aud.label}专属卷宗
                </p>
                <h2 className="font-display text-3xl">{aud.tagline}</h2>
              </div>
              <Link href={`/advice?for=${aud.id}`} className="btn btn-white text-sm">
                🃏 我的建议卡
              </Link>
            </div>
            <div className="-mx-1 mt-4 flex snap-x gap-4 overflow-x-auto px-1 pb-4 pr-3 pt-2">
              {myCases.map((c, i) => {
                const ans = c.slug in g.answered;
                return (
                  <motion.div key={c.slug} whileHover={{ y: -6, rotate: i % 2 ? 2 : -2 }} className="shrink-0 snap-start">
                    <Link href={ans ? `/cases/${c.slug}` : "/court"} className="panel flex h-40 w-40 flex-col p-3">
                      <span className="text-3xl">{c.emoji}</span>
                      <span className="mt-2 text-[15px] font-black leading-snug">{c.claim}</span>
                      <span className="mt-auto text-xs font-bold" style={{ color: ans ? VERDICT_META[c.verdict].dark : "var(--ink-soft)" }}>
                        {ans ? `${VERDICT_META[c.verdict].emoji} ${VERDICT_META[c.verdict].label}` : "🔒 待审"}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </motion.section>

      {/* DOORS */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {DOORS.map((d, i) => (
          <motion.div key={d.href} initial="hidden" animate="show" custom={i + 2} variants={pop}>
            <Link href={d.href} className={`btn ${d.cls} h-full w-full flex-col items-start !p-4 text-left`}>
              <span className="text-3xl">{d.emoji}</span>
              <span className="font-display text-2xl">{d.title}</span>
              <span className="text-sm font-bold opacity-90">{d.desc}</span>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* COMIC STRIP: daily case */}
      <section>
        <h2 className="font-display mb-4 text-3xl">📅 每日一案</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="panel p-5">
            <div className="text-xs font-black text-ink-soft">第一格 · 传闻</div>
            <div className="mt-3 text-6xl">{today.emoji}</div>
            <div className="bubble mt-4">{today.hook}</div>
          </div>
          <div className="panel flex flex-col p-5">
            <div className="text-xs font-black text-ink-soft">第二格 · 你怎么看</div>
            <p className="font-display mt-4 text-3xl leading-tight">「{today.claim}」</p>
            <Mascot mood="thinking" className="mt-auto w-24 self-end rounded-xl" />
          </div>
          <Link href={`/cases/${today.slug}`} className="panel group relative flex flex-col items-center justify-center overflow-hidden bg-ink p-5 text-center text-cream transition hover:-rotate-1">
            <div className="text-xs font-black opacity-70">第三格 · 判决</div>
            <div className="font-display mt-3 text-5xl transition group-hover:scale-110">？？？</div>
            <p className="mt-3 font-bold">点开揭晓 →</p>
          </Link>
        </div>
      </section>

      {/* TOPICS */}
      <section>
        <h2 className="font-display mb-4 text-3xl">🗂️ 按主题翻卷宗</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { k: "运动", img: "topic-exercise" },
            { k: "饮食", img: "topic-diet" },
            { k: "睡眠", img: "topic-sleep" },
            { k: "肌肉", img: "topic-muscle" },
          ].map((t, i) => (
            <motion.div key={t.k} whileHover={{ y: -6, rotate: i % 2 ? 2 : -2 }}>
              <Link href={`/cases?cat=${t.k}`} className="panel block overflow-hidden">
                <img src={`/illustrations/${t.img}.jpg`} alt={t.k} className="aspect-square w-full border-b-[3px] border-ink object-cover" />
                <div className="flex items-center justify-between p-3">
                  <span className="font-display text-2xl">{t.k}</span>
                  <span className="text-sm font-bold text-ink-soft">{CASES.filter((c) => c.category === t.k).length} 案</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PODCAST */}
      <section className="panel grid gap-4 p-6 md:grid-cols-[auto_1fr]" style={{ background: "#efe6ff" }}>
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-[3px] border-ink bg-yellow text-5xl">🍍</div>
        <div>
          <p className="text-sm font-bold text-ink-soft">
            🎧 播客推荐 · {ep.show} {ep.vol}
          </p>
          <h3 className="font-display text-2xl leading-snug">{ep.title}</h3>
          <p className="mt-1 text-ink-soft">{ep.hook}</p>
          <Link href="/podcasts" className="btn btn-purple mt-4 text-sm">
            看本期 16 个话题 →
          </Link>
        </div>
      </section>
    </div>
  );
}
