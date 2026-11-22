"use client";

import { motion } from "motion/react";
import { VERDICT_META, type Verdict } from "@/data/cases";

export default function Stamp({ verdict, big = false, delay = 0 }: { verdict: Verdict; big?: boolean; delay?: number }) {
  const m = VERDICT_META[verdict];
  return (
    <motion.span
      className="stamp"
      style={{ color: m.dark, fontSize: big ? "2.6rem" : "1.3rem", padding: big ? "0.4rem 1.4rem" : undefined }}
      initial={{ scale: 3, opacity: 0, rotate: -30 }}
      animate={{ scale: 1, opacity: 1, rotate: -8 }}
      transition={{ type: "spring", stiffness: 520, damping: 16, delay }}
    >
      {m.emoji} {m.label}
    </motion.span>
  );
}
