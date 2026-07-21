"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ComicFrameProps = {
  children: ReactNode;
  title?: string;
  badge?: string;
  className?: string;
};

/** Arcade-cabinet style frame for game boards. */
export function ComicFrame({ children, title, badge, className }: ComicFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border-[3px] border-border-subtle bg-bg-surface shadow-md",
        className,
      )}
    >
      <div className="relative border-b-[3px] border-border-subtle bg-gradient-to-r from-discover via-[#ff6b81] to-violet px-4 py-2.5">
        <div className="absolute inset-0 opacity-30" aria-hidden>
          <svg className="h-full w-full" preserveAspectRatio="none">
            <pattern id="frame-dots" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="4" r="1" fill="#fff" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#frame-dots)" />
          </svg>
        </div>
        <div className="relative flex items-center justify-between gap-2">
          <p className="font-display text-sm uppercase tracking-wider text-white drop-shadow-[1px_1px_0_#1a1a1a]">
            {title ?? "Game on!"}
          </p>
          {badge && (
            <span className="rounded-md border-2 border-border-subtle bg-bg-surface px-2 py-0.5 text-xs font-bold text-ink shadow-sm">
              {badge}
            </span>
          )}
        </div>
        {/* Cabinet lights */}
        <div className="relative mt-2 flex gap-1.5" aria-hidden>
          {["#fdcb6e", "#00b894", "#0984e3", "#ff4757"].map((c) => (
            <span
              key={c}
              className="h-2 w-2 rounded-full border border-border-subtle shadow-sm"
              style={{ background: c }}
            />
          ))}
        </div>
      </div>
      <div className="bg-gradient-to-b from-bg-stage to-bg-surface p-5 sm:p-7">{children}</div>
    </div>
  );
}
