"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { CASES, VERDICT_META, type Category } from "@/data/cases";
import { AUDIENCES } from "@/data/audiences";
import { useGame } from "@/lib/game";

const CATS: (Category | "全部")[] = ["全部", "运动", "饮食", "睡眠", "肌肉"];

export default function CaseList() {
  const sp = useSearchParams();
  const cat = (sp.get("cat") as Category | null) ?? "全部";
  const forId = sp.get("for");
  const g = useGame();
  const aud = AUDIENCES.find((a) => a.id === forId);

  const list = CASES.filter((c) => (cat === "全部" || c.category === cat) && (!aud || aud.cases.includes(c.slug)));

  const chip = (active: boolean) => `rounded-full border-2 border-ink px-3 py-1 text-sm font-bold transition ${active ? "bg-ink text-cream" : "bg-white hover:-translate-y-0.5"}`;
  const href = (c: string, f: string | null) => {
    const p = new URLSearchParams();
    if (c !== "全部") p.set("cat", c);
    if (f) p.set("for", f);
    const s = p.toString();
    return `/cases${s ? `?${s}` : ""}`;
  };

  return (
    <div>
      <h1 className="font-display text-4xl">📚 判决书档案室</h1>
      <p className="mt-1 text-ink-soft">没审过的案子先盖着，去法庭猜完再揭晓更好玩。</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {CATS.map((c) => (
          <Link key={c} href={href(c, forId)} className={chip(cat === c)}>
            {c}
          </Link>
        ))}
        <span className="mx-1 self-center text-ink-soft">|</span>
        <Link href={href(cat, null)} className={chip(!aud)}>
          所有人
        </Link>
        {AUDIENCES.map((a) => (
          <Link key={a.id} href={href(cat, a.id)} className={chip(aud?.id === a.id)}>
            {a.emoji} {a.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c, i) => {
          const ans = c.slug in g.answered;
          const m = VERDICT_META[c.verdict];
          return (
            <motion.div key={c.slug} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.03 }} whileHover={{ y: -5, rotate: i % 2 ? 1 : -1 }}>
              <Link href={`/cases/${c.slug}`} className="panel flex h-full flex-col p-4">
                <div className="flex items-center justify-between text-xs font-bold text-ink-soft">
                  <span>No.{String(c.no).padStart(3, "0")}</span>
                  <span>{c.category}</span>
                </div>
                <div className="mt-2 flex items-start gap-3">
                  <span className="text-4xl">{c.emoji}</span>
                  <span className="font-display text-xl leading-snug">「{c.claim}」</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  {ans ? (
                    <span className="stamp !text-base" style={{ color: m.dark }}>
                      {m.emoji} {m.label}
                    </span>
                  ) : (
                    <span className="rounded-lg border-2 border-dashed border-ink-soft px-2 py-0.5 text-sm font-bold text-ink-soft">🔒 判决未揭晓</span>
                  )}
                  {c.podcast && <span className="text-xs font-bold text-purple-dark">🎧 播客聊过</span>}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
