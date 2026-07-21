import manifest from "../../../content/curriculum/manifest.json";

/** Ordered lesson slugs across all modules (curriculum sequence). */
export const ORDERED_LESSON_SLUGS: string[] = manifest.modules.flatMap(
  (m) => m.lessons,
);

export function getPreviousLessonSlug(slug: string): string | null {
  const i = ORDERED_LESSON_SLUGS.indexOf(slug);
  if (i <= 0) return null;
  return ORDERED_LESSON_SLUGS[i - 1] ?? null;
}

export function isLessonUnlocked(
  slug: string,
  lessons: Record<string, { quizPassed?: boolean; visited?: boolean } | undefined>,
): boolean {
  const prev = getPreviousLessonSlug(slug);
  if (!prev) return true;
  const prevLesson = lessons[prev];
  return Boolean(prevLesson?.visited || prevLesson?.quizPassed);
}
