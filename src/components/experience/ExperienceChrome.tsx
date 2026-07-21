"use client";

import { cn } from "@/lib/cn";

type MetricChipProps = {
  label: string;
  value: string;
  tone?: "violet" | "mint" | "coral" | "sky" | "gold";
};

export function MetricChip({ label, value, tone = "violet" }: MetricChipProps) {
  const tones = {
    violet: "bg-nn-hidden-soft text-nn-hidden ring-nn-hidden/15",
    mint: "bg-nn-signal-soft text-nn-activation ring-nn-activation/15",
    coral: "bg-nn-blame-soft text-nn-blame ring-nn-blame/15",
    sky: "bg-nn-input-soft text-nn-input ring-nn-input/15",
    gold: "bg-gold/10 text-gold ring-gold/15",
  };
  return (
    <div className={cn("rounded-xl px-3 py-2.5 ring-1", tones[tone])}>
      <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70">{label}</p>
      <p className="font-mono text-sm font-semibold">{value}</p>
    </div>
  );
}

type ControlDockProps = {
  children: React.ReactNode;
  className?: string;
};

export function ControlDock({ children, className }: ControlDockProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-2xl border border-border-subtle bg-bg-surface p-3 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

type ExperienceHintProps = {
  children: React.ReactNode;
  visible?: boolean;
};

/** Minimal floating hint — show, don't tell. */
export function ExperienceHint({ children, visible = true }: ExperienceHintProps) {
  if (!visible) return null;
  return (
    <p className="text-xs leading-relaxed text-ink-muted">{children}</p>
  );
}
