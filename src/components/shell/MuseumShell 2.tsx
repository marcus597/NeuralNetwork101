import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function MuseumPage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("page-container mx-auto max-w-lg pb-12 pt-2 sm:pt-4", className)}>
      {children}
    </div>
  );
}

export function MuseumHeader({
  kicker,
  title,
  subtitle,
  emoji,
  meta,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  emoji?: string;
  meta?: string;
}) {
  return (
    <header className="mb-6 text-center sm:mb-8">
      {emoji && (
        <p className="text-5xl sm:text-6xl" aria-hidden>
          {emoji}
        </p>
      )}
      {kicker && <p className="museum-kicker mt-3">{kicker}</p>}
      <h1 className="mt-2 text-2xl font-bold leading-tight text-ink sm:text-3xl">{title}</h1>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-ink-muted">
          {subtitle}
        </p>
      )}
      {meta && <p className="mt-2 text-sm text-ink-subtle">{meta}</p>}
    </header>
  );
}

export function MuseumCard({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div className={cn("museum-card", padded && "p-5 sm:p-6", className)}>{children}</div>
  );
}

export function MuseumPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("museum-panel p-4 sm:p-5", className)}>{children}</div>;
}
