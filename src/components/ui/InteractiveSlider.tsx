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
      <div className="relative h-11 rounded-xl bg-bg-inset/80 px-1.5 py-2 ring-1 ring-white/5 transition-colors group-hover:ring-white/8">
        <div
          className="pointer-events-none absolute inset-y-2 left-1.5 rounded-lg bg-white/6 transition-all duration-150 ease-out"
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
