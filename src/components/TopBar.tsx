"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { game, useGame } from "@/lib/game";
import { getAudience } from "@/data/audiences";

const NAV = [
  { href: "/court", label: "法庭", emoji: "⚖️" },
  { href: "/cases", label: "档案", emoji: "📚" },
  { href: "/body", label: "身体地图", emoji: "🫀" },
  { href: "/guide", label: "怎么看证据", emoji: "🔎" },
  { href: "/podcasts", label: "播客", emoji: "🎧" },
  { href: "/smash", label: "粉碎机", emoji: "🔨" },
];

const MOBILE_NAV = [
  { href: "/court", label: "法庭", emoji: "⚖️" },
  { href: "/cases", label: "档案", emoji: "📚" },
  { href: "/body", label: "身体", emoji: "🫀" },
  { href: "/guide", label: "证据", emoji: "🔎" },
  { href: "/smash", label: "粉碎机", emoji: "🔨" },
];

function Stat({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <span className="flex items-center gap-1 text-xs font-bold tabular-nums text-ink-soft" aria-label={label} title={label}>
      <span className="text-sm">{icon}</span>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 450, damping: 24 }}
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
      <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-2 px-4 py-2.5 sm:px-6">
          <Link href="/" className="font-display flex shrink-0 items-center gap-1.5 text-xl leading-none text-ink">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" aria-hidden />
            <span>健康谣言法庭</span>
          </Link>

          <nav className="ml-3 hidden items-center gap-1 md:flex">
            {NAV.map((n) => {
              const active = path.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`rounded-lg px-2.5 py-1 text-sm font-medium transition ${
                    active ? "bg-accent-soft font-bold text-accent-dark" : "text-ink-soft hover:bg-white hover:text-ink"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2.5">
            {aud && (
              <button
                onClick={() => game.setAudience(null)}
                className="hidden cursor-pointer rounded-full border border-line bg-white px-2.5 py-0.5 text-xs font-medium text-ink-soft transition hover:border-ink hover:text-ink sm:inline-flex"
                title="点一下切换身份"
              >
                {aud.emoji} {aud.label}
              </button>
            )}
            <Stat icon="🔥" value={g.streak} label="连续天数" />
            <Stat icon="⚡" value={g.xp} label="经验值" />
            <Stat icon="❤️" value={g.hearts} label="今日红心" />
            <button onClick={() => game.toggleMute()} className="cursor-pointer text-sm opacity-70 hover:opacity-100" aria-label={g.muted ? "打开音效" : "关闭音效"}>
              {g.muted ? "🔇" : "🔊"}
            </button>
          </div>
        </div>
      </header>

      {/* mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-line bg-white/95 py-1.5 backdrop-blur md:hidden">
        {MOBILE_NAV.map((n) => {
          const active = path.startsWith(n.href);
          return (
            <Link key={n.href} href={n.href} className={`flex flex-col items-center rounded-lg px-2.5 py-0.5 text-[11px] font-medium ${active ? "text-accent-dark font-bold" : "text-ink-soft"}`}>
              <span className="text-lg leading-tight">{n.emoji}</span>
              {n.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
