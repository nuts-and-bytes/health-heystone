"use client";

import { AUDIENCES } from "@/data/audiences";
import { game, useGame } from "@/lib/game";
import { sfx } from "@/lib/sfx";

export default function AudiencePicker({ compact = false }: { compact?: boolean }) {
  const g = useGame();
  return (
    <div className={`grid gap-2.5 ${compact ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2"}`}>
      {AUDIENCES.map((a) => {
        const active = g.audience === a.id;
        return (
          <button
            key={a.id}
            onClick={() => {
              sfx.tap();
              game.setAudience(active ? null : a.id);
            }}
            className={`cursor-pointer rounded-2xl border-[1.5px] p-3.5 text-left transition ${
              active
                ? "border-accent bg-accent-soft/60"
                : "border-line bg-white hover:border-ink/40"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{a.emoji}</span>
              <span className="font-bold text-ink">{a.label}</span>
            </div>
            <p className="mt-1 text-xs text-ink-soft">{a.tagline}</p>
          </button>
        );
      })}
    </div>
  );
}
