"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ComicFrameProps = {
  children: ReactNode;
  title?: string;
  badge?: string;
  className?: string;
};

/** Editorial frame for game boards. */
export function ComicFrame({ children, title, badge, className }: ComicFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden border border-border-hairline bg-bg-surface shadow-md",
        className,
      )}
    >
      <div className="relative border-b border-border-hairline bg-ink px-4 py-3">
        <div className="relative flex items-center justify-between gap-2">
          <p className="font-display text-sm uppercase tracking-[-0.01em] text-ink-inverse">
            {title ?? "Game on"}
          </p>
          {badge && (
            <span className="border border-white/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-inverse">
              {badge}
            </span>
          )}
        </div>
      </div>
      <div className="bg-bg-stage p-5 sm:p-7">{children}</div>
    </div>
  );
}
