"use client";

import { ComicStar } from "@/components/graphics/ComicStar";
import { cn } from "@/lib/cn";

type StarMeterProps = {
  collected: number;
  total: number;
  className?: string;
  compact?: boolean;
};

/** Visual star progress meter with custom graphics. */
export function StarMeter({ collected, total, className, compact }: StarMeterProps) {
  const pct = total > 0 ? (collected / total) * 100 : 0;

  return (
    <div className={cn("comic-panel px-5 py-4", className)}>
      <div className="flex items-center justify-center gap-3">
        <ComicStar size={compact ? 36 : 44} />
        <div className="text-left">
          <p className="font-display text-2xl uppercase leading-none text-ink">
            {collected} / {total}
          </p>
          {!compact && (
            <p className="text-sm font-bold text-ink-muted">stars collected</p>
          )}
        </div>
      </div>
      <div className="mt-3 h-4 overflow-hidden rounded-md border-2 border-border-subtle bg-bg-inset shadow-[inset_2px_2px_0_rgb(26_26_26_/_10%)]">
        <div
          className="h-full rounded-sm bg-gradient-to-r from-gold to-discover transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between gap-1" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <ComicStar
            key={i}
            size={16}
            filled={i < collected}
            className={cn(i < collected ? "opacity-100" : "opacity-30")}
          />
        ))}
      </div>
    </div>
  );
}
