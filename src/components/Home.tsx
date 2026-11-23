"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CASES, VERDICT_META } from "@/data/cases";
import { getAudience } from "@/data/audiences";
import { EPISODES } from "@/data/podcasts";
import { useGame } from "@/lib/game";
import { Term } from "./Term";
import Mascot from "./Mascot";
import AudiencePicker from "./AudiencePicker";
import { IconEvidence, IconGavel } from "./Icons";

function dailyCase() {
  const d = new Date();
  const n = d.getFullYear() * 1000 + d.getMonth() * 40 + d.getDate();
  return CASES[n % CASES.length];
}

export default function Home() {
  const g = useGame();
  const aud = getAudience(g.audience);
  const [today, setToday] = useState(CASES[0]);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setToday(dailyCase()), []);

  const done = Object.keys(g.answered).length;
  const ep = EPISODES[0];
  const myCases = aud ? CASES.filter((c) => aud.cases.includes(c.slug)) : CASES.slice(0, 6);

  return (
    <div className="space-y-14">
      {/* 1. HERO：克制纸面 + 唯一主动作，不再满屏彩色按钮 */}
      <section className="grid items-center gap-8 md:grid-cols-[1.2fr_0.9fr]">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-wide text-accent-dark">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span>懂点健康 · 谣言法庭 · 身体图解 · 播客精读</span>
          </p>
          <h1 className="font-display mt-3 text-4xl leading-[1.12] text-ink sm:text-5xl">
            用图解、动画和证据
            <br />
            真正<span className="text-accent">懂点健康</span>
          </h1>
          <p className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-ink-soft">
            跑步伤膝盖？每天必须走一万步？蛋黄不能吃？先猜真假，再翻开原理动画和{" "}
            <Term word="WHO" />、<Term word="荟萃分析" /> 等原始证据——不懂的词直接点开看大白话。
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/court" className="btn">
              <IconGavel width={17} height={17} />
              <span>{done > 0 ? `继续审案（已审 ${done}/${CASES.length}）` : "从第一案开始"}</span>
            </Link>
            <Link href="/guide" className="btn btn-white">
              <IconEvidence width={17} height={17} />
              <span>先看：怎么读懂证据</span>
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border-[1.5px] border-line bg-[#fdeecf]">
          <Mascot mood="hero" className="h-full w-full object-cover" />
        </div>
      </section>

      {/* 2. 新手 3 步路线（解决“第一次进来不知道从哪看起”） */}
      <section className="border-t border-line pt-10">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-2xl text-ink">第一次来？按这三步逛</h2>
          <span className="text-xs text-ink-soft">全程 3 分钟，随时可以跳着看</span>
        </div>

        <ol className="mt-5 grid gap-6 sm:grid-cols-3">
          <li className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-black text-white">1</span>
            <div>
              <p className="font-bold text-ink">在下面选你是哪类人</p>
              <p className="mt-1 text-sm text-ink-soft">优先给你看最切身的案子和每天起步建议。</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-black text-white">2</span>
            <div>
              <Link href="/court" className="font-bold text-ink underline decoration-line decoration-2 underline-offset-4 hover:decoration-accent">
                去法庭滑 5 张卡 →
              </Link>
              <p className="mt-1 text-sm text-ink-soft">先凭直觉猜真假，再看反转判决和背后的原理动画。</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-black text-white">3</span>
            <div>
              <Link href="/smash" className="font-bold text-ink underline decoration-line decoration-2 underline-offset-4 hover:decoration-accent">
                有拿不准的？扔进粉碎机 →
              </Link>
              <p className="mt-1 text-sm text-ink-soft">粘贴朋友圈或短视频里的说法，只用站内证据查。</p>
            </div>
          </li>
        </ol>

        {/* 人群选择（轻量平铺，不再厚重边框） */}
        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-bold text-ink">选你的身份（可选）</span>
            {aud && (
              <Link href={`/advice?for=${aud.id}`} className="text-xs font-bold text-accent-dark hover:underline">
                看给{aud.label}的最低有效剂量卡 →
              </Link>
            )}
          </div>
          <AudiencePicker compact />
        </div>
      </section>

      {/* 3. 今日一案 + 为你挑的卷宗（用干净列表替代满屏厚卡片） */}
      <section className="grid gap-10 border-t border-line pt-10 md:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-xs font-bold text-accent-dark">今日一案</p>
          <h2 className="font-display mt-1 text-3xl leading-snug text-ink">
            {today.emoji} 「{today.claim}」
          </h2>
          <p className="mt-2 text-sm text-ink-soft">{today.hook}</p>
          <p className="mt-4 text-sm text-ink">
            不剧透答案——点进去先站队，再看它的来龙去脉、身体机制和原始研究。
          </p>
          <Link href={`/cases/${today.slug}`} className="btn btn-white mt-5 text-sm">
            去审这一案 →
          </Link>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl text-ink">{aud ? `${aud.emoji} 给${aud.label}挑的案子` : "热门案子"}</h2>
            <Link href={aud ? `/cases?for=${aud.id}` : "/cases"} className="text-xs font-bold text-ink-soft hover:text-accent-dark">
              全部 {CASES.length} 案 →
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-line">
            {myCases.slice(0, 6).map((c) => {
              const ans = c.slug in g.answered;
              return (
                <li key={c.slug}>
                  <Link href={`/cases/${c.slug}`} className="group flex items-center gap-3 py-3 transition hover:text-accent-dark">
                    <span className="text-xl">{c.emoji}</span>
                    <span className="flex-1 text-[15px] font-medium text-ink group-hover:text-accent-dark">「{c.claim}」</span>
                    <span
                      className="text-xs font-bold"
                      style={{ color: ans ? VERDICT_META[c.verdict].dark : "var(--ink-soft)" }}
                    >
                      {ans ? `${VERDICT_META[c.verdict].label}` : "未审 →"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 4. 更多逛法：清爽三栏文字导航（告别彩虹大卡片墙与 emoji 堆砌） */}
      <section className="grid gap-6 border-t border-line pt-10 sm:grid-cols-3">
        <Link href="/body" className="group block">
          <p className="text-xs font-bold text-accent-dark">按部位与角色</p>
          <h3 className="font-display mt-1 text-2xl text-ink group-hover:text-accent-dark">认识你的身体 →</h3>
          <p className="mt-1 text-sm text-ink-soft">点膝盖、肌肉或看看肾上腺、胆固醇的小人动画科普。</p>
        </Link>
        <Link href="/advice" className="group block">
          <p className="text-xs font-bold text-accent-dark">照着做就行</p>
          <h3 className="font-display mt-1 text-2xl text-ink group-hover:text-accent-dark">最低有效剂量 →</h3>
          <p className="mt-1 text-sm text-ink-soft">不用一步到位，翻面看每条权威建议背后的原因和出处。</p>
        </Link>
        <Link href="/quiz" className="group block">
          <p className="text-xs font-bold text-accent-dark">10 题挑战</p>
          <h3 className="font-display mt-1 text-2xl text-ink group-hover:text-accent-dark">健康常识段位 →</h3>
          <p className="mt-1 text-sm text-ink-soft">从「吃瓜群众」到「首席大法官」，测测你能识破几条。</p>
        </Link>
      </section>

      {/* 5. 播客精选：带官方封面图 */}
      <section className="flex flex-col gap-4 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ep.cover} alt={ep.show} className="h-20 w-20 shrink-0 rounded-2xl border border-line object-cover" />
          <div className="max-w-lg">
            <p className="text-xs font-bold text-accent-dark">
              播客精读 · {ep.show} &amp; 健康静距离
            </p>
            <h2 className="font-display mt-0.5 text-2xl text-ink">{ep.title}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{ep.hook}</p>
          </div>
        </div>
        <Link href="/podcasts" className="btn btn-white shrink-0 text-sm">
          进入精读工作台 →
        </Link>
      </section>
    </div>
  );
}
