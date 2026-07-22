"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { ComicFrame } from "@/components/ui/ComicFrame";

type GameBoardProps = {
  emoji?: string;
  title: string;
  hint?: string;
  children: ReactNode;
  screen?: number;
  totalScreens?: number;
  badge?: string;
  className?: string;
};

export function GameBoard({
  emoji,
  title,
  hint,
  children,
  screen = 0,
  totalScreens = 1,
  badge,
  className,
}: GameBoardProps) {
  return (
    <ComicFrame title={title} badge={badge} className={className}>
      {emoji && (
        <motion.div
          className="mb-4 flex justify-center"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          <span className="flex h-20 w-20 items-center justify-center border border-border-hairline bg-bg-muted text-5xl sm:h-24 sm:w-24 sm:text-6xl">
            {emoji}
          </span>
        </motion.div>
      )}
      {hint && (
        <p className="mb-4 text-center text-sm font-medium uppercase tracking-[0.06em] text-ink-muted">
          {hint}
        </p>
      )}
      <div>{children}</div>
      {totalScreens > 1 && (
        <div className="mt-6 flex justify-center gap-2" aria-hidden>
          {Array.from({ length: totalScreens }, (_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 w-6 transition-colors",
                i <= screen ? "bg-ink" : "bg-bg-inset",
              )}
            />
          ))}
        </div>
      )}
    </ComicFrame>
  );
}

export function GameButton({
  children,
  onClick,
  variant = "primary",
  className,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success";
  className?: string;
  disabled?: boolean;
}) {
  const styles = {
    primary:
      "bg-ink text-ink-inverse border border-ink hover:opacity-90",
    secondary:
      "bg-bg-surface text-ink border border-ink hover:bg-ink hover:text-ink-inverse",
    success:
      "bg-nn-activation text-white border border-nn-activation hover:opacity-90",
  };
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "focus-ring min-h-14 w-full rounded-full px-6 text-sm font-semibold uppercase tracking-[0.1em] transition-all disabled:opacity-40 sm:min-h-16 sm:text-base",
        styles[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}
