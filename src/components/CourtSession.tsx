"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import { CASES, VERDICT_META, EVIDENCE_META, type Case, type Verdict } from "@/data/cases";
import { getAudience } from "@/data/audiences";
import { game, useGame } from "@/lib/game";
import { sfx } from "@/lib/sfx";
import Mascot from "./Mascot";
import Stamp from "./Stamp";

const shuffle = <T,>(a: T[]) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

async function boom(big = false) {
  const confetti = (await import("canvas-confetti")).default;
  const colors = ["#ff5a4e", "#ffd23f", "#3ddc97", "#4ea8ff", "#a78bfa"];
  confetti({ particleCount: big ? 160 : 70, spread: big ? 100 : 70, origin: { y: 0.7 }, colors, disableForReducedMotion: true });
}

export const RANKS = [
  { min: 1, title: "首席大法官", emoji: "👑", line: "谣言在你面前无处可逃。" },
  { min: 0.8, title: "金牌律师", emoji: "🥇", line: "常识扎实，偶尔被套路。" },
  { min: 0.6, title: "陪审员", emoji: "🧑‍⚖️", line: "有判断力，再多看几份判决书。" },
  { min: 0.4, title: "书记员", emoji: "📝", line: "记下来的都是收获。" },
  { min: 0, title: "吃瓜群众", emoji: "🍉", line: "没关系，被骗过才最记得住。" },
];
export const rankOf = (ratio: number) => RANKS.find((r) => ratio >= r.min) ?? RANKS[RANKS.length - 1];

type Phase = "ask" | "reveal" | "done";

