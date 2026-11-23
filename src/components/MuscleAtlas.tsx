"use client";

import Link from "next/link";
import { useState } from "react";
import { MUSCLES, type MuscleItem } from "@/data/muscles";
import { CASES } from "@/data/cases";
import { sfx } from "@/lib/sfx";

/* eslint-disable @next/next/no-img-element */

export default function MuscleAtlas() {
  const [side, setSide] = useState<"front" | "back">("front");
  const list = MUSCLES.filter((m) => m.side === side);
  const [selectedId, setSelectedId] = useState<string>(list[0].id);

  const active: MuscleItem = list.find((m) => m.id === selectedId) ?? list[0];
  const related = CASES.filter((c) => active.relatedCases.includes(c.slug));

  const switchSide = (next: "front" | "back") => {
    sfx.tap();
    setSide(next);
    const first = MUSCLES.find((m) => m.side === next);
    if (first) setSelectedId(first.id);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-accent-dark">真实解剖图 · 点数字看每块肌肉的作用</p>
          <p className="text-sm text-ink-soft">小人动画看动作原理，认识身上每块肌肉长在哪、干嘛用，直接点下面这张真图。</p>
        </div>
        <div className="inline-flex rounded-xl border-2 border-ink bg-white p-0.5 text-xs font-bold">
          <button
            onClick={() => switchSide("front")}
            className={`cursor-pointer rounded-lg px-3 py-1.5 transition ${side === "front" ? "bg-ink text-white" : "text-ink-soft hover:text-ink"}`}
          >
            正面肌群（6 块）
          </button>
          <button
            onClick={() => switchSide("back")}
            className={`cursor-pointer rounded-lg px-3 py-1.5 transition ${side === "back" ? "bg-ink text-white" : "text-ink-soft hover:text-ink"}`}
          >
            背面肌群（6 块）
          </button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[minmax(0,360px)_1fr]">
        {/* 左侧：真实解剖肌群图 + 可点击编号圆点 */}
        <div className="panel relative mx-auto w-full max-w-[360px] overflow-hidden bg-cream p-2">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl">
            <img
              src={side === "front" ? "/anatomy/anatomy-muscles-front.jpg" : "/anatomy/anatomy-muscles-back.jpg"}
              alt={side === "front" ? "人体正面肌肉解剖图" : "人体背面肌肉解剖图"}
              className="h-full w-full object-contain"
            />
            {list.map((m, idx) => {
              const isSel = m.id === active.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    sfx.tap();
                    setSelectedId(m.id);
                  }}
                  style={{ left: `${m.x}%`, top: `${m.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-2 border-ink text-xs font-black transition ${
                    isSel
                      ? "z-20 h-8 w-8 scale-110 bg-accent text-white shadow-[0_0_0_5px_rgba(249,115,22,0.28)]"
                      : "z-10 h-7 w-7 bg-white/95 text-ink hover:scale-110 hover:bg-accent-soft"
                  }`}
                  aria-label={m.name}
                  title={m.name}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-1.5 px-1 pb-1">
            {list.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => {
                  sfx.tap();
                  setSelectedId(m.id);
                }}
                className={`cursor-pointer rounded-full border px-2.5 py-0.5 text-xs font-medium transition ${
                  m.id === active.id ? "border-accent bg-accent text-white font-bold" : "border-line bg-white text-ink-soft hover:border-ink"
                }`}
              >
                {idx + 1}. {m.name.split("（")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* 右侧：少字直观说明卡 */}
        <div className="space-y-5">
          <header>
            <p className="text-xs font-bold uppercase tracking-wider text-accent-dark">{active.en}</p>
            <h2 className="font-display mt-1 text-3xl text-ink">{active.name}</h2>
          </header>

          <dl className="grid gap-3">
            <div className="rounded-2xl border border-line bg-white p-4">
              <dt className="text-xs font-bold text-accent-dark">日常起什么作用</dt>
              <dd className="mt-1 text-[15.5px] font-medium text-ink">{active.dailyRole}</dd>
            </div>
            <div className="rounded-2xl border border-line bg-white p-4">
              <dt className="text-xs font-bold text-red-dark">这块肌肉弱了会怎样</dt>
              <dd className="mt-1 text-[15px] text-ink-soft">{active.ifWeak}</dd>
            </div>
            <div className="rounded-2xl border border-line bg-white p-4">
              <dt className="text-xs font-bold text-green-dark">在家就能练的起步动作</dt>
              <dd className="mt-1 text-[15px] font-medium text-ink">{active.homeMove}</dd>
            </div>
          </dl>

          {related.length > 0 && (
            <div className="border-t border-line pt-4">
              <p className="text-xs font-bold text-ink-soft">和这块肌肉有关的谣言案件</p>
              <ul className="mt-2 divide-y divide-line">
                {related.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/cases/${c.slug}`} className="group flex items-center justify-between py-2.5 text-sm transition hover:text-accent-dark">
                      <span className="font-medium text-ink group-hover:text-accent-dark">「{c.claim}」</span>
                      <span className="text-xs text-ink-soft">去审 →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
