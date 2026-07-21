"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import type { SimSnapshot } from "@/engines/interaction/types";
import { useLabSnapshot } from "@/lib/nn/useLabSnapshot";
import { ComicStar } from "@/components/graphics/ComicStar";

export function useGameSnapshot(
  presetId: string,
  flags: Record<string, boolean>,
  metrics: Record<string, number> = {},
): SimSnapshot {
  const snapshot = useMemo(
    () => ({ presetId, params: {}, metrics, flags }),
    [presetId, flags, metrics],
  );
  useLabSnapshot(snapshot);
  return snapshot;
}

type StarRewardProps = {
  show: boolean;
  label?: string;
};

export function StarReward({ show, label = "You earned a star!" }: StarRewardProps) {
  if (!show) return null;
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="comic-panel flex flex-col items-center gap-3 px-6 py-6 text-center"
    >
      <ComicStar size={56} animated />
      <p className="font-display text-xl uppercase text-ink">{label}</p>
      <motion.div
        className="flex gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        aria-hidden
      >
        {["POW!", "⭐", "NICE!"].map((word, i) => (
          <span
            key={i}
            className="rounded-md border-2 border-border-subtle bg-gold/30 px-2 py-0.5 text-[10px] font-bold text-ink shadow-sm"
          >
            {word}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}
