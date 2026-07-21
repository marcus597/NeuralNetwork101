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
      <div className="network-soft page-container max-w-3xl pb-12">{children}</div>
    </>
  );
}

export function MuseumHeader({ emoji, title, subtitle }: MuseumHeaderProps) {
  return (
    <header className="mb-6 text-center sm:mb-8">
      <p className="text-5xl" aria-hidden>
        {emoji}
      </p>
      <h1 className="soft-page-title font-display mt-3 text-2xl text-ink sm:text-4xl">{title}</h1>
      <p className="soft-page-sub mx-auto mt-3 max-w-md text-base leading-relaxed">{subtitle}</p>
    </header>
  );
}
