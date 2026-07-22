import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type CalloutTone = "neutral" | "discovery" | "warning" | "success";

const toneStyles: Record<CalloutTone, string> = {
  neutral: "border-border-hairline text-ink-muted",
  discovery: "border-ink text-ink",
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
        "border bg-bg-elevated px-4 py-3 text-sm font-medium",
        toneStyles[tone],
        className,
      )}
    >
      {title && (
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink">
          {title}
        </p>
      )}
      <div>{children}</div>
    </div>
  );
}
