/** Core contracts for the Wonder interaction engine. */

export type InteractionMode = "lesson" | "experiment" | "quiz";

export type SimSnapshot = {
  presetId: string;
  params: Record<string, number | boolean | string>;
  metrics: Record<string, number>;
  flags: Record<string, boolean>;
};

export type NormPoint = { x: number; y: number };

export type LabeledPoint = NormPoint & {
  id: string;
  label: number;
  split?: "train" | "test" | "hidden" | "val";
  meta?: Record<string, unknown>;
};

export type GraphNode = {
  id: string;
  x: number;
  y: number;
  label?: string;
  value?: number;
  active?: boolean;
};

export type GraphEdge = {
  from: string;
  to: string;
  weight?: number;
};

export type TreeNode = {
  id: string;
  feature?: string;
  threshold?: number;
  isLeaf?: boolean;
  prediction?: number;
  left?: TreeNode;
  right?: TreeNode;
};

export type DecisionBoundaryState = {
  angle: number;
  offset: number;
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

export type PointerEventNorm = {
  x: number;
  y: number;
  type: "down" | "move" | "up";
};

export type SimulationDefinition<TState> = {
  id: string;
  initialState: TState;
  draw: (ctx: CanvasRenderingContext2D, state: TState, size: { w: number; h: number }) => void;
  onPointer?: (
    state: TState,
    event: PointerEventNorm,
    size: { w: number; h: number },
  ) => TState | void;
  getSnapshot: (state: TState) => SimSnapshot;
  /** Optional discrete step for timeline playback */
  step?: (state: TState) => TState;
  reset?: () => TState;
};

export type InteractionHandle = {
  reset: () => void;
  getSnapshot: () => SimSnapshot;
  getState: () => unknown;
};
