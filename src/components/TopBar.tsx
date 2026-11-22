"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { game, useGame } from "@/lib/game";
import { getAudience } from "@/data/audiences";

const NAV = [
  { href: "/court", label: "法庭", emoji: "⚖️" },
  { href: "/body", label: "身体地图", emoji: "🫀" },
  { href: "/advice", label: "建议卡", emoji: "🃏" },
  { href: "/podcasts", label: "播客", emoji: "🎧" },
  { href: "/smash", label: "粉碎机", emoji: "🔨" },
];

function Stat({ icon, value, color, label }: { icon: string; value: number; color: string; label: string }) {
  return (
    <span className="flex items-center gap-1 font-black tabular-nums" style={{ color }} aria-label={label} title={label}>
      <span className="text-lg">{icon}</span>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: -12, opacity: 0, scale: 1.4 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 12, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
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
    <header className="sticky top-0 z-40 border-b-[3px] border-ink bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2.5 sm:px-6">
        <Link href="/" className="font-display flex shrink-0 items-center gap-1.5 text-2xl leading-none">
          <span className="animate-wiggle inline-block">⚖️</span>
          <span>谣言法庭</span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {NAV.map((n) => {
            const active = path.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-xl border-2 px-2.5 py-1 text-sm font-bold transition ${
                  active ? "border-ink bg-yellow" : "border-transparent hover:border-ink hover:bg-white"
                }`}
              >
                {n.emoji} {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3 text-sm">
          {aud && (
            <button
              onClick={() => game.setAudience(null)}
              className="hidden rounded-full border-2 border-ink bg-white px-2 py-0.5 text-xs font-bold sm:inline-flex"
              title="切换身份"
            >
              {aud.emoji} {aud.label}
            </button>
          )}
          <Stat icon="🔥" value={g.streak} color="#ff8a00" label="连续天数" />
          <Stat icon="⚡" value={g.xp} color="var(--yellow-dark)" label="经验值" />
          <Stat icon="❤️" value={g.hearts} color="var(--red)" label="今日红心" />
          <button onClick={() => game.toggleMute()} className="text-lg" aria-label={g.muted ? "打开音效" : "关闭音效"}>
            {g.muted ? "🔇" : "🔊"}
          </button>
        </div>
      </div>
    </header>

      {/* mobile bottom nav（放在 header 外，避免 backdrop-filter 影响 fixed 定位） */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t-[3px] border-ink bg-white py-1.5 md:hidden">
        {NAV.map((n) => {
          const active = path.startsWith(n.href);
          return (
            <Link key={n.href} href={n.href} className={`flex flex-col items-center rounded-xl px-2 py-0.5 text-[11px] font-bold ${active ? "bg-yellow" : ""}`}>
              <span className="text-xl leading-tight">{n.emoji}</span>
              {n.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
