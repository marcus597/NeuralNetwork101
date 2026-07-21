"use client";

import Link from "next/link";
import type { LessonContent } from "@/lib/content/schema";
import {
  getPreviousLessonSlug,
  isLessonUnlocked,
} from "@/lib/content/curriculum-order";
import { useProgressStore } from "@/stores/progress-store";
import { LockedIllustration } from "@/components/graphics/LockedIllustration";
import { LessonEngine } from "@/engines/lesson/LessonEngine";

export function LessonGate({ lesson }: { lesson: LessonContent }) {
  const lessons = useProgressStore((s) => s.lessons);
  const unlocked = isLessonUnlocked(lesson.slug, lessons);
  const prev = getPreviousLessonSlug(lesson.slug);

  if (!unlocked && prev) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center">
        <LockedIllustration />
        <h1 className="font-display mt-6 text-3xl uppercase text-ink">Locked!</h1>
        <p className="mt-3 text-lg font-bold text-ink-muted">
          Beat the previous game to unlock this one.
        </p>
        <Link
          href={`/learn/${prev}`}
          className="comic-btn focus-ring mt-8 inline-flex min-h-14 items-center bg-discover px-8 text-lg text-on-accent"
        >
          Go back one game
        </Link>
      </div>
    );
  }

  return <LessonEngine lesson={lesson} />;
}
