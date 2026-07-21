"use client";

import { cn } from "@/lib/cn";

type InteractiveSliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  hint?: string;
  accent?: "coral" | "mint" | "violet" | "sky" | "gold";
};

const accentMap = {
  coral: "accent-coral",
  mint: "accent-mint",
  violet: "accent-violet",
  sky: "accent-sky",
  gold: "accent-gold",
};

const fillMap = {
  coral: "bg-nn-blame/12",
  mint: "bg-nn-activation/12",
  violet: "bg-nn-hidden/12",
  sky: "bg-nn-input/12",
  gold: "bg-gold/12",
};

export function InteractiveSlider({
  label,
  value,
  min,
  max,
  step = 0.01,
  onChange,
  format = (v) => v.toFixed(2),
  hint,
  accent = "violet",
}: InteractiveSliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <label className="group block cursor-pointer">
      <div className="mb-2.5 flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="font-mono text-sm text-ink-muted tabular-nums transition-colors group-hover:text-ink">
          {format(value)}
        </span>
      </div>
      <div className="relative h-11 rounded-xl border border-border-subtle bg-bg-stage px-1.5 py-2 transition-shadow group-hover:shadow-sm">
        <div
          className={cn(
            "pointer-events-none absolute inset-y-2 left-1.5 rounded-lg transition-all duration-200 ease-out",
            fillMap[accent],
          )}
          style={{ width: `calc(${pct}% - 6px)` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            "wonder-range focus-ring absolute inset-0 h-full w-full cursor-ew-resize bg-transparent",
            accentMap[accent],
          )}
          aria-describedby={hint ? `${label}-hint` : undefined}
        />
      </div>
      {hint && (
        <p id={`${label}-hint`} className="mt-2 text-xs leading-relaxed text-ink-muted">
          {hint}
        </p>
      )}
    </label>
  );
}