export default function CourtSession({ count = 5, mode = "court" }: { count?: number; mode?: "court" | "quiz" }) {
  const g = useGame();
  const [deck, setDeck] = useState<Case[]>([]);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("ask");
  const [picked, setPicked] = useState<Verdict | null>(null);
  const [score, setScore] = useState(0);
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    const s = game.get();
    const aud = getAudience(s.audience);
    let pool: Case[];
    if (mode === "quiz") {
      pool = shuffle(CASES);
    } else {
      const unanswered = (c: Case) => !(c.slug in s.answered);
      const mine = aud ? shuffle(CASES.filter((c) => aud.cases.includes(c.slug) && unanswered(c))) : [];
      const rest = shuffle(CASES.filter((c) => !mine.includes(c) && unanswered(c)));
      const seen = shuffle(CASES.filter((c) => !unanswered(c)));
      pool = [...mine, ...rest, ...seen];
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDeck(pool.slice(0, count));
    setIdx(0);
    setPhase("ask");
    setPicked(null);
    setScore(0);
  }, [count, mode, seed]);

  const current = deck[idx];
  const correct = picked !== null && current && picked === current.verdict;

  const answer = useCallback(
    (v: Verdict) => {
      if (!current || phase !== "ask") return;
      const ok = v === current.verdict;
      setPicked(v);
      setPhase("reveal");
      game.answer(current.slug, ok);
      if (ok) {
        setScore((s) => s + 1);
        sfx.correct();
        boom();
      } else {
        sfx.wrong();
      }
      setTimeout(() => sfx.stamp(), 380);
    },
    [current, phase],
  );

  const next = useCallback(() => {
    sfx.tap();
    if (idx + 1 >= deck.length) {
      setPhase("done");
      sfx.win();
      boom(true);
    } else {
      setIdx((i) => i + 1);
      setPicked(null);
      setPhase("ask");
    }
  }, [idx, deck.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase === "ask") {
        if (e.key === "ArrowLeft") answer("false");
        if (e.key === "ArrowRight") answer("true");
        if (e.key === "ArrowUp") answer("depends");
      } else if (phase === "reveal" && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, answer, next]);

  const progress = deck.length ? (idx + (phase === "ask" ? 0 : 1)) / deck.length : 0;

  if (!deck.length) return <div className="h-[520px]" />;

  if (g.hearts <= 0 && phase === "ask") {
    return (
      <div className="panel mx-auto max-w-md p-8 text-center">
        <Mascot mood="shocked" className="mx-auto w-48 rounded-2xl" />
        <h2 className="font-display mt-4 text-3xl">今天的红心用完了！</h2>
        <p className="mt-2 text-ink-soft">被骗得有点多？去看看判决书补补课，或者深呼吸一下再来。</p>
        <div className="mt-6 flex flex-col gap-4">
          <button className="btn btn-red" onClick={() => game.refillHearts()}>
            ❤️ 深呼吸，回满红心
          </button>
          <Link href="/cases" className="btn btn-white">
            📚 翻翻判决书
          </Link>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    const ratio = score / deck.length;
    const rank = rankOf(ratio);
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="panel mx-auto max-w-md p-8 text-center">
        <Mascot mood={ratio >= 0.6 ? "happy" : "thinking"} className="mx-auto w-52 rounded-2xl" />
        <p className="mt-4 text-sm font-bold text-ink-soft">{mode === "quiz" ? "你的健康常识段位" : "本轮开庭结束"}</p>
        <h2 className="font-display mt-1 text-4xl">
          {rank.emoji} {rank.title}
        </h2>
        <p className="mt-2 text-ink-soft">{rank.line}</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="panel-flat bg-yellow/40 p-3">
            <div className="text-xs font-bold text-ink-soft">判对</div>
            <div className="font-display text-3xl">
              {score}/{deck.length}
            </div>
          </div>
          <div className="panel-flat bg-green/30 p-3">
            <div className="text-xs font-bold text-ink-soft">获得经验</div>
            <div className="font-display text-3xl">+{score * 10 + (deck.length - score) * 2}⚡</div>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-4">
          <button className="btn" onClick={() => setSeed((s) => s + 1)}>
            ⚖️ 再开一庭
          </button>
          <Link href="/" className="btn btn-white">
            回到大厅
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      {/* progress */}
      <div className="mb-5 flex items-center gap-3">
        <div className="h-5 flex-1 overflow-hidden rounded-full border-[3px] border-ink bg-white">
          <motion.div
            className="h-full rounded-full bg-green"
            animate={{ width: `${Math.max(progress * 100, 4)}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            style={{ boxShadow: "inset 0 -4px 0 rgba(0,0,0,.12), inset 0 4px 0 rgba(255,255,255,.4)" }}
          />
        </div>
        <span className="font-black tabular-nums">
          {Math.min(idx + 1, deck.length)}/{deck.length}
        </span>
      </div>

      <div className="relative h-[440px] [perspective:1400px]">
        <AnimatePresence mode="popLayout">
          <SwipeCard key={current.slug + seed} c={current} phase={phase} picked={picked} onAnswer={answer} />
        </AnimatePresence>
      </div>

      {/* answer buttons */}
      <AnimatePresence mode="wait">
        {phase === "ask" ? (
          <motion.div key="btns" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="mt-6 grid grid-cols-3 gap-3">
            <button className="btn btn-red whitespace-nowrap !px-2 sm:!px-5" onClick={() => answer("false")}>
              ❌ 假
            </button>
            <button className="btn btn-yellow whitespace-nowrap !px-2 sm:!px-5" onClick={() => answer("depends")}>
              ⚖️ 看情况
            </button>
            <button className="btn btn-green whitespace-nowrap !px-2 sm:!px-5" onClick={() => answer("true")}>
              ✅ 真
            </button>
            <p className="col-span-3 text-center text-xs text-ink-soft">拖动卡片：← 假 · ↑ 看情况 · → 真（键盘方向键也行）</p>
          </motion.div>
        ) : (
          <motion.div
            key="sheet"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="panel mt-6 flex items-center gap-4 p-4"
            style={{ background: correct ? "#d9f8e9" : "#ffe1de" }}
          >
            <Mascot mood={correct ? "happy" : "shocked"} className="w-20 shrink-0 rounded-xl border-2 border-ink" />
            <div className="min-w-0 flex-1">
              <div className="font-display text-2xl" style={{ color: correct ? "var(--green-dark)" : "var(--red-dark)" }}>
                {correct ? "判对了！+10⚡" : "被谣言骗了！-1❤️"}
              </div>
              <p className="text-sm">
                正确判决：<b>{VERDICT_META[current.verdict].label}</b> · {current.takeaway}
              </p>
              <Link href={`/cases/${current.slug}`} className="text-sm font-bold text-accent-dark underline decoration-2 underline-offset-4">
                深挖原理与原始来源 →
              </Link>
            </div>
            <button className={`btn ${correct ? "" : "btn-red"} shrink-0`} onClick={next} autoFocus>
              继续
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SwipeCard({ c, phase, picked, onAnswer }: { c: Case; phase: Phase; picked: Verdict | null; onAnswer: (v: Verdict) => void }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-14, 14]);
  const trueOp = useTransform(x, [30, 120], [0, 1]);
  const falseOp = useTransform(x, [-120, -30], [1, 0]);
  const dependsOp = useTransform(y, [-120, -30], [1, 0]);
  const revealed = phase !== "ask";
  const meta = VERDICT_META[c.verdict];

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (offset.y < -110 || velocity.y < -700) onAnswer("depends");
    else if (offset.x > 110 || velocity.x > 700) onAnswer("true");
    else if (offset.x < -110 || velocity.x < -700) onAnswer("false");
  };

  const exitX = picked === "true" ? 500 : picked === "false" ? -500 : 0;
  const exitY = picked === "depends" ? -500 : 0;

  return (
    <motion.div
      className="absolute inset-0"
      style={{ x, y, rotate }}
      drag={!revealed}
      dragSnapToOrigin
      dragElastic={0.7}
      onDragEnd={onDragEnd}
      initial={{ scale: 0.85, y: 40, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ x: exitX, y: exitY || -40, opacity: 0, rotate: exitX / 20, transition: { duration: 0.35 } }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      whileDrag={{ scale: 1.03, cursor: "grabbing" }}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: revealed ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
      >
        {/* front */}
        <div className="panel-comic absolute inset-0 flex cursor-grab flex-col p-6 [backface-visibility:hidden]">
          <div className="flex items-center justify-between text-sm font-bold text-ink-soft">
            <span>案件 No.{String(c.no).padStart(3, "0")}</span>
            <span className="rounded-full border-2 border-ink bg-cream px-2 py-0.5 text-xs text-ink">{c.category}</span>
          </div>
          <div className="mt-4 text-7xl">{c.emoji}</div>
          <div className="bubble mt-6">
            <p className="text-ink-soft">{c.hook}</p>
          </div>
          <h2 className="font-display mt-8 text-[2.1rem] leading-tight sm:text-4xl">「{c.claim}」</h2>
          <p className="mt-auto text-center text-sm font-bold text-ink-soft">这个说法是真是假？</p>

          <motion.span style={{ opacity: trueOp }} className="stamp pointer-events-none absolute right-6 top-16 text-green-dark">
            真
          </motion.span>
          <motion.span style={{ opacity: falseOp }} className="stamp pointer-events-none absolute left-6 top-16 rotate-[8deg] text-red-dark">
            假
          </motion.span>
          <motion.span style={{ opacity: dependsOp }} className="stamp pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 text-yellow-dark">
            看情况
          </motion.span>
        </div>

        {/* back */}
        <div className="panel-comic absolute inset-0 flex flex-col overflow-hidden p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]" style={{ background: "#fffdf7" }}>
          <div className="text-sm font-bold text-ink-soft">判决书 · 「{c.claim}」</div>
          <div className="mt-4 flex justify-center">{revealed && <Stamp verdict={c.verdict} big delay={0.35} />}</div>
          <p className="font-display mt-6 text-2xl leading-snug">{c.verdictLine}</p>
          <ul className="mt-4 space-y-2 text-[15px]">
            {c.points.slice(0, 2).map((p) => (
              <li key={p} className="flex gap-2">
                <span style={{ color: meta.dark }}>●</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-3 text-xs text-ink-soft">证据等级：{EVIDENCE_META[c.evidence]}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
