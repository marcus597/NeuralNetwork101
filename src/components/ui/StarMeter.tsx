"use client";

import { ComicStar } from "@/components/graphics/ComicStar";
import { cn } from "@/lib/cn";

type StarMeterProps = {
  collected: number;
  total: number;
  className?: string;
  compact?: boolean;
};

/** Editorial star progress meter. */
export function StarMeter({ collected, total, className, compact }: StarMeterProps) {
  const pct = total > 0 ? (collected / total) * 100 : 0;

  return (
    <div className={cn("border border-border-hairline bg-bg-surface px-5 py-4", className)}>
      <div className="flex items-center gap-4">
        <ComicStar size={compact ? 28 : 36} />
        <div className="text-left">
          <p className="font-display text-2xl uppercase leading-none tracking-[-0.02em] text-ink">
            {collected} / {total}
          </p>
          {!compact && (
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
              stars collected
            </p>
          )}
        </div>
      </div>
      <div className="mt-4 h-1 overflow-hidden bg-bg-inset">
        <div
          className="h-full bg-ink transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-3 flex justify-between gap-1" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <ComicStar
            key={i}
            size={14}
            filled={i < collected}
            className={cn(i < collected ? "opacity-100" : "opacity-25")}
          />
        ))}
      </div>
    </div>
  );
}
