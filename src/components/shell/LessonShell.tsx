import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

type LessonShellProps = {
  title: string;
  kicker: string;
  children: ReactNode;
  prev?: { href: string; label: string };
  next?: { href: string; label: string };
};

export function LessonShell({
  title,
  kicker,
  children,
  prev,
  next,
}: LessonShellProps) {
  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <p className="editorial-kicker mb-3">{kicker}</p>
      <h1 className="font-display mb-8 max-w-[18ch] text-3xl uppercase leading-none tracking-[-0.03em] text-ink sm:text-4xl">
        {title}
      </h1>

      <div className="space-y-6">{children}</div>

      <nav
        aria-label="Lesson navigation"
        className="mt-12 flex items-center justify-between gap-4 border-t border-border-hairline pt-8"
      >
        {prev ? (
          <Link
            href={prev.href}
            className={cn(
              "focus-ring group inline-flex min-h-11 items-center gap-2 border border-border-hairline bg-bg-surface px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted transition-colors hover:border-ink hover:text-ink",
            )}
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
              strokeWidth={1.75}
              aria-hidden
            />
            {prev.label}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={next.href}
            className={cn(
              "focus-ring group inline-flex min-h-11 items-center gap-2 bg-ink px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-inverse transition-opacity hover:opacity-85",
            )}
          >
            {next.label}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              strokeWidth={1.75}
              aria-hidden
            />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
