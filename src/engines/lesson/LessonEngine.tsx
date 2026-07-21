"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { LessonContent } from "@/lib/content/schema";
import { evaluateMastery } from "@/lib/progress/mastery";
import { useProgressStore } from "@/stores/progress-store";
import { PresetPlayground } from "@/engines/presets/PresetPlayground";
import type { PresetId } from "@/engines/presets/registry";
import type { InteractionHandle, SimSnapshot } from "@/engines/interaction/types";
import { StarReward } from "@/components/games/game-utils";
import { GameThumbnail } from "@/components/graphics/GameThumbnail";
import { ComicStar } from "@/components/graphics/ComicStar";
import { getGameArt } from "@/lib/content/game-art";

export function LessonEngine({ lesson }: { lesson: LessonContent }) {
  const [won, setWon] = useState(false);
  const presetRef = useRef<InteractionHandle>(null);
  const markVisited = useProgressStore((s) => s.markVisited);
  const markQuizPassed = useProgressStore((s) => s.markQuizPassed);
  const stars = useProgressStore((s) =>
    Object.values(s.lessons).filter((l) => l.mastered).length,
  );

  useEffect(() => {
    markVisited(lesson.slug);
  }, [lesson.slug, markVisited]);

  const handleSnapshot = useCallback(
    (s: SimSnapshot) => {
      const rule = lesson.phases.playground.mastery ?? lesson.phases.miniChallenge.mastery;
      if (rule && evaluateMastery(rule, s)) {
        setWon(true);
      }
      if (s.flags.won) {
        setWon(true);
      }
    },
    [lesson],
  );

  useEffect(() => {
    if (won) {
      markQuizPassed(lesson.slug);
    }
  }, [won, lesson.slug, markQuizPassed]);

  const hint =
    lesson.phases.hook.tease ||
    (lesson.phases.intuition.blocks.find((b) => b.type === "concept") as
      | { definition?: string }
      | undefined)?.definition ||
    "";

  const art = getGameArt(lesson.slug);

  return (
    <article className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-lg flex-col px-4 py-6 sm:px-6">
      <header className="mb-6">
        <div className="comic-panel flex items-center gap-4 p-4">
          <GameThumbnail slug={lesson.slug} size={56} />
          <div className="min-w-0 flex-1 text-left">
            <p
              className="font-display text-sm uppercase tracking-wide"
              style={{ color: art.accent }}
            >
              Game {lesson.kicker}
            </p>
            <h1 className="font-display text-xl uppercase leading-tight text-ink sm:text-2xl">
              {lesson.title}
            </h1>
          </div>
          <div className="flex shrink-0 flex-col items-center gap-0.5">
            <ComicStar size={24} />
            <span className="text-xs font-bold text-ink-muted">{stars}</span>
          </div>
        </div>
        {hint && (
          <p className="comic-speech mt-4 px-5 py-4 text-base font-bold leading-relaxed text-ink">
            {hint}
          </p>
        )}
      </header>

      <motion.div
        className="flex-1"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <PresetPlayground
          ref={presetRef}
          presetId={lesson.presetId as PresetId}
          config={lesson.presetConfig}
          mode="lesson"
          onSnapshot={handleSnapshot}
        />
      </motion.div>

      <div className="mt-8 space-y-4">
        <StarReward show={won} label="Star earned!" />

        {won && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
            {lesson.nav.next ? (
              <Link
                href={`/learn/${lesson.nav.next}`}
                className="comic-btn focus-ring flex min-h-14 items-center justify-center bg-discover text-lg text-on-accent"
              >
                Next game
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
              </Link>
            ) : (
              <Link
                href="/learn"
                className="comic-btn focus-ring flex min-h-14 items-center justify-center bg-discover text-lg text-on-accent"
              >
                Back to map 🗺️
              </Link>
            )}
          </motion.div>
        )}

        {!won && (
          <p className="flex items-center justify-center gap-2 text-center text-sm font-bold text-ink-muted">
            Type the right answers to earn your <ComicStar size={18} />
          </p>
        )}
      </div>

      <nav className="mt-8 flex justify-between border-t-[3px] border-border-subtle pt-6 text-sm font-bold">
        {lesson.nav.prev ? (
          <Link href={`/learn/${lesson.nav.prev}`} className="focus-ring flex items-center gap-1 text-ink-muted hover:text-ink">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back
          </Link>
        ) : (
          <Link href="/learn" className="focus-ring text-ink-muted hover:text-ink">
            Map
          </Link>
        )}
        {lesson.nav.next && (
          <Link href={`/learn/${lesson.nav.next}`} className="focus-ring font-medium text-discover">
            Skip →
          </Link>
        )}
      </nav>
    </article>
  );
}
