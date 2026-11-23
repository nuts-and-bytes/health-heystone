"use client";

import Link from "next/link";
import { useState } from "react";
import { MUSCLES, type MuscleItem } from "@/data/muscles";
import { CASES } from "@/data/cases";
import { sfx } from "@/lib/sfx";
import StickScene from "./StickScene";

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
        <p className="text-sm text-ink-soft">左边真图认位置，右边小人看怎么练。</p>
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

      <div className="grid gap-8 md:grid-cols-[minmax(0,340px)_1fr]">
        {/* 左侧：真实解剖肌群图 + 可点击编号圆点 */}
        <div className="panel relative mx-auto w-full max-w-[340px] overflow-hidden bg-cream p-2">
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

        {/* 右侧：图解优先 —— 小人动作演示 + 极简 2 条要点 */}
        <div className="space-y-4">
          <header>
            <p className="text-xs font-bold uppercase tracking-wider text-accent-dark">{active.en}</p>
            <h2 className="font-display mt-0.5 text-3xl text-ink">{active.name}</h2>
          </header>

          {/* 动作演示小人动画（与全站小橙人物统一） */}
          <div className="[&>figure]:my-0">
            <StickScene key={active.id} scene={active.demoScene} caption={`推荐起步动作：${active.homeMove}`} play="view" height={200} />
          </div>

          {/* 精简两栏对照，少字一眼读完 */}
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-white p-3.5">
              <dt className="text-xs font-bold text-accent-dark">日常起什么作用</dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink">{active.dailyRole}</dd>
            </div>
            <div className="rounded-xl border border-line bg-white p-3.5">
              <dt className="text-xs font-bold text-red-dark">弱了会怎样</dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink-soft">{active.ifWeak}</dd>
            </div>
          </dl>

          {related.length > 0 && (
            <div className="border-t border-line pt-3">
              <p className="text-xs font-bold text-ink-soft">关联谣言</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {related.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/cases/${c.slug}`}
                    className="rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-ink transition hover:border-accent hover:text-accent-dark"
                  >
                    「{c.claim}」→
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
