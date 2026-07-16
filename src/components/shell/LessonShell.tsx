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
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet">
        {kicker}
      </p>
      <h1 className="mb-8 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {title}
      </h1>

      <div className="space-y-6">{children}</div>

      <nav
        aria-label="Lesson navigation"
        className="mt-12 flex items-center justify-between gap-4 border-t border-white/8 pt-8"
      >
        {prev ? (
          <Link
            href={prev.href}
            className={cn(
              "focus-ring group inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm text-ink-muted transition-colors hover:border-white/16 hover:text-ink active:scale-[0.98]",
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
              "focus-ring group inline-flex min-h-11 items-center gap-2 rounded-full bg-violet/15 px-4 py-2.5 text-sm font-medium text-violet ring-1 ring-violet/20 transition-all hover:bg-violet/25 hover:ring-violet/30 active:scale-[0.98]",
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
