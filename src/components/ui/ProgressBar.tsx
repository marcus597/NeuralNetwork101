import { cn } from "@/lib/cn";

type ProgressBarProps = {
  value: number;
  max?: number;
  label?: string;
  tone?: "violet" | "mint" | "gold";
  className?: string;
};

const fillTone = {
  violet: "bg-violet shadow-[0_0_12px_rgb(139_124_255/35%)]",
  mint: "bg-mint shadow-[0_0_12px_rgb(61_255_181/30%)]",
  gold: "bg-gold shadow-[0_0_12px_rgb(255_209_102/30%)]",
};

export function ProgressBar({
  value,
  max = 100,
  label,
  tone = "violet",
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="mb-2.5 flex justify-between text-xs text-ink-muted">
          <span>{label}</span>
          <span className="font-mono tabular-nums">
            {value}/{max}
          </span>
        </div>
      )}
      <div
        className="h-2 overflow-hidden rounded-full bg-bg-inset ring-1 ring-white/6"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            fillTone[tone],
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
