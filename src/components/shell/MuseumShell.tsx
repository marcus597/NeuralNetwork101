import type { ReactNode } from "react";
import "@/styles/network-exhibit-soft.css";

type MuseumHeaderProps = {
  emoji: string;
  title: string;
  subtitle: string;
};

export function MuseumPage({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="network-soft-bg" aria-hidden />
      <div className="network-soft page-container max-w-4xl pb-12">{children}</div>
    </>
  );
}

export function MuseumHeader({ emoji, title, subtitle }: MuseumHeaderProps) {
  return (
    <header className="mb-8 grid gap-4 border-b border-border-hairline pb-8 sm:mb-10 sm:grid-cols-[auto_1fr] sm:items-end sm:gap-6">
      <span
        className="flex h-14 w-14 items-center justify-center border border-border-hairline bg-bg-surface text-2xl"
        aria-hidden
      >
        {emoji}
      </span>
      <div>
        <p className="editorial-kicker mb-2">Bonus exhibit</p>
        <h1 className="font-display text-3xl uppercase leading-none tracking-[-0.03em] text-ink sm:text-4xl">
          {title}
        </h1>
        <p className="soft-page-sub mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
          {subtitle}
        </p>
      </div>
    </header>
  );
}
