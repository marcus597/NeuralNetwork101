import { create } from "zustand";
import type { LessonContent } from "@/lib/content/schema";

export type LessonPhase =
  | "hook"
  | "intuition"
  | "playground"
  | "mistakes"
  | "realWorld"
  | "miniChallenge"
  | "recap"
  | "quiz"
  | "experiment";

const PHASE_ORDER: LessonPhase[] = [
  "hook",
  "intuition",
  "playground",
  "mistakes",
  "realWorld",
  "miniChallenge",
  "recap",
  "quiz",
  "experiment",
];

type LessonStoreState = {
  slug: string | null;
  content: LessonContent | null;
  currentPhase: LessonPhase;
  predictLocked: boolean;
  quizStepIndex: number;
  experimentUnlocked: boolean;
};

type LessonStoreActions = {
  initLesson: (content: LessonContent) => void;
  resetLesson: () => void;
  advancePhase: () => void;
  setPhase: (phase: LessonPhase) => void;
  lockPredict: () => void;
  unlockExperiment: () => void;
  nextQuizStep: () => void;
};

export const useLessonStore = create<LessonStoreState & LessonStoreActions>(
  (set, get) => ({
    slug: null,
    content: null,
    currentPhase: "hook",
    predictLocked: false,
    quizStepIndex: 0,
    experimentUnlocked: false,

    initLesson: (content) =>
      set({
        slug: content.slug,
        content,
        currentPhase: "hook",
        predictLocked: false,
        quizStepIndex: 0,
        experimentUnlocked: false,
      }),

    resetLesson: () =>
      set({
        currentPhase: "hook",
        predictLocked: false,
        quizStepIndex: 0,
        experimentUnlocked: false,
      }),

    advancePhase: () => {
      const { currentPhase } = get();
      const idx = PHASE_ORDER.indexOf(currentPhase);
      if (idx < PHASE_ORDER.length - 1) {
        set({ currentPhase: PHASE_ORDER[idx + 1] });
      }
    },

    setPhase: (phase) => set({ currentPhase: phase }),

    lockPredict: () => set({ predictLocked: true }),

    unlockExperiment: () => set({ experimentUnlocked: true }),

    nextQuizStep: () =>
      set((s) => ({ quizStepIndex: s.quizStepIndex + 1 })),
  }),
);

export { PHASE_ORDER };
