"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CASES, VERDICT_META, type Category } from "@/data/cases";
import { getDeep } from "@/data/deep";
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

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1 text-xs font-medium transition ${
      active ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-soft hover:border-ink/50 hover:text-ink"
    }`;

  const href = (c: string, f: string | null) => {
    const p = new URLSearchParams();
    if (c !== "全部") p.set("cat", c);
    if (f) p.set("for", f);
    const s = p.toString();
    return `/cases${s ? `?${s}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-4xl text-ink">📚 判决书档案室</h1>
      <p className="mt-1 text-sm text-ink-soft">全部 {CASES.length} 案，每案都附来龙去脉与原理；标「含动画」的配有橙线小人讲解演示。</p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {CATS.map((c) => (
          <Link key={c} href={href(c, forId)} className={chip(cat === c)}>
            {c}
          </Link>
        ))}
        <span className="mx-1 text-line">|</span>
        <Link href={href(cat, null)} className={chip(!aud)}>
          所有人
        </Link>
        {AUDIENCES.map((a) => (
          <Link key={a.id} href={href(cat, a.id)} className={chip(aud?.id === a.id)}>
            {a.emoji} {a.label}
          </Link>
        ))}
      </div>

      {/* 清爽列表，告别满屏卡片墙疲劳 */}
      <ul className="mt-6 divide-y divide-line border-t border-line">
        {list.map((c) => {
          const ans = c.slug in g.answered;
          const m = VERDICT_META[c.verdict];
          const hasScene = Boolean(getDeep(c.slug)?.scene);
          return (
            <li key={c.slug}>
              <Link href={`/cases/${c.slug}`} className="group flex items-center gap-4 py-4 transition hover:bg-white/60 sm:px-2">
                <span className="text-3xl">{c.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-ink group-hover:text-accent-dark">「{c.claim}」</span>
                    {hasScene && (
                      <span className="rounded-md bg-accent-soft px-1.5 py-0.5 text-[11px] font-bold text-accent-dark">
                        🎬 含动画
                      </span>
                    )}
                    {c.podcast && (
                      <span className="rounded-md bg-cream px-1.5 py-0.5 text-[11px] font-medium text-ink-soft">
                        🎧 播客
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-ink-soft">{c.hook}</p>
                </div>
                <div className="shrink-0 text-right">
                  {ans ? (
                    <span className="rounded-lg border px-2 py-0.5 text-xs font-bold" style={{ color: m.dark, borderColor: m.color }}>
                      {m.emoji} {m.label}
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-ink-soft">待审 →</span>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
