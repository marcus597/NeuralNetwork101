"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";

type ComicStarProps = {
  className?: string;
  size?: number;
  animated?: boolean;
  filled?: boolean;
};

/** Bold comic-book star collectible. */
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
      <polygon
        points="24,2 29,17 46,17 33,27 38,44 24,34 10,44 15,27 2,17 19,17"
        fill={filled ? "#fdcb6e" : "transparent"}
        stroke="#1a1a1a"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {filled && (
        <polygon
          points="24,8 27,18 38,18 29,24 32,35 24,29 16,35 19,24 10,18 21,18"
          fill="#ffe566"
          stroke="none"
        />
      )}
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
