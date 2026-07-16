"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FlaskConical,
  Sparkles,
} from "lucide-react";
import type { LessonContent } from "@/lib/content/schema";
import { evaluateMastery } from "@/lib/progress/mastery";
import { useProgressStore } from "@/stores/progress-store";
import { PresetPlayground } from "@/engines/presets/PresetPlayground";
import type { PresetId } from "@/engines/presets/registry";
import type { InteractionHandle, SimSnapshot } from "@/engines/interaction/types";
import { LiveHint } from "@/components/shell/LiveHint";
import { QuizEngine } from "@/engines/quiz/QuizEngine";
import { Button } from "@/components/ui/Button";
import { springSnappy, easeOut } from "@/lib/motion/tokens";
import { cn } from "@/lib/cn";

const PHASES = [
  "hook",
  "intuition",
  "playground",
  "mistakes",
  "realWorld",
  "miniChallenge",
  "recap",
  "quiz",
  "experiment",
] as const;

type Phase = (typeof PHASES)[number];

const PHASE_LABELS: Record<Phase, string> = {
  hook: "Hook",
  intuition: "Intuition",
  playground: "Play",
  mistakes: "Traps",
  realWorld: "Example",
  miniChallenge: "Challenge",
  recap: "Recap",
  quiz: "Quiz",
  experiment: "Experiment",
};

