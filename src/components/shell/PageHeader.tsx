import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type PageHeaderProps = {
  title: string;
  description?: string;
  kicker?: string;
  className?: string;
  children?: ReactNode;
};

export function PageHeader({
  title,
  description,
  kicker,
  className,
  children,
}: PageHeaderProps) {
  return (
    <header className={cn("mb-8 sm:mb-10", className)}>
      {kicker && (
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet">
          {kicker}
        </p>
      )}
      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-muted">
          {description}
        </p>
      )}
      {children}
    </header>
  );
}
