"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useInView,
  type MotionValue,
} from "motion/react";
import {
  ROADMAP_PHASES,
  ROADMAP_TOPICS,
  ROADMAP_VOCAB,
  topicsForPhase,
  type RoadmapTopic,
} from "@/lib/content/roadmap";
import { cn } from "@/lib/cn";

export function RoadmapExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 28,
    restDelta: 0.001,
  });
  const lineScale = useTransform(progress, [0, 1], [0, 1]);

  const [activeId, setActiveId] = useState(ROADMAP_TOPICS[0]?.id ?? "");

  const activePhaseId =
    activeId === "vocabulary"
      ? "vocabulary"
      : ROADMAP_TOPICS.find((t) => t.id === activeId)?.phaseId;

  return (
    <div ref={containerRef} className="relative bg-bg-canvas">
      <RoadmapHero progress={progress} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[minmax(200px,240px)_minmax(0,1fr)] md:gap-10 lg:gap-12">
          {/* Sticky contents panel — visible md+ */}
          <RoadmapSidebar
            activeId={activeId}
            activePhaseId={activePhaseId}
            lineScale={lineScale}
          />

          {/* Main column with center spine */}
          <div className="relative min-w-0 pb-32">
            {/* Vertical ink line — fills with scroll */}
            <div
              className="pointer-events-none absolute top-0 bottom-0 left-[11px] w-px bg-ink/10 sm:left-[15px] md:left-0"
              aria-hidden
            >
              <motion.div
                className="absolute inset-x-0 top-0 origin-top bg-ink"
                style={{ scaleY: lineScale, height: "100%", width: "1.5px" }}
              />
            </div>

            {ROADMAP_PHASES.filter((p) => p.id !== "vocabulary").map((phase) => (
              <section
                key={phase.id}
                id={`phase-${phase.id}`}
                className="relative scroll-mt-28"
              >
                <PhaseHeader phase={phase} />
                <div className="space-y-0">
                  {topicsForPhase(phase.id).map((topic, i) => (
                    <TopicBlock
                      key={topic.id}
                      topic={topic}
                      index={i}
                      isActive={activeId === topic.id}
                      onActive={setActiveId}
                    />
                  ))}
                </div>
              </section>
            ))}

            <VocabSection onActive={() => setActiveId("vocabulary")} />
          </div>
        </div>
      </div>

      <RoadmapFooter />
    </div>
  );
}