export function LessonEngine({ lesson }: { lesson: LessonContent }) {
  const [phase, setPhase] = useState<Phase>("hook");
  const [snapshot, setSnapshot] = useState<SimSnapshot | null>(null);
  const [activeTrap, setActiveTrap] = useState<string | null>(null);
  const presetRef = useRef<InteractionHandle>(null);
  const markVisited = useProgressStore((s) => s.markVisited);
  const markMastered = useProgressStore((s) => s.markMastered);
  const markQuizPassed = useProgressStore((s) => s.markQuizPassed);
  const isMastered = useProgressStore((s) => s.lessons[lesson.slug]?.mastered);

  useEffect(() => {
    markVisited(lesson.slug);
  }, [lesson.slug, markVisited]);

  const handleSnapshot = useCallback(
    (s: SimSnapshot) => {
      setSnapshot(s);
      for (const trap of lesson.phases.mistakes.traps) {
        if (evaluateMastery(trap.detect, s)) {
          setActiveTrap(trap.reveal);
        }
      }
      if (
        lesson.phases.playground.mastery &&
        evaluateMastery(lesson.phases.playground.mastery, s)
      ) {
        markMastered(lesson.slug, "playground");
      }
      if (evaluateMastery(lesson.phases.miniChallenge.mastery, s)) {
        markMastered(lesson.slug, "miniChallenge");
      }
    },
    [lesson, markMastered],
  );

  const phaseIndex = PHASES.indexOf(phase);
  const advance = () => {
    const next = PHASES[phaseIndex + 1];
    if (next) setPhase(next);
  };

  const showPlayground =
    phase === "playground" ||
    phase === "mistakes" ||
    phase === "miniChallenge" ||
    phase === "experiment";

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet">
        {lesson.kicker} · {lesson.moduleTitle}
      </p>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {lesson.title}
        </h1>
        {isMastered && (
          <motion.span
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-mint/15 px-3 py-1 text-xs font-medium text-mint ring-1 ring-mint/25"
          >
            <Check className="h-3.5 w-3.5" aria-hidden />
            Mastered
          </motion.span>
        )}
      </div>

      <nav
        aria-label="Lesson phases"
        className="mb-8 flex flex-wrap gap-1.5"
      >
        {PHASES.map((p, i) => {
          const unlocked = i <= phaseIndex;
          const active = phase === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => setPhase(p)}
              className={cn(
                "focus-ring relative min-h-9 rounded-full px-3 py-1.5 text-xs font-medium transition-colors active:scale-[0.98]",
                active ? "text-white" : unlocked ? "text-ink-muted hover:text-ink" : "text-ink-muted/35",
              )}
            >
              {active && (
                <motion.span
                  layoutId={`lesson-phase-${lesson.slug}`}
                  className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-white/8"
                  transition={springSnappy}
                />
              )}
              <span className="relative">{PHASE_LABELS[p]}</span>
            </button>
          );
        })}
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={easeOut}
          className="space-y-6"
        >
          {phase === "hook" && (
            <section className="panel glow-violet space-y-5 p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-violet" strokeWidth={1.75} aria-hidden />
                <p className="text-lg leading-relaxed text-ink">{lesson.phases.hook.prompt}</p>
              </div>
              {lesson.phases.hook.tease && (
                <p className="pl-8 text-sm text-violet/90">{lesson.phases.hook.tease}</p>
              )}
              <Button onClick={advance} className="ml-8">
                Let&apos;s find out
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Button>
            </section>
          )}

          {phase === "intuition" && (
            <section className="space-y-4">
              {lesson.phases.intuition.blocks.map((block, i) => (
                <div
                  key={i}
                  className={cn(
                    block.type === "metaphor" && "panel border-l-[3px] border-gold/60 p-5 text-[15px] leading-relaxed text-ink",
                    block.type === "prediction-prompt" && "panel border-l-[3px] border-violet/60 p-5 text-[15px] leading-relaxed text-ink",
                    block.type === "text" && "text-[15px] leading-relaxed text-ink-muted",
                  )}
                >
                  {block.body ?? block.text}
                </div>
              ))}
              <Button variant="secondary" onClick={advance}>
                Open playground
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Button>
            </section>
          )}

          {showPlayground && (
            <section>
              {phase === "miniChallenge" && (
                <p className="mb-4 rounded-xl border border-gold/20 bg-gold/8 px-4 py-3 text-sm leading-relaxed text-gold">
                  <span className="font-medium">Challenge:</span>{" "}
                  {lesson.phases.miniChallenge.goal}
                </p>
              )}
              {phase === "experiment" && (
                <p className="mb-4 flex items-center gap-2 text-sm text-ink-muted">
                  <FlaskConical className="h-4 w-4 text-sky" strokeWidth={1.75} aria-hidden />
                  No gates — break it, remix it, wonder what happens.
                </p>
              )}
              <PresetPlayground
                ref={presetRef}
                presetId={lesson.presetId as PresetId}
                config={lesson.presetConfig}
                mode={phase === "experiment" ? "experiment" : "lesson"}
                onSnapshot={handleSnapshot}
              />
              {phase === "mistakes" && activeTrap && (
                <LiveHint message={activeTrap} tone="warning" className="mt-4" />
              )}
              {phase !== "experiment" && (
                <Button variant="ghost" onClick={advance} className="mt-5">
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </Button>
              )}
            </section>
          )}

          {phase === "realWorld" && (
            <section className="panel space-y-3 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-muted">
                {lesson.phases.realWorld.domain}
              </p>
              <p className="text-[15px] leading-relaxed text-ink">{lesson.phases.realWorld.example}</p>
              <Button variant="secondary" onClick={advance} className="mt-2">
                Try the challenge
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Button>
            </section>
          )}

          {phase === "recap" && (
            <section className="panel space-y-4 p-6">
              <ul className="space-y-3">
                {lesson.phases.recap.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-mint" strokeWidth={2} aria-hidden />
                    {b}
                  </li>
                ))}
              </ul>
              <Button onClick={advance}>
                Take the quiz
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Button>
            </section>
          )}

          {phase === "quiz" && (
            <QuizEngine
              steps={lesson.phases.quiz.steps}
              getSnapshot={() => presetRef.current?.getSnapshot() ?? snapshot}
              onPass={() => {
                markQuizPassed(lesson.slug);
                markMastered(lesson.slug, "quiz");
                setPhase("experiment");
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <nav
        aria-label="Lesson navigation"
        className="mt-12 flex items-center justify-between gap-4 border-t border-white/8 pt-8"
      >
        {lesson.nav.prev ? (
          <Link
            href={`/learn/${lesson.nav.prev}`}
            className="focus-ring group inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm text-ink-muted transition-colors hover:border-white/16 hover:text-ink active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" strokeWidth={1.75} aria-hidden />
            Previous
          </Link>
        ) : (
          <span />
        )}
        {lesson.nav.next ? (
          <Link
            href={`/learn/${lesson.nav.next}`}
            className="focus-ring group inline-flex min-h-11 items-center gap-2 rounded-full bg-violet/15 px-4 py-2.5 text-sm font-medium text-violet ring-1 ring-violet/20 transition-all hover:bg-violet/25 active:scale-[0.98]"
          >
            Next lesson
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} aria-hidden />
          </Link>
        ) : (
          <Link
            href="/playground"
            className="focus-ring group inline-flex min-h-11 items-center gap-2 rounded-full bg-mint/15 px-4 py-2.5 text-sm font-medium text-mint ring-1 ring-mint/20 transition-all hover:bg-mint/25 active:scale-[0.98]"
          >
            Playground
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </Link>
        )}
      </nav>
    </article>
  );
}
