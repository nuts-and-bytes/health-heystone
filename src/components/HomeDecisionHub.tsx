"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CASES } from "@/data/cases";
import {
  DILEMMAS,
  DILEMMA_VERDICT_META,
  TRACK_META,
  type Dilemma,
  type DilemmaTrack,
} from "@/data/dilemmas";
import { useGame } from "@/lib/game";
import Mascot from "./Mascot";
import { IconGavel } from "./Icons";
import PodcastMarkdown from "./PodcastMarkdown";
import DilemmaShareCard from "./DilemmaShareCard";

function dailyCase() {
  const d = new Date();
  const n = d.getFullYear() * 1000 + d.getMonth() * 40 + d.getDate();
  return CASES[n % CASES.length];
}

interface RedLineNotice {
  type: "medical" | "commerce";
  title: string;
  message: string;
}

interface AiReply {
  question: string;
  answer: string;
  mode: "ai" | "local";
  redLines: RedLineNotice[];
  matchedDilemmas: { slug: string; shortTag: string; verdictLabel: string }[];
  matches: { slug: string; claim: string }[];
}

export default function HomeDecisionHub() {
  const g = useGame();
  const [today, setToday] = useState(CASES[0]);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setToday(dailyCase()), []);
  const done = Object.keys(g.answered).length;

  const [track, setTrack] = useState<"all" | DilemmaTrack>("all");
  const [selected, setSelected] = useState<Dilemma | null>(DILEMMAS[0]);
  const [showSharePoster, setShowSharePoster] = useState(false);
  const [showListIndex, setShowListIndex] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiReply, setAiReply] = useState<AiReply | null>(null);
  const [error, setError] = useState("");
  const [feedbackDraft, setFeedbackDraft] = useState("");
  const [feedbackState, setFeedbackState] = useState<{ done: boolean; issueUrl?: string; msg?: string } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => (track === "all" ? DILEMMAS : DILEMMAS.filter((d) => d.track === track)),
    [track]
  );

  const openDilemma = (d: Dilemma, shouldScroll = false) => {
    setAiReply(null);
    setError("");
    setShowSharePoster(false);
    setSelected(d);
    if (shouldScroll) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const pickRandom = () => {
    const pool = filtered.filter((d) => d.slug !== selected?.slug);
    const list = pool.length ? pool : filtered;
    const next = list[Math.floor(Math.random() * list.length)];
    if (next) openDilemma(next, true);
  };

  const copyDilemmaLink = async (d: Dilemma) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://health.heystone.site";
    const url = `${origin}/d/${d.slug}`;
    try {
      await navigator.clipboard.writeText(`${d.question}\n定心丸：${d.verdictLabel} — ${d.reassurance}\n${url}`);
      setCopiedSlug(d.slug);
      setTimeout(() => setCopiedSlug(""), 2000);
    } catch {}
  };

  const submitFeedback = async () => {
    const text = feedbackDraft.trim();
    if (text.length < 3) return;
    try {
      const r = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "dilemma", content: text }),
      });
      const j = await r.json();
      if (r.ok) {
        setFeedbackDraft("");
        setFeedbackState({ done: true, issueUrl: j.issueUrl, msg: "记下了，核对完一线指南后就补进来。" });
      }
    } catch {}
  };

  const askDecision = async (q = input) => {
    const text = q.trim();
    if (text.length < 2 || loading) return;
    setLoading(true);
    setError("");
    setSelected(null);
    try {
      const res = await fetch("/api/smash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const j = await res.json();
      if (!res.ok) {
        setError(j.error || "请求失败，请稍后再试");
        return;
      }
      setAiReply({
        question: text,
        answer: j.answer,
        mode: j.mode,
        redLines: j.redLines ?? [],
        matchedDilemmas: j.matchedDilemmas ?? [],
        matches: j.matches ?? [],
      });
    } catch {
      setError("网络有点波动，请再点一次重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-9">
      {/* ① Hero：左 极简提问区 + 右 肌肉判官今日开庭卡 */}
      <section className="grid items-stretch gap-5 md:grid-cols-[1.38fr_0.62fr]">
        <div className="flex flex-col justify-between py-1">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 font-bold text-accent-dark">
                <span className="h-2 w-2 rounded-full bg-accent" />
                健身练吃 · 女性状态
              </span>
              <Link
                href="/about"
                className="text-ink-soft underline decoration-line underline-offset-4 transition hover:text-ink"
              >
                零带货 · 零诊疗 · 关于我们 →
              </Link>
            </div>

            <h1 className="font-display mt-3 text-4xl leading-[1.15] text-ink sm:text-5xl">
              此刻你在纠结什么？
            </h1>
            <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-[15px]">
              练完吃 KFC 会白练吗？经期能练臀腿吗？直接输入你的纠结，或者戳下面任意一个气泡——只拿 <strong>ISSN / ACSM / WHO / ACOG</strong> 一线证据说话。
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              askDecision();
            }}
            className="mt-5 flex flex-col gap-2.5 sm:flex-row"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="比如：刚练完吃麦当劳会白练吗？ / 熬夜到 2 点明天还练吗？"
              className="min-w-0 flex-1 rounded-2xl border-2 border-ink bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.16)]"
            />
            <button
              type="submit"
              disabled={loading || input.trim().length < 2}
              className="btn shrink-0 px-6 py-3 text-sm disabled:opacity-50"
            >
              {loading ? "核对证据中…" : "查证据"}
            </button>
          </form>
        </div>

        {/* 肌肉判官卡片（手机端紧凑横排，桌面端完整竖排主视觉） */}
        <aside className="panel flex flex-row items-stretch overflow-hidden bg-[#fdeecf] md:flex-col">
          <div className="relative w-28 shrink-0 overflow-hidden sm:w-36 md:w-full md:flex-1">
            <Mascot mood="hero" className="h-full w-full object-cover md:min-h-[168px]" />
            <span className="absolute left-2.5 top-2.5 hidden rounded-full border border-ink/20 bg-white/90 px-2.5 py-0.5 text-[11px] font-bold text-accent-dark backdrop-blur-sm md:inline-block">
              肌肉判官 · 今日开庭
            </span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-between border-l-2 border-ink bg-white p-3.5 md:border-l-0 md:border-t-2 md:p-4">
            <div>
              <p className="text-[11px] font-bold text-accent-dark md:text-xs md:text-ink-soft">
                <span className="md:hidden">肌肉判官 · 今日开庭</span>
                <span className="hidden md:inline">先猜真假，再看反转证据</span>
              </p>
              <Link
                href={`/cases/${today.slug}`}
                className="font-display mt-1 block line-clamp-2 text-base leading-snug text-ink hover:text-accent-dark md:text-lg"
              >
                「{today.claim}」
              </Link>
            </div>
            <div className="mt-2.5 flex items-center gap-2 md:mt-3">
              <Link href="/court" className="btn flex-1 justify-center !py-1.5 text-xs md:!py-2">
                <IconGavel width={14} height={14} />
                <span>{done > 0 ? `继续审案 (${done}/${CASES.length})` : "滑卡审案 →"}</span>
              </Link>
              <Link
                href={`/cases/${today.slug}`}
                className="shrink-0 rounded-xl border-2 border-line bg-cream px-2.5 py-1.5 text-xs font-bold text-ink transition hover:border-ink md:px-3 md:py-2"
              >
                看本案
              </Link>
            </div>
          </div>
        </aside>
      </section>

      {/* ② 纠结气泡池 + 手气不错摇一签（告别 28 张长方形卡片墙） */}
      <section className="space-y-3.5 border-t border-line pt-6">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                ["all", `全部 (${DILEMMAS.length})`],
                ["fitness-eat", "健身吃喝"],
                ["fitness-train", "训练体感"],
                ["women", "女性状态"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTrack(id)}
                className={`cursor-pointer rounded-full px-3 py-1 text-xs font-bold transition ${
                  track === id
                    ? "bg-ink text-white"
                    : "bg-white text-ink-soft hover:bg-cream hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={pickRandom}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border-2 border-ink bg-accent-soft px-3.5 py-1 text-xs font-bold text-accent-dark transition hover:-translate-y-0.5 hover:bg-accent hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="4" />
              <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" />
              <circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" />
              <circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" />
              <circle cx="8.5" cy="15.5" r="1.2" fill="currentColor" />
            </svg>
            <span>随机抽一题</span>
          </button>
        </div>

        {/* 轻盈错落的纠结气泡云 */}
        <div className="flex flex-wrap gap-2">
          {filtered.map((d) => {
            const active = selected?.slug === d.slug && !aiReply;
            const dot = DILEMMA_VERDICT_META[d.verdict].dot;
            return (
              <button
                key={d.slug}
                type="button"
                onClick={() => openDilemma(d, true)}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition sm:text-[13px] ${
                  active
                    ? "border-ink bg-ink text-white shadow-sm"
                    : "border-line bg-white text-ink hover:-translate-y-0.5 hover:border-ink"
                }`}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: active ? "#F97316" : dot }}
                />
                <span>{d.shortTag}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ③ 单张清爽「定心丸便签」（去嵌套边框，大留白好读） */}
      <div ref={resultRef}>
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {aiReply && (
          <section className="panel space-y-4 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
              <div>
                <p className="text-xs font-bold text-accent-dark">
                  {aiReply.mode === "ai" ? "AI 循证回答 · 受零带货/零诊疗红线约束" : "站内已核验资料直出"}
                </p>
                <h2 className="font-display mt-0.5 text-2xl text-ink">「{aiReply.question}」</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAiReply(null);
                  setSelected(DILEMMAS[0]);
                }}
                className="cursor-pointer rounded-lg border border-line px-2.5 py-1 text-xs font-bold text-ink-soft hover:border-ink hover:text-ink"
              >
                回到纠结便签
              </button>
            </div>

            {aiReply.redLines.length > 0 && (
              <div className="space-y-2">
                {aiReply.redLines.map((rl, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl border px-4 py-3 text-xs leading-relaxed ${
                      rl.type === "medical"
                        ? "border-red-300 bg-red-50 text-red-900"
                        : "border-amber-300 bg-amber-50 text-amber-900"
                    }`}
                  >
                    <p className="font-bold">{rl.title}</p>
                    <p className="mt-1">{rl.message}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="py-1">
              <PodcastMarkdown content={aiReply.answer} onSeek={() => {}} />
            </div>

            {aiReply.matchedDilemmas.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 border-t border-line pt-3">
                <span className="text-xs font-bold text-ink-soft">相关已核验纠结：</span>
                {aiReply.matchedDilemmas.map((md) => {
                  const full = DILEMMAS.find((d) => d.slug === md.slug);
                  return full ? (
                    <button
                      key={md.slug}
                      type="button"
                      onClick={() => openDilemma(full)}
                      className="cursor-pointer rounded-full border border-line bg-cream px-3 py-1 text-xs font-bold text-accent-dark hover:border-accent"
                    >
                      {md.shortTag} →
                    </button>
                  ) : null;
                })}
              </div>
            )}
          </section>
        )}

        {selected && !aiReply && (
          <article className="panel space-y-5 bg-white p-6 sm:p-8">
            {/* 头部：标签 + 问题 */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-ink-soft">{TRACK_META[selected.track].label}</span>
                <span className="text-line">·</span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 font-bold ${
                    DILEMMA_VERDICT_META[selected.verdict].tone
                  }`}
                >
                  {DILEMMA_VERDICT_META[selected.verdict].badge}
                </span>
                <span className="font-mono text-[11px] font-bold text-ink-soft">{selected.evidenceLevel}</span>
              </div>
              <h2 className="font-display text-2xl leading-snug text-ink sm:text-3xl">{selected.question}</h2>
            </div>

            {/* 网友两派吵法：轻排版引用，不再套厚重卡片 */}
            <div className="grid gap-3 border-y border-line py-3.5 text-sm sm:grid-cols-2 sm:gap-6">
              <div>
                <p className="text-[11px] font-bold text-ink-soft">评论区常有人吓唬你</p>
                <p className="mt-1 leading-relaxed text-ink/85">「{selected.debate.sideA}」</p>
              </div>
              <div className="sm:border-l sm:border-line sm:pl-6">
                <p className="text-[11px] font-bold text-ink-soft">另一派真实体感</p>
                <p className="mt-1 leading-relaxed text-ink/85">「{selected.debate.sideB}」</p>
              </div>
            </div>

            {/* ① 一句话定心丸 */}
            <div className="rounded-2xl bg-accent-soft/55 px-4 py-3.5">
              <p className="text-xs font-bold text-accent-dark">定心丸 · {selected.verdictLabel}</p>
              <p className="mt-1 text-base font-bold leading-relaxed text-ink">{selected.reassurance}</p>
            </div>

            {/* ② 原理 & ③ 此刻做法：干净双栏排版 */}
            <div className="grid gap-5 md:grid-cols-2 md:gap-8">
              <div>
                <p className="text-xs font-bold text-ink-soft">身体到底发生了什么</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/90">{selected.science}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-accent-dark">此刻最省心的做法（零带货）</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/90">{selected.actionNow}</p>
              </div>
            </div>

            {selected.redLine && (
              <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-xs leading-relaxed text-red-900">
                <span className="font-bold">就医红线：</span>
                {selected.redLine}
              </p>
            )}

            {/* 底部信源 + 分享操作 */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-ink-soft">信源：</span>
                {selected.sources.map((s, i) =>
                  s.url ? (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono font-bold text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
                      title={s.title}
                    >
                      {s.org} ({s.year}) ↗
                    </a>
                  ) : (
                    <span key={i} className="font-mono font-bold text-ink-soft" title={s.title}>
                      {s.org} ({s.year})
                    </span>
                  )
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSharePoster((v) => !v)}
                  className="cursor-pointer rounded-xl border-2 border-ink bg-accent-soft px-3 py-1.5 text-xs font-bold text-accent-dark transition hover:bg-accent hover:text-white"
                >
                  {showSharePoster ? "收起分享图" : "保存定心丸图 (3:4)"}
                </button>
                <button
                  type="button"
                  onClick={() => copyDilemmaLink(selected)}
                  className="cursor-pointer rounded-xl border border-line bg-white px-3 py-1.5 text-xs font-bold text-ink transition hover:border-ink"
                >
                  {copiedSlug === selected.slug ? "已复制链接 ✓" : "复制链接"}
                </button>
                <Link
                  href={`/d/${selected.slug}`}
                  className="rounded-xl border border-line bg-cream px-3 py-1.5 text-xs font-bold text-ink-soft hover:border-ink hover:text-ink"
                >
                  独立页 ↗
                </Link>
              </div>
            </div>

            {showSharePoster && (
              <div className="rounded-2xl bg-cream/50 p-4">
                <DilemmaShareCard dilemma={selected} compact />
              </div>
            )}
          </article>
        )}
      </div>

      {/* ④ 可选折叠文字索引 + 一行轻投稿（默认收起，不制造阅读压力） */}
      <section className="space-y-4 border-t border-line pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setShowListIndex((v) => !v)}
            className="w-fit cursor-pointer text-xs font-bold text-ink-soft underline decoration-line underline-offset-4 hover:text-ink"
          >
            {showListIndex ? "收起全部 28 题文字目录 ↑" : "想按清单慢慢翻？展开全部 28 题文字目录 ↓"}
          </button>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitFeedback();
            }}
            className="flex w-full gap-2 sm:max-w-sm"
          >
            <input
              value={feedbackDraft}
              onChange={(e) => setFeedbackDraft(e.target.value)}
              placeholder="有没收录的纠结？丢给我查证据…"
              className="min-w-0 flex-1 rounded-xl border border-line bg-white px-3 py-1.5 text-xs text-ink outline-none focus:border-ink"
            />
            <button
              type="submit"
              disabled={feedbackDraft.trim().length < 3}
              className="cursor-pointer rounded-xl bg-ink px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-accent disabled:opacity-40"
            >
              投稿
            </button>
          </form>
        </div>

        {feedbackState?.done && (
          <p className="text-xs text-emerald-800">
            {feedbackState.msg}
            {feedbackState.issueUrl && (
              <>
                {" "}
                <a href={feedbackState.issueUrl} target="_blank" rel="noreferrer" className="font-bold underline">
                  也可以记到公开选题单 ↗
                </a>
              </>
            )}
          </p>
        )}

        {showListIndex && (
          <ul className="divide-y divide-line rounded-2xl border border-line bg-white px-4">
            {filtered.map((d) => (
              <li key={d.slug} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <button
                  type="button"
                  onClick={() => openDilemma(d, true)}
                  className="cursor-pointer text-left font-medium text-ink hover:text-accent-dark"
                >
                  {d.question}
                </button>
                <Link
                  href={`/d/${d.slug}`}
                  className="shrink-0 text-xs font-bold text-ink-soft hover:text-accent-dark"
                >
                  独立页 ↗
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ⑤ 站内其他板块（清爽文字导航，告别大卡片墙） */}
      <section className="grid gap-6 border-t border-line pt-6 sm:grid-cols-3">
        <Link href="/body" className="group block">
          <p className="text-xs font-bold text-accent-dark">身体解剖</p>
          <p className="font-display mt-0.5 text-xl text-ink group-hover:text-accent-dark">12 块真实肌群图谱 →</p>
          <p className="mt-1 text-xs text-ink-soft">点开看每一块肌肉怎么发力，附橙线小人动画。</p>
        </Link>
        <Link href="/podcasts" className="group block">
          <p className="text-xs font-bold text-accent-dark">播客精读</p>
          <p className="font-display mt-0.5 text-xl text-ink group-hover:text-accent-dark">三栏工作台与一图读懂 →</p>
          <p className="mt-1 text-xs text-ink-soft">5 期精选健康播客，简体字幕、海报导出与流式 AI。</p>
        </Link>
        <Link href="/cases" className="group block">
          <p className="text-xs font-bold text-accent-dark">经典档案</p>
          <p className="font-display mt-0.5 text-xl text-ink group-hover:text-accent-dark">40 案健康判决书 →</p>
          <p className="mt-1 text-xs text-ink-soft">日常健康谣言全收录，每条都附原始出处。</p>
        </Link>
      </section>
    </div>
  );
}
