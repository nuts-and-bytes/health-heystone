"use client";

import { motion } from "motion/react";
import { AUDIENCES } from "@/data/audiences";
import { game } from "@/lib/game";
import { sfx } from "@/lib/sfx";

export default function AudiencePicker({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`grid gap-4 ${compact ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2"}`}>
      {AUDIENCES.map((a, i) => (
        <motion.button
          key={a.id}
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.07, type: "spring", stiffness: 300, damping: 20 }}
          whileHover={{ y: -4, rotate: i % 2 ? 1.5 : -1.5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            sfx.correct();
            game.setAudience(a.id);
          }}
          className="panel flex flex-col items-start p-4 text-left"
          style={{ background: `color-mix(in srgb, ${a.color} 22%, white)` }}
        >
          <span className="text-4xl">{a.emoji}</span>
          <span className="font-display mt-2 text-2xl">{a.label}</span>
          <span className="text-sm text-ink-soft">{a.tagline}</span>
        </motion.button>
      ))}
    </div>
  );
}
