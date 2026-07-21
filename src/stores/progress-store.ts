import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const PROGRESS_SCHEMA_VERSION = 1;

export type LessonProgress = {
  visited: boolean;
  mastered: boolean;
  quizPassed: boolean;
  lastVisitedAt: string | null;
  masteryEvents: string[];
};

export type ProgressState = {
  schemaVersion: number;
  sessionId: string;
  lessons: Record<string, LessonProgress>;
  path: { lastSlug: string | null };
  flags: { mobileBannerDismissed: boolean };
};

type ProgressActions = {
  markVisited: (slug: string) => void;
  markMastered: (slug: string, eventId?: string) => void;
  markQuizPassed: (slug: string) => void;
  setLastSlug: (slug: string) => void;
  dismissMobileBanner: () => void;
  getLessonState: (slug: string) => "unvisited" | "visited" | "mastered";
};

function emptyLesson(): LessonProgress {
  return {
    visited: false,
    mastered: false,
    quizPassed: false,
    lastVisitedAt: null,
    masteryEvents: [],
  };
}

function migrateProgress(persisted: unknown): ProgressState {
  const state = persisted as Partial<ProgressState> | undefined;
  if (!state || state.schemaVersion === PROGRESS_SCHEMA_VERSION) {
    return {
      schemaVersion: PROGRESS_SCHEMA_VERSION,
      sessionId: state?.sessionId ?? crypto.randomUUID(),
      lessons: state?.lessons ?? {},
      path: state?.path ?? { lastSlug: null },
      flags: state?.flags ?? { mobileBannerDismissed: false },
    };
  }
  // Future migrations go here
  return {
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    sessionId: state.sessionId ?? crypto.randomUUID(),
    lessons: state.lessons ?? {},
    path: state.path ?? { lastSlug: null },
    flags: state.flags ?? { mobileBannerDismissed: false },
  };
}

export const useProgressStore = create<ProgressState & ProgressActions>()(
  persist(
    (set, get) => ({
      schemaVersion: PROGRESS_SCHEMA_VERSION,
      sessionId:
        typeof crypto !== "undefined" ? crypto.randomUUID() : "ssr",
      lessons: {},
      path: { lastSlug: null },
      flags: { mobileBannerDismissed: false },

      markVisited: (slug) =>
        set((s) => ({
          lessons: {
            ...s.lessons,
            [slug]: {
              ...(s.lessons[slug] ?? emptyLesson()),
              visited: true,
              lastVisitedAt: new Date().toISOString(),
            },
          },
          path: { lastSlug: slug },
        })),

      markMastered: (slug, eventId) =>
        set((s) => {
          const current = s.lessons[slug] ?? emptyLesson();
          return {
            lessons: {
              ...s.lessons,
              [slug]: {
                ...current,
                visited: true,
                // Lab/challenge events are tracked; "mastered" requires quiz pass.
                masteryEvents: eventId
                  ? [...new Set([...current.masteryEvents, eventId])]
                  : current.masteryEvents,
              },
            },
          };
        }),

      markQuizPassed: (slug) =>
        set((s) => ({
          lessons: {
            ...s.lessons,
            [slug]: {
              ...(s.lessons[slug] ?? emptyLesson()),
              visited: true,
              quizPassed: true,
              mastered: true,
            },
          },
        })),

      setLastSlug: (slug) => set({ path: { lastSlug: slug } }),

      dismissMobileBanner: () =>
        set((s) => ({
          flags: { ...s.flags, mobileBannerDismissed: true },
        })),

      getLessonState: (slug) => {
        const lesson = get().lessons[slug];
        if (!lesson?.visited) return "unvisited";
        if (lesson.mastered) return "mastered";
        return "visited";
      },
    }),
    {
      name: "wonder-progress",
      storage: createJSONStorage(() => localStorage),
      merge: (persisted, current) => ({
        ...current,
        ...migrateProgress(persisted),
      }),
      partialize: (s) => ({
        schemaVersion: s.schemaVersion,
        sessionId: s.sessionId,
        lessons: s.lessons,
        path: s.path,
        flags: s.flags,
      }),
    },
  ),
);
