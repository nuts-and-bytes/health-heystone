"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CASES, VERDICT_META, type Category } from "@/data/cases";
import { getDeep } from "@/data/deep";
import { AUDIENCES } from "@/data/audiences";
import { useGame } from "@/lib/game";
import { sfx } from "@/lib/sfx";
import { CategoryIcon } from "./Icons";

const CATS: (Category | "全部")[] = ["全部", "运动", "饮食", "睡眠", "肌肉"];

export default function CaseList() {
  const sp = useSearchParams();
  const router = useRouter();
  const cat = (sp.get("cat") as Category | null) ?? "全部";
  const forId = sp.get("for");
  const [statusFilter, setStatusFilter] = useState<"all" | "unopened" | "opened" | "animated">("all");
  const g = useGame();
  const aud = AUDIENCES.find((a) => a.id === forId);

  const openedCount = Object.keys(g.answered).length;
  const pct = Math.round((openedCount / CASES.length) * 100);

  const list = CASES.filter((c) => {
    if (cat !== "全部" && c.category !== cat) return false;
    if (aud && !aud.cases.includes(c.slug)) return false;
    const opened = c.slug in g.answered;
    if (statusFilter === "unopened" && opened) return false;
    if (statusFilter === "opened" && !opened) return false;
    if (statusFilter === "animated" && !getDeep(c.slug)?.scene) return false;
    return true;
  });

  const drawBlindBox = () => {
    sfx.tap();
    const unopened = CASES.filter((c) => !(c.slug in g.answered));
    const pool = unopened.length ? unopened : CASES;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    router.push(`/cases/${pick.slug}`);
  };

  const chip = (active: boolean) =>
    `cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition ${
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
    <div className="space-y-6">
      {/* 卷宗局头部 + 收集进度 + 盲盒抽案 */}
      <div className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex items-baseline gap-3">
            <h1 className="font-display text-3xl text-ink sm:text-4xl">判决书档案室</h1>
            <span className="font-mono text-xs font-bold text-accent-dark">
              已拆封 {openedCount} / {CASES.length}（{pct}%）
            </span>
          </div>
          <div className="h-2.5 w-full max-w-md overflow-hidden rounded-full bg-cream border border-line">
            <div className="h-full rounded-full bg-accent transition-all duration-300" style={{ width: `${Math.max(pct, 3)}%` }} />
          </div>
          <p className="text-xs text-ink-soft">没审过的卷宗保持密封，点开先站队再盖章拆封；每案都附原理图解与原始来源。</p>
        </div>
        <button onClick={drawBlindBox} className="btn shrink-0 text-sm">
          随机拆一封卷宗 →
        </button>
      </div>

      {/* 筛选条 */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
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
              {a.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              ["all", `全部（${CASES.length}）`],
              ["unopened", "未拆封"],
              ["opened", "已审结"],
              ["animated", "含小人动画"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setStatusFilter(id)}
              className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                statusFilter === id ? "bg-accent-soft text-accent-dark" : "text-ink-soft hover:bg-white hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 双栏案卷夹网格（带编号耳签、密封态与轻倾斜印章） */}
      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((c) => {
          const opened = c.slug in g.answered;
          const m = VERDICT_META[c.verdict];
          const hasScene = Boolean(getDeep(c.slug)?.scene);
          return (
            <Link
              key={c.slug}
              href={`/cases/${c.slug}`}
              className={`group relative flex flex-col justify-between rounded-2xl border-[1.5px] p-4 transition hover:-translate-y-0.5 ${
                opened
                  ? "border-line bg-white hover:border-ink"
                  : "border-dashed border-ink/30 bg-cream/70 hover:border-accent hover:bg-white"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-[11px] font-bold">
                  <span className="inline-flex items-center gap-1.5 font-mono text-ink-soft">
                    <CategoryIcon category={c.category} width={13} height={13} />
                    <span>NO.{String(c.no).padStart(3, "0")}</span>
                    <span>· {c.category}</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    {hasScene && (
                      <span className="rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-bold text-accent-dark">
                        含动画
                      </span>
                    )}
                    {c.podcast && (
                      <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-medium text-ink-soft border border-line">
                        播客
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="font-display mt-2.5 text-xl leading-snug text-ink group-hover:text-accent-dark">
                  「{c.claim}」
                </h2>
                <p className="mt-1 line-clamp-1 text-xs text-ink-soft">{c.hook}</p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-line/70 pt-2.5 text-xs">
                {opened ? (
                  <>
                    <span className="text-ink-soft">已审结 · 复盘原理</span>
                    <span
                      className="inline-block -rotate-3 rounded-md border-2 px-2 py-0.5 font-display text-sm font-bold"
                      style={{ color: m.dark, borderColor: m.color }}
                    >
                      {m.label}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-medium text-ink-soft">密封卷宗</span>
                    <span className="font-bold text-accent-dark group-hover:translate-x-0.5 transition-transform">
                      点开拆封 →
                    </span>
                  </>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
