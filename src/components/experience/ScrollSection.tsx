import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ScrollSectionProps = {
  step: number;
  title: string;
  children: ReactNode;
  className?: string;
  id?: string;
};

export function ScrollSection({
  step,
  title,
  children,
  className,
  id,
}: ScrollSectionProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 border-b border-border-subtle py-12 sm:py-16", className)}
      aria-labelledby={`section-${step}-title`}
    >
      <div className="mb-6 flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-discover text-base font-bold text-on-accent"
          aria-hidden
        >
          {step}
        </span>
        <h2
          id={`section-${step}-title`}
          className="text-xl font-semibold tracking-tight text-ink sm:text-2xl"
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
