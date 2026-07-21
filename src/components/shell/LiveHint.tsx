"use client";

import { motion, AnimatePresence } from "motion/react";
import { Lightbulb, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { easeOut } from "@/lib/motion/tokens";

type LiveHintProps = {
  message: string | null;
  tone?: "neutral" | "success" | "warning" | "discovery";
  className?: string;
};

const toneStyles = {
  neutral: {
    border: "border-border-subtle",
    bg: "bg-bg-surface",
    text: "text-ink-muted",
    icon: Lightbulb,
    iconColor: "text-ink-subtle",
  },
  success: {
    border: "border-nn-activation/25",
    bg: "bg-nn-signal-soft",
    text: "text-nn-activation",
    icon: CheckCircle2,
    iconColor: "text-nn-activation",
  },
  warning: {
    border: "border-gold/30",
    bg: "bg-gold/8",
    text: "text-gold",
    icon: AlertTriangle,
    iconColor: "text-gold",
  },
  discovery: {
    border: "border-discover/25",
    bg: "bg-discover-soft",
    text: "text-discover",
    icon: Sparkles,
    iconColor: "text-discover",
  },
};

export function LiveHint({
  message,
  tone = "neutral",
  className,
}: LiveHintProps) {
  const style = toneStyles[tone];
  const Icon = style.icon;

  return (
    <div
      className={cn("min-h-11", className)}
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={easeOut}
            className={cn(
              "flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-sm",
              style.border,
              style.bg,
              style.text,
            )}
          >
            <Icon
              className={cn("mt-0.5 h-4 w-4 shrink-0", style.iconColor)}
              strokeWidth={1.75}
              aria-hidden
            />
            <p>{message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
