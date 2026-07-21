"use client";

import { cn } from "@/lib/cn";

/** Floating comic decorations for page backgrounds. */
export function ComicBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <FloatingShape className="left-[4%] top-[12%] text-discover/20" delay={0}>
        <StarShape />
      </FloatingShape>
      <FloatingShape className="right-[6%] top-[18%] text-sky/25" delay={1.2}>
        <BoltShape />
      </FloatingShape>
      <FloatingShape className="bottom-[20%] left-[8%] text-violet/20" delay={0.6}>
        <CircleCluster />
      </FloatingShape>
      <FloatingShape className="bottom-[28%] right-[5%] text-gold/25" delay={1.8}>
        <StarShape />
      </FloatingShape>
      <FloatingShape className="right-[12%] top-[45%] text-mint/20" delay={2.4}>
        <ZapBurst />
      </FloatingShape>
    </div>
  );
}

function FloatingShape({
  children,
  className,
  delay,
}: {
  children: React.ReactNode;
  className?: string;
  delay: number;
}) {
  return (
    <div
      className={cn("absolute animate-comic-float", className)}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

function StarShape() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor">
      <polygon points="24,2 29,17 46,17 33,27 38,44 24,34 10,44 15,27 2,17 19,17" />
    </svg>
  );
}

function BoltShape() {
  return (
    <svg width="36" height="52" viewBox="0 0 36 52" fill="currentColor">
      <polygon points="20,0 4,28 14,28 8,52 32,20 20,20 28,0" />
    </svg>
  );
}

function CircleCluster() {
  return (
    <svg width="56" height="40" viewBox="0 0 56 40" fill="currentColor">
      <circle cx="12" cy="20" r="10" />
      <circle cx="28" cy="12" r="8" />
      <circle cx="44" cy="22" r="9" />
    </svg>
  );
}

function ZapBurst() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor">
      <polygon points="20,2 24,14 38,14 27,22 31,38 20,29 9,38 13,22 2,14 16,14" />
    </svg>
  );
}
