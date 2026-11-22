"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VERDICT_META, type Verdict } from "@/data/cases";
import { sfx } from "@/lib/sfx";
import Mascot from "./Mascot";
import Stamp from "./Stamp";

interface Result {
  answer: string;
  mode: "ai" | "local";
  unmatched: boolean;
  matches: { slug: string; claim: string; emoji: string; verdict: Verdict; verdictLine: string; takeaway: string }[];
}

const EXAMPLES = ["跑步跑多了膝盖会废掉", "晚上睡不够周末补回来就行", "蛋白粉喝多了伤肾", "老人就该清瘦一点", "喝红酒能软化血管", "吃隔夜菜会致癌"];

export default function Smasher() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<Result | null>(null);
  const [err, setErr] = useState("");

  const go = async (t = text) => {
    if (t.trim().length < 2 || loading) return;
    setText(t);
    setLoading(true);
    setErr("");
    setRes(null);
    sfx.tap();
    try {
      const r = await fetch("/api/smash", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: t }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "出错了");
      setRes(j);
      setTimeout(() => sfx.stamp(), 200);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "出错了，稍后再试");
      sfx.wrong();
    } finally {
      setLoading(false);
    }
  };

  const top = res?.matches[0];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-end gap-3">
        <Mascot mood={loading ? "thinking" : res ? (res.unmatched ? "shocked" : "happy") : "thinking"} className={`w-24 rounded-xl border-[3px] border-ink ${loading ? "animate-wiggle" : ""}`} />
        <div className="bubble flex-1">
          <p className="font-bold">把朋友圈、短视频里看到的健康说法粘贴进来，法官帮你翻翻判决书。</p>
        </div>
      </div>

      <form
        className="panel mt-8 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          go();
        }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          maxLength={300}
          placeholder="比如：每天必须走一万步才健康"
          className="w-full resize-none rounded-xl border-2 border-ink/20 bg-cream/50 p-3 text-lg outline-none focus:border-ink"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) go();
          }}
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {EXAMPLES.map((ex) => (
            <button key={ex} type="button" onClick={() => go(ex)} className="rounded-full border-2 border-ink bg-white px-2.5 py-0.5 text-xs font-bold transition hover:-translate-y-0.5 hover:bg-yellow">
              {ex}
            </button>
          ))}
        </div>
        <button type="submit" disabled={loading || text.trim().length < 2} className="btn btn-purple mt-5 w-full text-lg">
          {loading ? "法官翻卷宗中……" : "🔨 粉碎它！"}
        </button>
      </form>

      {err && <p className="mt-4 font-bold text-red-dark">{err}</p>}

      <AnimatePresence>
        {res && (
          <motion.div initial={{ y: 30, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="mt-8 space-y-4">
            <div className="panel relative p-6" style={{ background: res.unmatched ? "#fff4cc" : "#fffdf7" }}>
              {top && (
                <div className="absolute -top-6 right-4">
                  <Stamp verdict={top.verdict} delay={0.15} />
                </div>
              )}
              <p className="text-xs font-black text-ink-soft">{res.mode === "ai" ? "🤖 AI 法官根据站内判决书回答" : "📚 站内判决书"}</p>
              <p className="mt-2 whitespace-pre-wrap text-lg leading-relaxed">{res.answer}</p>
              <p className="mt-4 text-xs text-ink-soft">仅供科普参考，不能替代医生的诊断。</p>
            </div>

            {res.matches.map((m) => (
              <Link key={m.slug} href={`/cases/${m.slug}`} className="panel flex items-center gap-4 p-4 transition hover:-translate-y-1">
                <span className="text-3xl">{m.emoji}</span>
                <span className="flex-1">
                  <span className="block font-bold">「{m.claim}」</span>
                  <span className="text-sm text-ink-soft">{m.verdictLine}</span>
                </span>
                <span className="text-sm font-black" style={{ color: VERDICT_META[m.verdict].dark }}>
                  {VERDICT_META[m.verdict].label} →
                </span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
