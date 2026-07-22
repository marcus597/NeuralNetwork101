import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  AttentionFan,
  CurriculumPathBand,
  DeepNetworkBanner,
  ForwardPassStrip,
  LossContour,
  MiniLayerStack,
  WeightMatrixGrid,
} from "@/components/graphics/EditorialNetworkGraphics";

export default function HomePage() {
  return (
    <div className="home-locked paper-grain relative h-[100svh] overflow-hidden bg-bg-canvas">
      {/* Column dividers */}
      <div className="pointer-events-none absolute inset-0 z-0 hidden lg:block" aria-hidden>
        <div className="mx-auto grid h-full max-w-[1400px] grid-cols-3">
          <div className="border-r border-ink/15" />
          <div className="border-r border-ink/15" />
          <div />
        </div>
      </div>

      <div className="relative z-10 mx-auto grid h-full max-w-[1400px] grid-rows-[1fr] lg:grid-cols-3">
        {/* ── Left column ── */}
        <aside className="hidden min-h-0 flex-col justify-between border-r border-ink/15 px-6 pb-6 pt-[4.5rem] lg:flex lg:px-7 lg:pb-8">
          <div className="space-y-3">
            <h1 className="max-w-[16ch] text-xl font-semibold leading-snug tracking-tight text-ink">
              The Neural Network Museum{" "}
              <span className="text-ink-subtle">©2026</span>
            </h1>
            <p className="max-w-[26ch] text-[13px] leading-relaxed text-ink-muted">
              Ten interactive games that teach how AI thinks — from a single neuron
              to transformers. No homework. Just play.
            </p>
          </div>

          <div className="overflow-hidden border border-ink/10" aria-hidden>
            <MiniLayerStack className="h-[140px] w-full" />
          </div>

          <div>
            <p className="font-display text-[clamp(2.75rem,5vw,4rem)] leading-none tracking-[-0.04em] text-ink">
              10+
            </p>
            <p className="mt-1 text-xs font-medium text-ink-muted">games and live exhibits</p>
          </div>

          <div className="overflow-hidden border border-ink/10" aria-hidden>
            <ForwardPassStrip className="h-[52px] w-full" />
          </div>

          <p className="max-w-[11ch] text-2xl font-semibold leading-tight tracking-tight text-ink">
            Step into how AI learns
          </p>
        </aside>

        {/* ── Center column ── */}
        <section className="relative hidden min-h-0 flex-col border-r border-ink/15 px-5 pb-4 pt-[4.5rem] lg:flex lg:px-6 lg:pb-6">
          {/* Top void — wide deep network banner */}
          <div className="mb-3 shrink-0 overflow-hidden border border-ink/10 lg:mb-4" aria-hidden>
            <DeepNetworkBanner className="h-[88px] w-full lg:h-[100px]" />
          </div>

          {/* Giant background number */}
          <span
            className="pointer-events-none absolute inset-x-0 top-[42%] -z-0 text-center font-display text-[clamp(8rem,18vw,14rem)] leading-none tracking-[-0.06em] text-ink/[0.06]"
            aria-hidden
          >
            10
          </span>

          {/* Hero card — flex-1 but capped */}
          <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center">
            <div className="relative aspect-[4/5] h-full max-h-[min(52vh,420px)] w-auto max-w-full overflow-hidden bg-bg-muted">
              <HeroNetworkArt />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent" />
              <Link
                href="/learn/what-is-a-neuron"
                className="focus-ring absolute left-1/2 top-1/2 z-20 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-white/50 bg-white/20 text-center shadow-[0_8px_32px_rgb(17_17_17_/_12%)] backdrop-blur-md transition-transform hover:scale-105"
              >
                <span className="text-[10px] font-semibold uppercase leading-tight tracking-[0.14em] text-ink">
                  Start
                  <br />
                  Playing
                </span>
              </Link>
            </div>
          </div>

          {/* Bottom strip */}
          <div className="mt-3 shrink-0 overflow-hidden border border-ink/10 bg-bg-canvas/80 px-3 py-2 backdrop-blur-sm" aria-hidden>
            <CurriculumPathBand className="h-[44px] w-full" />
          </div>
        </section>

        {/* ── Right column ── */}
        <aside className="hidden min-h-0 flex-col justify-between px-6 pb-6 pt-[4.5rem] lg:flex lg:px-7 lg:pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ArrowLeft className="h-3.5 w-3.5 text-ink-subtle" strokeWidth={1.5} aria-hidden />
              <div className="relative h-20 flex-1 overflow-hidden rounded-full border border-ink/10 bg-bg-muted">
                <SecondaryNetworkArt />
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-ink-subtle" strokeWidth={1.5} aria-hidden />
            </div>
            <p className="text-center text-[11px] font-medium text-ink-muted">
              Explore the pizza brain exhibit
            </p>
          </div>

          {/* Compact graphic row */}
          <div className="grid grid-cols-3 gap-2" aria-hidden>
            <div className="overflow-hidden border border-ink/10">
              <WeightMatrixGrid className="h-[72px] w-full" />
            </div>
            <div className="overflow-hidden border border-ink/10">
              <LossContour className="h-[72px] w-full" />
            </div>
            <div className="overflow-hidden border border-ink/10">
              <AttentionFan className="h-[72px] w-full" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="max-w-[14ch] text-xl font-semibold leading-tight tracking-tight text-ink">
              Hands-on neural playgrounds
            </h2>
            <p className="max-w-[32ch] text-[13px] leading-relaxed text-ink-muted">
              Follow the roadmap from Meet AI to transformers. Build a pizza
              classifier and collect stars as you unlock each idea.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <Link
                href="/roadmap"
                className="focus-ring text-[10px] font-semibold uppercase tracking-[0.14em] text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
              >
                Roadmap
              </Link>
              <Link
                href="/learn"
                className="focus-ring text-[10px] font-semibold uppercase tracking-[0.14em] text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
              >
                Game map
              </Link>
              <Link
                href="/network"
                className="focus-ring text-[10px] font-semibold uppercase tracking-[0.14em] text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
              >
                Pizza brain
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile / tablet fallback — same viewport, simplified single column */}
        <section className="flex min-h-0 flex-col px-5 pb-5 pt-[4.5rem] lg:hidden">
          <div className="mb-3 shrink-0 overflow-hidden border border-ink/10" aria-hidden>
            <DeepNetworkBanner className="h-[80px] w-full" />
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center">
            <div className="relative aspect-[4/5] h-full max-h-[50vh] w-auto overflow-hidden bg-bg-muted">
              <HeroNetworkArt />
              <Link
                href="/learn/what-is-a-neuron"
                className="focus-ring absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/20 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink backdrop-blur-md"
              >
                Start
              </Link>
            </div>
          </div>
          <p className="mt-3 shrink-0 text-center text-sm text-ink-muted">
            <Link href="/learn" className="focus-ring font-semibold text-ink underline">
              View all games →
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

function HeroNetworkArt() {
  return (
    <svg viewBox="0 0 340 425" className="h-full w-full" aria-hidden>
      <rect width="340" height="425" fill="#d9d4ca" />
      <defs>
        <radialGradient id="hero-glow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#f2efe8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#d9d4ca" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="340" height="425" fill="url(#hero-glow)" />
      <g stroke="#111" strokeWidth="1.25" fill="none" opacity="0.85">
        <ellipse cx="170" cy="150" rx="72" ry="86" />
        <path d="M120 210 Q170 250 220 210" />
        <path d="M140 120 L170 95 L200 120" />
        <circle cx="148" cy="145" r="5" fill="#111" stroke="none" />
        <circle cx="192" cy="145" r="5" fill="#111" stroke="none" />
      </g>
      <g stroke="#111" strokeWidth="1" fill="none" opacity="0.55">
        <line x1="170" y1="236" x2="170" y2="320" />
        <line x1="130" y1="260" x2="210" y2="260" />
        <line x1="120" y1="300" x2="220" y2="300" />
        <line x1="110" y1="340" x2="230" y2="340" />
        <circle cx="130" cy="260" r="4" fill="#111" />
        <circle cx="210" cy="260" r="4" fill="#111" />
        <circle cx="120" cy="300" r="4" fill="#111" />
        <circle cx="170" cy="300" r="5" fill="#111" />
        <circle cx="220" cy="300" r="4" fill="#111" />
        <circle cx="110" cy="340" r="3.5" fill="#111" />
        <circle cx="170" cy="340" r="4" fill="#111" />
        <circle cx="230" cy="340" r="3.5" fill="#111" />
      </g>
      <text x="24" y="400" fill="#6a6a6a" fontSize="10" fontFamily="system-ui, sans-serif" letterSpacing="2">
        NEURON → NETWORK
      </text>
    </svg>
  );
}

function SecondaryNetworkArt() {
  return (
    <svg viewBox="0 0 280 140" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="280" height="140" fill="#cfc8ba" />
      <g stroke="#111" strokeWidth="1" fill="none" opacity="0.7">
        <circle cx="140" cy="70" r="38" />
        <circle cx="140" cy="70" r="18" />
        <line x1="140" y1="32" x2="140" y2="18" />
        <line x1="140" y1="108" x2="140" y2="128" />
        <line x1="102" y1="70" x2="70" y2="70" />
        <line x1="178" y1="70" x2="210" y2="70" />
        <circle cx="70" cy="70" r="5" fill="#111" />
        <circle cx="210" cy="70" r="5" fill="#111" />
        <circle cx="140" cy="18" r="4" fill="#111" />
        <circle cx="140" cy="128" r="4" fill="#111" />
      </g>
    </svg>
  );
}