function RoadmapSidebar({
  activeId,
  activePhaseId,
  lineScale,
}: {
  activeId: string;
  activePhaseId?: string;
  lineScale: MotionValue<number>;
}) {
  return (
    <>
      {/* Desktop / tablet — sticky panel */}
      <aside className="relative hidden md:block">
        <div className="sticky top-24 z-30 max-h-[calc(100vh-6.5rem)] overflow-y-auto border border-ink/10 bg-bg-surface/95 p-5 shadow-sm backdrop-blur-sm">
          <p className="editorial-kicker mb-1">On this page</p>
          <p className="mb-5 text-[13px] font-semibold text-ink">Contents</p>

          <nav aria-label="Roadmap chapters" className="space-y-5">
            {ROADMAP_PHASES.map((phase) => {
              const isPhaseActive = activePhaseId === phase.id;

              return (
                <div key={phase.id}>
                  <a
                    href={`#phase-${phase.id}`}
                    className={cn(
                      "focus-ring group block rounded-sm px-1 py-0.5 transition-colors",
                      isPhaseActive && "bg-bg-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "font-display text-xl tracking-[-0.03em] transition-colors",
                        isPhaseActive ? "text-ink/40" : "text-ink/20 group-hover:text-ink/35",
                      )}
                    >
                      {phase.index}
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 block text-[11px] font-semibold uppercase tracking-[0.16em]",
                        isPhaseActive ? "text-ink" : "text-ink-subtle group-hover:text-ink",
                      )}
                    >
                      {phase.title}
                    </span>
                  </a>

                  {phase.id === "vocabulary" ? (
                    <p className="mt-2 border-l border-ink/10 pl-3 text-[11px] leading-snug text-ink-subtle">
                      {ROADMAP_VOCAB.length} terms
                    </p>
                  ) : (
                    <ul className="mt-2 space-y-1 border-l border-ink/10 pl-3">
                      {topicsForPhase(phase.id).map((t) => (
                        <li key={t.id}>
                          <a
                            href={`#topic-${t.id}`}
                            className={cn(
                              "focus-ring block rounded-sm py-0.5 text-[11px] leading-snug transition-colors",
                              activeId === t.id
                                ? "font-semibold text-ink"
                                : "text-ink-subtle hover:text-ink",
                            )}
                          >
                            {t.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="mt-6 flex items-end gap-3 border-t border-ink/10 pt-4">
            <div className="h-16 w-px shrink-0 bg-ink/10">
              <motion.div
                className="w-px origin-top bg-ink"
                style={{ scaleY: lineScale, height: "100%" }}
              />
            </div>
            <p className="text-[10px] font-semibold uppercase leading-relaxed tracking-[0.14em] text-ink-faint">
              Scroll progress
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile — compact floating rail */}
      <div className="pointer-events-none fixed bottom-6 left-4 z-40 md:hidden">
        <a
          href={
            activeId === "vocabulary"
              ? "#phase-vocabulary"
              : `#topic-${activeId}`
          }
          className="focus-ring pointer-events-auto block max-w-[11rem] border border-ink/15 bg-bg-surface/95 px-3 py-2 shadow-md backdrop-blur-sm"
        >
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
            Reading
          </p>
          <p className="mt-0.5 truncate text-[11px] font-semibold text-ink">
            {activeId === "vocabulary"
              ? "Vocabulary"
              : ROADMAP_TOPICS.find((t) => t.id === activeId)?.title ?? "Roadmap"}
          </p>
        </a>
      </div>
    </>
  );
}

function RoadmapHero({ progress }: { progress: MotionValue<number> }) {
  const y = useTransform(progress, [0, 0.15], [0, -40]);
  const opacity = useTransform(progress, [0, 0.12], [1, 0.35]);

  return (
    <section className="relative overflow-hidden border-b border-ink/10">
      <motion.div
        style={{ y, opacity }}
        className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8"
      >
        <p className="editorial-kicker mb-4">Vol. 01 · Field notes</p>
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="font-display max-w-[12ch] text-[clamp(3rem,10vw,6.5rem)] uppercase leading-[0.88] tracking-[-0.04em] text-ink">
              Learning
              <br />
              roadmap
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-muted sm:text-base">
              A year of machine learning — foundations through neural nets —
              explained simply, still covering the real ideas.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 lg:items-end">
            <p className="font-display text-5xl tracking-[-0.04em] text-ink/15 sm:text-6xl">
              {ROADMAP_TOPICS.length}+
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
              topics · {ROADMAP_VOCAB.length} terms
            </p>
          </div>
        </div>

        {/* Learning path strip */}
        <div className="mt-12 overflow-x-auto border border-ink/10 bg-bg-surface">
          <ol className="flex min-w-max divide-x divide-ink/10">
            {ROADMAP_PHASES.map((phase) => (
              <li key={phase.id} className="px-5 py-4 sm:px-6">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
                  {phase.index}
                </span>
                <span className="mt-1 block text-sm font-semibold text-ink">
                  {phase.title}
                </span>
                <span className="mt-0.5 block text-xs text-ink-subtle">
                  {phase.kicker}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </motion.div>

      <div
        className="pointer-events-none absolute -right-8 top-8 hidden opacity-[0.07] lg:block"
        aria-hidden
      >
        <HeroDiagram />
      </div>
    </section>
  );
}

function PhaseHeader({
  phase,
}: {
  phase: (typeof ROADMAP_PHASES)[number];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px -40% 0px", once: false });

  return (
    <div
      ref={ref}
      className="relative mb-2 ml-8 border-b border-ink/10 pb-8 pt-16 sm:ml-10 lg:ml-8 lg:pt-20"
    >
      <span
        className={cn(
          "absolute -left-[29px] top-[4.75rem] flex h-3.5 w-3.5 items-center justify-center rounded-full border-[1.5px] bg-bg-canvas transition-colors sm:-left-[25px] lg:-left-[7px]",
          inView ? "border-ink bg-ink" : "border-ink/40",
        )}
        aria-hidden
      />
      <p className="editorial-kicker mb-2">{phase.kicker}</p>
      <h2 className="font-display text-4xl uppercase tracking-[-0.03em] text-ink sm:text-5xl">
        <span className="mr-3 text-ink/20">{phase.index}</span>
        {phase.title}
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
        {phase.summary}
      </p>
    </div>
  );
}

function TopicBlock({
  topic,
  index,
  isActive,
  onActive,
}: {
  topic: RoadmapTopic;
  index: number;
  isActive: boolean;
  onActive: (id: string) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-35% 0px -45% 0px", once: false });

  useEffect(() => {
    if (inView) onActive(topic.id);
  }, [inView, onActive, topic.id]);

  return (
    <motion.article
      id={`topic-${topic.id}`}
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.03, 0.15) }}
      className="relative ml-8 scroll-mt-32 border-b border-ink/10 py-10 sm:ml-10 lg:ml-8 lg:py-12"
    >
      <span
        className={cn(
          "absolute -left-[31px] top-12 h-2.5 w-2.5 rounded-full border-[1.5px] bg-bg-canvas transition-all duration-300 sm:-left-[27px] lg:-left-[9px]",
          isActive || inView ? "scale-125 border-ink bg-ink" : "border-ink/35",
        )}
        aria-hidden
      />

      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em]",
            topic.kind === "model"
              ? "border-ink bg-ink text-ink-inverse"
              : "border-ink/25 text-ink-subtle",
          )}
        >
          {topic.kind}
        </span>
      </div>

      <h3 className="mt-3 font-display text-2xl uppercase tracking-[-0.02em] text-ink sm:text-3xl">
        {topic.title}
      </h3>
      <p className="mt-2 text-sm font-medium text-ink-subtle sm:text-[15px]">
        {topic.tagline}
      </p>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_minmax(0,0.9fr)]">
        <p className="text-sm leading-relaxed text-ink-muted sm:text-[15px] sm:leading-relaxed">
          {topic.body}
        </p>

        <div className="space-y-4">
          {topic.formula && (
            <div className="border border-ink/10 bg-bg-muted/60 px-4 py-3">
              <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                Key idea
              </p>
              <p className="font-mono text-[13px] leading-relaxed text-ink">
                {topic.formula}
              </p>
            </div>
          )}
          {topic.goodFor && (
            <div className="border border-ink/10 px-4 py-3">
              <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                Good for
              </p>
              <p className="text-[13px] leading-relaxed text-ink-muted">
                {topic.goodFor}
              </p>
            </div>
          )}
          <ul className="space-y-2">
            {topic.takeaways.map((t) => (
              <li
                key={t}
                className="flex gap-2 text-[13px] leading-snug text-ink-muted"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.article>
  );
}

function VocabSection({ onActive }: { onActive: () => void }) {
  const phase = ROADMAP_PHASES.find((p) => p.id === "vocabulary")!;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px -30% 0px", once: false });

  useEffect(() => {
    if (inView) onActive();
  }, [inView, onActive]);

  return (
    <section
      id={`phase-${phase.id}`}
      ref={ref}
      className="relative ml-8 scroll-mt-28 pt-16 sm:ml-10 lg:ml-8 lg:pt-20"
    >
      <span
        className={cn(
          "absolute -left-[29px] top-[4.75rem] flex h-3.5 w-3.5 items-center justify-center rounded-full border-[1.5px] bg-bg-canvas transition-colors sm:-left-[25px] lg:-left-[7px]",
          inView ? "border-ink bg-ink" : "border-ink/40",
        )}
        aria-hidden
      />

      <p className="editorial-kicker mb-2">{phase.kicker}</p>
      <h2 className="font-display text-4xl uppercase tracking-[-0.03em] text-ink sm:text-5xl">
        <span className="mr-3 text-ink/20">{phase.index}</span>
        {phase.title}
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
        {phase.summary}
      </p>

      <dl className="mt-10 grid border-t border-l border-ink/10 sm:grid-cols-2">
        {ROADMAP_VOCAB.map((entry, i) => (
          <motion.div
            key={entry.term}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5% 0px" }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.02, 0.2) }}
            className="border-b border-r border-ink/10 px-4 py-4 sm:px-5"
          >
            <dt className="text-[13px] font-semibold tracking-tight text-ink">
              {entry.term}
            </dt>
            <dd className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">
              {entry.definition}
            </dd>
            {entry.related && (
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                → {entry.related}
              </p>
            )}
          </motion.div>
        ))}
      </dl>
    </section>
  );
}

function RoadmapFooter() {
  return (
    <footer className="border-t border-ink/10 bg-ink text-ink-inverse">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
            End of path · for now
          </p>
          <p className="mt-2 max-w-sm font-display text-3xl uppercase tracking-[-0.03em]">
            Next: keep building
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/learn"
            className="focus-ring border border-white/30 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-inverse transition-colors hover:bg-white hover:text-ink"
          >
            Play games
          </Link>
          <Link
            href="/network"
            className="focus-ring bg-ink-inverse px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition-opacity hover:opacity-90"
          >
            Pizza brain →
          </Link>
        </div>
      </div>
    </footer>
  );
}

function HeroDiagram() {
  return (
    <svg width="280" height="220" viewBox="0 0 280 220" fill="none" aria-hidden>
      <g stroke="#111" strokeWidth="1">
        {[40, 80, 120, 160].map((y, i) => (
          <circle key={`a-${i}`} cx="40" cy={y} r="5" fill="#111" />
        ))}
        {[50, 100, 150].map((y, i) => (
          <circle key={`b-${i}`} cx="140" cy={y} r="6" fill="#111" />
        ))}
        <circle cx="240" cy="100" r="8" fill="#111" />
        {[40, 80, 120, 160].flatMap((y1, i) =>
          [50, 100, 150].map((y2, j) => (
            <line key={`${i}-${j}`} x1="45" y1={y1} x2="134" y2={y2} opacity="0.5" />
          )),
        )}
        {[50, 100, 150].map((y, i) => (
          <line key={`o-${i}`} x1="146" y1={y} x2="232" y2="100" opacity="0.5" />
        ))}
      </g>
    </svg>
  );
}
