import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type CalloutTone = "neutral" | "discovery" | "warning" | "success";

const toneStyles: Record<CalloutTone, string> = {
  neutral: "border-white/10 text-ink-muted",
  discovery: "border-violet/40 text-violet",
  warning: "border-gold/40 text-gold",
  success: "border-mint/40 text-mint",
};

type CalloutProps = {
  tone?: CalloutTone;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Callout({
  tone = "neutral",
  title,
  children,
  className,
}: CalloutProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-bg-elevated/60 px-4 py-3 text-sm",
        toneStyles[tone],
        className,
      )}
    >
      {title && <p className="mb-1 font-semibold text-ink">{title}</p>}
      <div>{children}</div>
    </div>
  );
}
