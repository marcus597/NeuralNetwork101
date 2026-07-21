import Link from "next/link";
import { MuseumHero } from "@/components/graphics/MuseumHero";
import { ComicStar } from "@/components/graphics/ComicStar";

export default function HomePage() {
  return (
    <div className="page-container max-w-lg text-center">
      <header className="pb-6 pt-2">
        <MuseumHero />
        <h1 className="font-display mt-6 text-4xl uppercase tracking-wide text-ink sm:text-5xl">
          Neural Network Museum
        </h1>
        <p className="mt-4 text-lg font-bold text-ink-muted">
          10 mini-games. Zero homework.
          <br />
          Learn how AI works by playing.
        </p>
      </header>

      <section className="comic-speech mb-8 p-6 text-left">
        <p className="font-display text-xl uppercase text-discover">How to play</p>
        <ol className="mt-4 space-y-3 text-base font-bold text-ink">
          <li className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 border-border-subtle bg-discover-soft text-sm shadow-sm">1</span>
            Tap a game
          </li>
          <li className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 border-border-subtle bg-discover-soft text-sm shadow-sm">2</span>
            Do what the screen says
          </li>
          <li className="flex items-center gap-2">
            <ComicStar size={28} className="shrink-0" />
            Collect stars
          </li>
        </ol>
      </section>

      <div className="flex flex-col items-center gap-4">
        <Link
          href="/learn/what-is-a-neuron"
          className="comic-btn focus-ring min-h-16 w-full bg-discover px-12 text-xl text-on-accent sm:w-auto"
        >
          Start Game 1 🧠
        </Link>

        <Link
          href="/learn"
          className="comic-btn focus-ring min-h-12 w-full border-[3px] border-border-subtle bg-bg-surface px-8 text-base text-ink sm:w-auto"
        >
          See all 10 games →
        </Link>

        <Link
          href="/network"
          className="comic-panel focus-ring mt-2 flex w-full items-center gap-3 p-4 text-left transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-border-subtle bg-discover-soft text-xl shadow-sm" aria-hidden>🍕</span>
          <span>
            <span className="block text-xs font-bold uppercase text-ink-subtle">Bonus exhibit</span>
            <span className="font-bold text-ink">Build a Pizza Brain</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
