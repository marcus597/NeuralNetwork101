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
    border: "border-white/10",
    text: "text-ink-muted",
    icon: Lightbulb,
    iconColor: "text-ink-subtle",
  },
  success: {
    border: "border-mint/25",
    text: "text-mint",
    icon: CheckCircle2,
    iconColor: "text-mint",
  },
  warning: {
    border: "border-gold/25",
    text: "text-gold",
    icon: AlertTriangle,
    iconColor: "text-gold",
  },
  discovery: {
    border: "border-violet/30",
    text: "text-violet",
    icon: Sparkles,
    iconColor: "text-violet",
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
              "flex items-start gap-3 rounded-xl border bg-bg-elevated/50 px-4 py-3 text-sm leading-relaxed backdrop-blur-sm",
              style.border,
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
