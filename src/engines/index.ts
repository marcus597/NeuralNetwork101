/**
 * Wonder Interaction Engine — public surface
 *
 * Layer stack:
 *   SimulationHost / createCanvasPreset  → React lifecycle
 *   presets/*                            → Algorithm compositions (config only)
 *   visualization/layers/*               → Pure canvas draw primitives
 *   lib/viz/*                            → Math, datasets, distance, training
 *   interaction/TimelineEngine           → Step playback
 */

export type {
  SimSnapshot,
  InteractionHandle,
  LabeledPoint,
  TimelineStep,
  TimelineState,
  SimulationDefinition,
} from "./interaction/types";

export { SimulationHost } from "./interaction/SimulationHost";
export { TimelineEngine } from "./interaction/TimelineEngine";
export { useTimeline } from "./interaction/useTimeline";
export { Canvas2D } from "./visualization/Canvas2D";
export * from "./visualization/layers";
export * from "./presets";
