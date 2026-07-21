/** Core contracts for NN interactive labs. */

export type InteractionMode = "lesson" | "experiment" | "quiz";

export type SimSnapshot = {
  presetId: string;
  params: Record<string, number | boolean | string>;
  metrics: Record<string, number>;
  flags: Record<string, boolean>;
};

export type TimelineStep<T = Record<string, unknown>> = {
  id: string;
  label?: string;
  state: T;
  durationMs?: number;
};

export type TimelineState = {
  steps: TimelineStep[];
  currentIndex: number;
  playing: boolean;
  speed: number;
};

export type InteractionHandle = {
  reset: () => void;
  getSnapshot: () => SimSnapshot;
  getState: () => unknown;
};
