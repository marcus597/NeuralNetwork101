import { cn } from "@/lib/cn";

type AchievementBadgeProps = {
  label: string;
  earned?: boolean;
  className?: string;
};

export function AchievementBadge({
  label,
  earned = false,
  className,
}: AchievementBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium",
        earned
          ? "border-mint/40 bg-mint/10 text-mint"
          : "border-white/10 bg-white/5 text-ink-muted",
        className,
      )}
    >
      <span aria-hidden>{earned ? "✦" : "○"}</span>
      {label}
    </span>
  );
}
