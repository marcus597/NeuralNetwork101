import { cn } from "@/lib/cn";

type MetricPillProps = {
  label: string;
  value: string;
  tone?: "mint" | "danger" | "gold" | "neutral";
  className?: string;
};

const toneClass = {
  mint: "text-mint",
  danger: "text-danger",
  gold: "text-gold",
  neutral: "text-ink",
};

export function MetricPill({
  label,
  value,
  tone = "neutral",
  className,
}: MetricPillProps) {
  return (
    <div
      className={cn(
        "rounded-full border border-white/8 bg-bg-deep/75 px-3 py-1.5 text-xs backdrop-blur-md",
        className,
      )}
    >
      <span className="text-ink-muted">{label} </span>
      <span className={cn("font-mono tabular-nums font-medium", toneClass[tone])}>
        {value}
      </span>
    </div>
  );
}
