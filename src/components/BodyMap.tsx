"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { CASES, BODY_PARTS, VERDICT_META, type BodyPart } from "@/data/cases";
import { BODY_ROLES, getBodyRole } from "@/data/body-pedia";
import { useGame } from "@/lib/game";
import { sfx } from "@/lib/sfx";
import StickScene from "./StickScene";
import MuscleAtlas from "./MuscleAtlas";
import { RoleIcon } from "./Icons";
import { RichText } from "./Term";

/* eslint-disable @next/next/no-img-element */

const SPOTS: { id: BodyPart; x: number; y: number }[] = [
  { id: "brain", x: 160, y: 62 },
  { id: "heart", x: 140, y: 175 },
  { id: "arm", x: 252, y: 190 },
  { id: "stomach", x: 160, y: 245 },
  { id: "spine", x: 186, y: 300 },
  { id: "knee", x: 122, y: 405 },
  { id: "feet", x: 205, y: 495 },
];

const INK = "#1c1917";

export default function BodyMap() {
  const sp = useSearchParams();
  const initialTab =
    sp.get("tab") === "roles" || sp.get("role")
      ? "roles"
      : sp.get("tab") === "map"
        ? "map"
        : "muscles";
  const [tab, setTab] = useState<"muscles" | "roles" | "map">(initialTab);
  const [sel, setSel] = useState<BodyPart>("knee");
  const [roleSlug, setRoleSlug] = useState<string>(sp.get("role") || BODY_ROLES[0].slug);

  useEffect(() => {
    const r = sp.get("role");
    if (r && getBodyRole(r)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTab("roles");
      setRoleSlug(r);
    } else if (sp.get("tab") === "roles") {
      setTab("roles");
    } else if (sp.get("tab") === "map") {
      setTab("map");
    }
  }, [sp]);

  const g = useGame();
  const cases = CASES.filter((c) => c.body === sel);
  const part = BODY_PARTS[sel];
  const partRoles = BODY_ROLES.filter((r) => r.part === sel);
  const activeRole = getBodyRole(roleSlug) ?? BODY_ROLES[0];
  const roleCases = CASES.filter((c) => activeRole.relatedCases.includes(c.slug));

  const tabBtn = (active: boolean) =>
    `cursor-pointer rounded-xl border-2 px-4 py-2 text-sm font-bold transition ${
      active ? "border-ink bg-accent-soft text-accent-dark" : "border-line bg-white text-ink-soft hover:border-ink hover:text-ink"
    }`;

  return (
    <div className="space-y-6">
      {/* 三个清晰分工的视图：真图认肌肉 / 真图+小人动画认器官激素 / 按部位查谣言（零 emoji） */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            sfx.tap();
            setTab("muscles");
          }}
          className={tabBtn(tab === "muscles")}
        >
          真实肌群图谱（12 块）
        </button>
        <button
          onClick={() => {
            sfx.tap();
            setTab("roles");
          }}
          className={tabBtn(tab === "roles")}
        >
          器官与激素图鉴（12 个）
        </button>
        <button
          onClick={() => {
            sfx.tap();
            setTab("map");
          }}
          className={tabBtn(tab === "map")}
        >
          按身体部位查谣言
        </button>
      </div>

      {tab === "muscles" ? (
        <MuscleAtlas />
      ) : tab === "roles" ? (
        /* 器官与激素图鉴：统一细线 SVG 图标，绝不使用系统 emoji；真图看结构 + 小人看过程 */
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {BODY_ROLES.map((r) => {
              const active = r.slug === activeRole.slug;
              return (
                <button
                  key={r.slug}
                  onClick={() => {
                    sfx.tap();
                    setRoleSlug(r.slug);
                  }}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] px-3.5 py-1.5 text-sm font-bold transition ${
                    active
                      ? "border-ink bg-ink text-white"
                      : "border-line bg-white text-ink hover:border-ink"
                  }`}
                >
                  <RoleIcon slug={r.slug} width={15} height={15} className={active ? "text-accent" : "text-ink-soft"} />
                  <span>{r.name}</span>
                </button>
              );
            })}
          </div>

          <article className="space-y-6">
            <header>
              <p className="text-xs font-bold text-accent-dark">
                {BODY_PARTS[activeRole.part].label} · {activeRole.en}
              </p>
              <h2 className="font-display mt-1 flex flex-wrap items-baseline gap-2 text-3xl text-ink sm:text-4xl">
                <span>{activeRole.name}</span>
                <span className="text-xl text-accent-dark">「{activeRole.nickname}」</span>
              </h2>
              <p className="mt-1.5 text-[15.5px] text-ink-soft">{activeRole.oneLine}</p>
            </header>

            {/* 图说清楚：左/上真实解剖图（长在哪、长什么样）+ 右/下小人动画（怎么干活/前后对比） */}
            <div className="grid gap-5 md:grid-cols-2">
              <figure className="overflow-hidden rounded-2xl border-[1.5px] border-line bg-white">
                <div className="border-b border-line/70 px-4 py-2 text-xs font-bold text-ink">
                  ① 真实结构与位置
                </div>
                <div className="flex aspect-[4/3] items-center justify-center bg-cream p-2">
                  <img
                    src={activeRole.anatomyImg}
                    alt={`${activeRole.name}真实解剖结构图`}
                    className="max-h-full max-w-full rounded-lg object-contain"
                  />
                </div>
                <figcaption className="border-t border-line/70 px-4 py-2.5 text-xs text-ink-soft">
                  {activeRole.anatomyCaption}
                </figcaption>
              </figure>

              <div className="flex flex-col">
                <div className="rounded-t-2xl border-[1.5px] border-b-0 border-line bg-white px-4 py-2 text-xs font-bold text-accent-dark">
                  ② 机制与效果演示（点击可重播）
                </div>
                <div className="[&>figure]:my-0 [&>figure]:rounded-t-none">
                  <StickScene scene={activeRole.scene} caption={activeRole.sceneCaption} play="view" height={235} />
                </div>
              </div>
            </div>

            {/* 少字高密度：三块直白结论 */}
            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-line bg-white p-4">
                <p className="text-xs font-bold text-ink">核心工作</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  <RichText text={activeRole.whatItDoes[0]} />
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-white p-4">
                <p className="text-xs font-bold text-red-dark">常见误解</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{activeRole.commonMyth}</p>
              </div>
              <div className="rounded-2xl border border-line bg-white p-4">
                <p className="text-xs font-bold text-green-dark">日常怎么帮它</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{activeRole.howToHelp}</p>
              </div>
            </section>

            <section className="border-t border-line pt-5">
              <h3 className="font-display text-xl text-ink">关联谣言案件</h3>
              <ul className="mt-2 divide-y divide-line">
                {roleCases.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/cases/${c.slug}`} className="group flex items-center justify-between py-3 text-sm transition hover:text-accent-dark">
                      <span className="font-medium text-ink group-hover:text-accent-dark">「{c.claim}」</span>
                      <span className="text-xs text-ink-soft">去审 →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </article>
        </div>
      ) : (
        /* 按部位点身体地图 */
        <div className="grid gap-8 md:grid-cols-[minmax(0,330px)_1fr]">
          <div className="panel mx-auto w-full max-w-[330px] bg-white p-4">
            <svg viewBox="0 0 320 540" className="w-full" role="img" aria-label="可点击的人体地图">
              <g stroke={INK} strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round">
                <path d="M118 340 L108 470 Q106 492 128 494 L140 494 L150 350 Z" fill="#dbeafe" />
                <path d="M202 340 L212 470 Q214 492 192 494 L180 494 L170 350 Z" fill="#dbeafe" />
                <path d="M100 488 Q100 512 132 512 L150 512 Q156 500 144 490 Z" fill="#f97316" />
                <path d="M220 488 Q220 512 188 512 L170 512 Q164 500 176 490 Z" fill="#f97316" />
                <path d="M92 150 Q52 200 62 270 Q66 284 80 280 Q90 230 112 190 Z" fill="#fed7aa" />
                <path d="M228 150 Q272 168 280 222 Q284 238 270 240 Q258 205 220 190 Z" fill="#fed7aa" />
                <path d="M96 140 Q160 118 224 140 L218 350 Q160 366 102 350 Z" fill="#fef3c7" />
                <rect x="145" y="105" width="30" height="26" rx="10" fill="#fed7aa" />
                <circle cx="160" cy="68" r="52" fill="#fed7aa" />
                <path d="M110 58 Q118 14 160 16 Q206 16 212 60 Q190 40 160 44 Q130 40 110 58 Z" fill={INK} />
                <circle cx="142" cy="74" r="4.5" fill={INK} stroke="none" />
                <circle cx="178" cy="74" r="4.5" fill={INK} stroke="none" />
                <path d="M146 94 Q160 104 174 94" fill="none" />
              </g>

              {SPOTS.map((s, idx) => {
                const active = s.id === sel;
                return (
                  <g
                    key={s.id}
                    className="cursor-pointer outline-none"
                    onClick={() => {
                      sfx.tap();
                      setSel(s.id);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={BODY_PARTS[s.id].label}
                    onFocus={() => setSel(s.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setSel(s.id);
                    }}
                  >
                    <circle
                      cx={s.x}
                      cy={s.y}
                      r="15"
                      fill={active ? "#f97316" : "#fff"}
                      className="pulse-ring"
                      style={{ transformOrigin: `${s.x}px ${s.y}px`, transformBox: "view-box" }}
                      opacity=".55"
                    />
                    <circle cx={s.x} cy={s.y} r="15" fill={active ? "#f97316" : "#fff"} stroke={INK} strokeWidth="3" />
                    <text x={s.x} y={s.y + 5} textAnchor="middle" fontSize="13" fontWeight="800" fill={active ? "#fff" : INK}>
                      {idx + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
            <p className="text-center text-xs font-medium text-ink-soft">点数字圆点，查看该部位的角色与谣言</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={sel}
              initial={{ x: 14, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -14, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-display text-3xl text-ink">{part.label}</h2>
                <p className="mt-1 text-sm text-ink-soft">{part.blurb}</p>
              </div>

              {partRoles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-accent-dark">这里的器官与角色</p>
                  {partRoles.map((r) => (
                    <button
                      key={r.slug}
                      onClick={() => {
                        sfx.tap();
                        setRoleSlug(r.slug);
                        setTab("roles");
                      }}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-line bg-white p-3.5 text-left transition hover:border-accent"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-dark">
                        <RoleIcon slug={r.slug} width={20} height={20} />
                      </span>
                      <span className="flex-1">
                        <span className="block font-bold text-ink">
                          {r.name} · <span className="text-accent-dark">{r.nickname}</span>
                        </span>
                        <span className="block text-xs text-ink-soft">{r.oneLine}</span>
                      </span>
                      <span className="shrink-0 text-xs font-bold text-accent-dark">看图解 →</span>
                    </button>
                  ))}
                </div>
              )}

              <div>
                <p className="text-xs font-bold text-ink-soft">和这里有关的谣言案件</p>
                <ul className="mt-2 divide-y divide-line border-t border-line">
                  {cases.map((c) => {
                    const ans = c.slug in g.answered;
                    const m = VERDICT_META[c.verdict];
                    return (
                      <li key={c.slug}>
                        <Link href={`/cases/${c.slug}`} className="group flex items-center justify-between gap-3 py-3 transition hover:text-accent-dark">
                          <span className="min-w-0 flex-1">
                            <span className="block font-bold text-ink group-hover:text-accent-dark">「{c.claim}」</span>
                            <span className="block text-xs text-ink-soft">{c.hook}</span>
                          </span>
                          {ans ? (
                            <span className="shrink-0 rounded-lg border px-2 py-0.5 text-xs font-bold" style={{ color: m.dark, borderColor: m.color }}>
                              {m.label}
                            </span>
                          ) : (
                            <span className="shrink-0 text-xs text-ink-soft">去审 →</span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
