"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { game, useGame } from "@/lib/game";
import { getAudience } from "@/data/audiences";
import {
  BrandMark,
  IconBody,
  IconBolt,
  IconEvidence,
  IconFlame,
  IconHeart,
  IconPodcast,
  IconSmash,
  IconVolume,
} from "./Icons";

const NAV = [
  { href: "/", label: "纠结决策", Icon: IconSmash, exact: true },
  { href: "/body", label: "身体解剖", Icon: IconBody, exact: false },
  { href: "/podcasts", label: "播客精读", Icon: IconPodcast, exact: false },
  { href: "/principles", label: "内容红线", Icon: IconEvidence, exact: false },
];

const MOBILE_NAV = [
  { href: "/", label: "纠结决策", Icon: IconSmash, exact: true },
  { href: "/body", label: "身体解剖", Icon: IconBody, exact: false },
  { href: "/podcasts", label: "播客精读", Icon: IconPodcast, exact: false },
  { href: "/principles", label: "内容红线", Icon: IconEvidence, exact: false },
];

function Stat({
  Icon,
  value,
  color,
  fill,
  label,
}: {
  Icon: typeof IconFlame;
  value: number;
  color: string;
  fill?: string;
  label: string;
}) {
  return (
    <span className="flex items-center gap-1 font-extrabold tabular-nums" style={{ color }} aria-label={label} title={label}>
      <Icon width={16} height={16} fill={fill ?? "none"} />
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: -10, opacity: 0, scale: 1.25 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ type: "spring", stiffness: 480, damping: 22 }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function TopBar() {
  const g = useGame();
  const path = usePathname();
  const aud = getAudience(g.audience);

  return (
    <>
      <header className="sticky top-0 z-40 border-b-[2.5px] border-ink bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2.5 sm:px-6 lg:gap-4">
          <Link href="/" className="group flex shrink-0 items-center gap-2 whitespace-nowrap text-ink">
            <BrandMark className="transition-transform group-hover:-rotate-6" />
            <span className="font-display text-xl leading-none lg:text-2xl">懂点健康</span>
          </Link>

          <nav className="ml-2 hidden items-center gap-1 md:flex lg:ml-4 lg:gap-1.5">
            {NAV.map(({ href, label, Icon, exact }) => {
              const active = exact ? path === "/" : path.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border-2 px-2.5 py-1 text-xs font-bold transition lg:px-3 lg:text-sm ${
                    active
                      ? "border-ink bg-accent-soft text-accent-dark"
                      : "border-transparent text-ink-soft hover:border-ink/20 hover:bg-white hover:text-ink"
                  }`}
                >
                  <Icon width={15} height={15} className="shrink-0" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2.5 whitespace-nowrap text-sm lg:gap-3">
            {aud && (
              <button
                onClick={() => game.setAudience(null)}
                className="hidden cursor-pointer whitespace-nowrap rounded-full border-2 border-ink bg-white px-2.5 py-0.5 text-xs font-bold text-ink transition hover:bg-accent-soft lg:inline-flex"
                title="切换身份"
              >
                {aud.label}
              </button>
            )}
            <Stat Icon={IconFlame} value={g.streak} color="#f97316" fill="#fed7aa" label="连续天数" />
            <Stat Icon={IconBolt} value={g.xp} color="#d97706" fill="#fde68a" label="经验值" />
            <Stat Icon={IconHeart} value={g.hearts} color="var(--red)" fill="#fecaca" label="今日红心" />
            <button
              onClick={() => game.toggleMute()}
              className="cursor-pointer rounded-lg p-1 text-ink-soft transition hover:bg-white hover:text-ink"
              aria-label={g.muted ? "打开音效" : "关闭音效"}
            >
              <IconVolume muted={g.muted} width={17} height={17} />
            </button>
          </div>
        </div>
      </header>

      {/* mobile bottom nav：统一手绘线条图标，去 emoji 廉价感 */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t-[2.5px] border-ink bg-white py-1.5 md:hidden">
        {MOBILE_NAV.map(({ href, label, Icon, exact }) => {
          const active = exact ? path === "/" : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 text-[11px] font-bold transition ${
                active ? "bg-accent-soft text-accent-dark" : "text-ink-soft hover:text-ink"
              }`}
            >
              <Icon width={19} height={19} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
