export type { MasteryEvent } from "@/lib/progress/mastery";
export type { SimSnapshot } from "@/engines/interaction/types";
export { evaluateMastery } from "@/lib/progress/mastery";

export type ProgressEngine = {
  markVisited: (slug: string) => void;
  markMastered: (slug: string) => void;
};

/** Scaffold — progress logic lives in store + mastery.ts for v1 */
export function createProgressEngine(): ProgressEngine {
  return {
    markVisited: () => {},
    markMastered: () => {},
  };
}
