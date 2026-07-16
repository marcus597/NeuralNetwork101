"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/cn";
import { easeOut } from "@/lib/motion/tokens";

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom";
  delayMs?: number;
  className?: string;
};

export function Tooltip({
  content,
  children,
  side = "top",
  delayMs = 400,
  className,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();

  const show = () => {
    timeout.current = setTimeout(() => setOpen(true), delayMs);
  };

  const hide = () => {
    if (timeout.current) clearTimeout(timeout.current);
    setOpen(false);
  };

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <span aria-describedby={open ? id : undefined}>{children}</span>
      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: side === "top" ? 4 : -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: side === "top" ? 4 : -4, scale: 0.96 }}
            transition={easeOut}
            className={cn(
              "pointer-events-none absolute z-50 max-w-[220px] rounded-lg border border-white/10 bg-bg-elevated px-3 py-2 text-xs leading-relaxed text-ink-muted shadow-xl",
              side === "top" && "bottom-full left-1/2 mb-2 -translate-x-1/2",
              side === "bottom" && "top-full left-1/2 mt-2 -translate-x-1/2",
            )}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
