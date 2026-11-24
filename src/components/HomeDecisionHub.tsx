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

const HOT_SLUGS = [
  "post-workout-kfc-cola",
  "zero-cola-fat-loss",
  "hotpot-gain-2jin",
  "stay-up-late-workout",
  "period-workout-glutes-core",
  "women-lifting-bulky-legs",
  "quit-sugar-dairy-acne",
  "dieting-hair-loss-amenorrhea",
];

export default function HomeDecisionHub() {
  const g = useGame();
  const [today, setToday] = useState(CASES[0]);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setToday(dailyCase()), []);
  const done = Object.keys(g.answered).length;

  const [track, setTrack] = useState<"all" | DilemmaTrack>("all");
  const [selected, setSelected] = useState<Dilemma | null>(DILEMMAS[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiReply, setAiReply] = useState<AiReply | null>(null);
  const [error, setError] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  const hotDilemmas = useMemo(
    () => HOT_SLUGS.map((s) => DILEMMAS.find((d) => d.slug === s)).filter(Boolean) as Dilemma[],
    []
  );

  const filtered = useMemo(
    () => (track === "all" ? DILEMMAS : DILEMMAS.filter((d) => d.track === track)),
    [track]
  );

  const openDilemma = (d: Dilemma) => {
    setAiReply(null);
    setError("");
    setSelected(d);
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
    <div className="space-y-8">
      {/* ① Hero：左 反焦虑日常健康决策器 + 右 肌肉判官今日开庭卡 */}
      <section className="grid items-stretch gap-5 md:grid-cols-[1.35fr_0.65fr]">
        <div className="panel flex flex-col justify-between bg-white p-6 sm:p-7">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent-soft/70 px-3 py-1 text-xs font-bold text-accent-dark">
                聚焦健身练吃 & 女性状态 · 真实高频纠结库
              </span>
              <Link
                href="/principles"
                className="text-xs font-bold text-ink-soft underline decoration-accent/60 underline-offset-4 transition hover:text-ink"
              >
                零带货 · 零诊疗 · 权威信源白名单 →
              </Link>
            </div>

            <h1 className="font-display mt-4 text-3xl leading-tight text-ink sm:text-5xl">
              此刻你在纠结什么？
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
              不讲枯燥教材、不卖焦虑不带货。把小红书和健身房里吵翻天的日常纠结，用 <strong>ISSN / ACSM / WHO / ACOG</strong> 一线证据帮你 30 秒松一口气。
            </p>

            {/* 自由提问框 */}
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
                placeholder="例如：今天练完吃 KFC 喝可乐会白练吗？ / 生理期能练臀腿吗？"
                className="min-w-0 flex-1 rounded-2xl border-2 border-ink bg-cream/40 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/65 focus:bg-white"
              />
              <button
                type="submit"
                disabled={loading || input.trim().length < 2}
                className="btn shrink-0 px-6 py-3 text-sm disabled:opacity-50"
              >
                {loading ? "核对权威证据中…" : "查证据定调"}
              </button>
            </form>
          </div>

          {/* 高频纠结一键芯片 */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-ink-soft">大家此刻最常纠结：</span>
            {hotDilemmas.map((d) => {
              const active = selected?.slug === d.slug && !aiReply;
              return (
                <button
                  key={d.slug}
                  type="button"
                  onClick={() => openDilemma(d)}
                  className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-bold transition ${
                    active
                      ? "border-ink bg-ink text-white"
                      : "border-line bg-cream/60 text-ink hover:border-ink hover:bg-white"
                  }`}
                >
                  {d.shortTag}
                </button>
              );
            })}
          </div>
        </div>

        {/* 肌肉判官卡片（保留站内趣味互动与今日开庭入口） */}
        <aside className="panel flex flex-col overflow-hidden bg-[#fdeecf]">
          <div className="relative flex-1 overflow-hidden">
            <Mascot mood="hero" className="h-full min-h-[200px] w-full object-cover" />
            <span className="absolute left-3 top-3 rounded-full border border-ink/20 bg-white/90 px-2.5 py-0.5 text-[11px] font-bold text-accent-dark backdrop-blur-sm">
              肌肉判官 · 今日开庭
            </span>
          </div>
          <div className="border-t-2 border-ink bg-white p-4">
            <p className="text-xs font-bold text-ink-soft">先猜真假，再看反转证据</p>
            <Link
              href={`/cases/${today.slug}`}
              className="font-display mt-1 block text-lg leading-snug text-ink hover:text-accent-dark"
            >
              「{today.claim}」
            </Link>
            <div className="mt-3 flex items-center gap-2">
              <Link href="/court" className="btn flex-1 justify-center !py-2 text-xs">
                <IconGavel width={15} height={15} />
                <span>{done > 0 ? `继续审案 (${done}/${CASES.length})` : "滑卡审案 →"}</span>
              </Link>
              <Link
                href={`/cases/${today.slug}`}
                className="rounded-xl border-2 border-line bg-cream px-3 py-2 text-xs font-bold text-ink transition hover:border-ink"
              >
                看本案
              </Link>
            </div>
          </div>
        </aside>
      </section>

      {/* ② 即时决策结果区（AI 回答或当前选中的已核验纠结卡） */}
      <div ref={resultRef}>
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {aiReply && (
          <section className="panel space-y-4 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
              <div>
                <p className="text-xs font-bold text-accent-dark">
                  {aiReply.mode === "ai" ? "AI 循证决策（受双红线硬护栏约束）" : "站内已核验资料直出"}
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
                看精选纠结卡
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

            <div className="rounded-2xl border border-line bg-cream/40 p-4">
              <PodcastMarkdown content={aiReply.answer} onSeek={() => {}} />
            </div>

            {aiReply.matchedDilemmas.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-bold text-ink-soft">相关已核验高频纠结：</span>
                {aiReply.matchedDilemmas.map((md) => {
                  const full = DILEMMAS.find((d) => d.slug === md.slug);
                  return full ? (
                    <button
                      key={md.slug}
                      type="button"
                      onClick={() => openDilemma(full)}
                      className="cursor-pointer rounded-full border border-line bg-white px-3 py-1 text-xs font-bold text-accent-dark hover:border-accent"
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
          <section className="panel space-y-5 bg-white p-6 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-cream px-2.5 py-0.5 text-xs font-bold text-ink-soft">
                    {TRACK_META[selected.track].label}
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                      DILEMMA_VERDICT_META[selected.verdict].tone
                    }`}
                  >
                    {DILEMMA_VERDICT_META[selected.verdict].badge}
                  </span>
                  <span className="rounded-full border border-line bg-white px-2.5 py-0.5 font-mono text-[11px] font-bold text-ink-soft">
                    {selected.evidenceLevel}
                  </span>
                </div>
                <h2 className="font-display text-2xl leading-snug text-ink sm:text-3xl">{selected.question}</h2>
              </div>
            </div>

            {/* 网友两派真实争论 */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-cream/45 p-3.5">
                <p className="text-[11px] font-bold text-ink-soft">评论区常见焦虑说法</p>
                <p className="mt-1 text-sm leading-relaxed text-ink">「{selected.debate.sideA}」</p>
              </div>
              <div className="rounded-2xl border border-line bg-cream/45 p-3.5">
                <p className="text-[11px] font-bold text-ink-soft">评论区另一派体感</p>
                <p className="mt-1 text-sm leading-relaxed text-ink">「{selected.debate.sideB}」</p>
              </div>
            </div>

            {/* 三段式反焦虑解答 */}
            <div className="rounded-2xl border-2 border-ink bg-accent-soft/45 p-4">
              <p className="text-xs font-bold text-accent-dark">① 一句话定心丸 · {selected.verdictLabel}</p>
              <p className="mt-1 text-base font-bold leading-relaxed text-ink">{selected.reassurance}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-line bg-white p-4">
                <p className="text-xs font-bold text-ink-soft">② 身体到底发生了什么</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/90">{selected.science}</p>
              </div>
              <div className="rounded-2xl border border-line bg-white p-4">
                <p className="text-xs font-bold text-accent-dark">③ 此刻最省心的做法（零带货）</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/90">{selected.actionNow}</p>
              </div>
            </div>

            {selected.redLine && (
              <div className="rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 text-xs leading-relaxed text-red-900">
                <span className="font-bold">安全与就医红线：</span>
                {selected.redLine}
              </div>
            )}

            {/* 权威信源白名单 */}
            <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
              <span className="text-xs font-bold text-ink-soft">权威信源：</span>
              {selected.sources.map((s, i) =>
                s.url ? (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-line bg-cream/70 px-3 py-1 text-xs font-bold text-ink transition hover:border-ink"
                    title={s.title}
                  >
                    {s.org} ({s.year}) ↗
                  </a>
                ) : (
                  <span
                    key={i}
                    className="rounded-full border border-line bg-cream/50 px-3 py-1 text-xs font-bold text-ink-soft"
                    title={s.title}
                  >
                    {s.org} ({s.year})
                  </span>
                )
              )}
              <Link href="/principles" className="ml-auto text-xs font-bold text-accent-dark hover:underline">
                查看信源白名单 →
              </Link>
            </div>
          </section>
        )}
      </div>

      {/* ③ 完整 28 题高频纠结库（聚焦健身吃喝 / 训练体感 / 女性状态） */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl text-ink sm:text-3xl">高频真实纠结库（{DILEMMAS.length} 题）</h2>
            <p className="mt-1 text-xs text-ink-soft">整理自小红书 / 知乎 / B站真实热议纠结，点任意卡片展开完整证据与做法</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ["all", `全部 (${DILEMMAS.length})`],
                ["fitness-eat", `健身吃喝 (${DILEMMAS.filter((d) => d.track === "fitness-eat").length})`],
                ["fitness-train", `训练体感 (${DILEMMAS.filter((d) => d.track === "fitness-train").length})`],
                ["women", `女性状态 (${DILEMMAS.filter((d) => d.track === "women").length})`],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTrack(id)}
                className={`cursor-pointer rounded-full border-2 px-3 py-1 text-xs font-bold transition ${
                  track === id
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-white text-ink-soft hover:border-ink hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((d) => {
            const active = selected?.slug === d.slug && !aiReply;
            const meta = DILEMMA_VERDICT_META[d.verdict];
            return (
              <button
                key={d.slug}
                type="button"
                onClick={() => openDilemma(d)}
                className={`cursor-pointer rounded-2xl border-2 p-4 text-left transition ${
                  active
                    ? "border-ink bg-accent-soft/35"
                    : "border-line bg-white hover:border-ink/60"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-ink-soft">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta.dot }} />
                    {TRACK_META[d.track].label} · {d.verdictLabel}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-ink-soft">
                    {d.sources[0]?.org}
                  </span>
                </div>
                <p className="mt-1.5 text-sm font-bold leading-snug text-ink">{d.question}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-soft">{d.reassurance}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ④ 收敛后的站内延伸入口（保留全部既有精华，不抢主入口注意力） */}
      <section className="grid gap-3 border-t border-line pt-6 sm:grid-cols-3">
        <Link href="/body" className="rounded-2xl border border-line bg-white p-4 transition hover:border-ink">
          <p className="text-xs font-bold text-accent-dark">看懂身体结构</p>
          <p className="font-display mt-1 text-xl text-ink">真实肌群解剖百科 →</p>
          <p className="mt-1 text-xs text-ink-soft">12 块核心肌群真实解剖图 + 橙线小人原理动画</p>
        </Link>
        <Link href="/podcasts" className="rounded-2xl border border-line bg-white p-4 transition hover:border-ink">
          <p className="text-xs font-bold text-accent-dark">长内容精读</p>
          <p className="font-display mt-1 text-xl text-ink">健康播客三栏工作台 →</p>
          <p className="mt-1 text-xs text-ink-soft">整期简体逐字稿、一图读懂海报与流式 AI 导读问答</p>
        </Link>
        <Link href="/cases" className="rounded-2xl border border-line bg-white p-4 transition hover:border-ink">
          <p className="text-xs font-bold text-accent-dark">更多经典档案</p>
          <p className="font-display mt-1 text-xl text-ink">40 案健康判决书 & 法庭 →</p>
          <p className="mt-1 text-xs text-ink-soft">含滑卡小测与经典生活健康谣言完整来源核验</p>
        </Link>
      </section>
    </div>
  );
}
