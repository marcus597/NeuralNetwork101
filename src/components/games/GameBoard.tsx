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
          <span className="flex h-20 w-20 items-center justify-center rounded-lg border-[3px] border-border-subtle bg-bg-muted text-5xl shadow-md sm:h-24 sm:w-24 sm:text-6xl">
            {emoji}
          </span>
        </motion.div>
      )}
      {hint && (
        <p className="mb-4 text-center text-base font-bold text-ink-muted">{hint}</p>
      )}
      <div>{children}</div>
      {totalScreens > 1 && (
        <div className="mt-6 flex justify-center gap-2" aria-hidden>
          {Array.from({ length: totalScreens }, (_, i) => (
            <span
              key={i}
              className={cn(
                "h-3 w-3 rounded-sm border-2 border-border-subtle transition-colors",
                i <= screen ? "bg-discover shadow-sm" : "bg-bg-inset",
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
    primary: "bg-discover text-on-accent border-[3px] border-border-subtle shadow-md hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-sm",
    secondary: "bg-bg-surface text-ink border-[3px] border-border-subtle shadow-md hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lg active:translate-x-0.5 active:translate-y-0.5",
    success: "bg-nn-activation text-white border-[3px] border-border-subtle shadow-md hover:-translate-x-0.5 hover:-translate-y-0.5",
  };
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "focus-ring min-h-14 w-full rounded-lg px-6 text-lg font-bold transition-all disabled:opacity-40 disabled:hover:translate-x-0 disabled:hover:translate-y-0 sm:min-h-16 sm:text-xl",
        styles[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}
