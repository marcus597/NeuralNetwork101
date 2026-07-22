"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";

type ComicStarProps = {
  className?: string;
  size?: number;
  animated?: boolean;
  filled?: boolean;
};

/** Four-point editorial star mark. */
export function ComicStar({
  className,
  size = 48,
  animated = false,
  filled = true,
}: ComicStarProps) {
  const star = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <path
        d="M24 4 L28 20 L44 24 L28 28 L24 44 L20 28 L4 24 L20 20 Z"
        fill={filled ? "#111111" : "transparent"}
        stroke="#111111"
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />
    </svg>
  );

  if (!animated) return star;

  return (
    <motion.div
      animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.08, 1] }}
      transition={{ duration: 0.6, repeat: 3 }}
    >
      {star}
    </motion.div>
  );
}
