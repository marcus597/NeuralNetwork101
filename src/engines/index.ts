/**
 * Wonder Interaction Engine — neural network labs
 *
 * Layer stack:
 *   presets/*              → NN lab compositions (NeuronLab, TrainingLab, …)
 *   interaction/types      → SimSnapshot + InteractionHandle contracts
 *   interaction/TimelineEngine → Optional step playback
 */

export type {
  SimSnapshot,
  InteractionHandle,
  TimelineStep,
  TimelineState,
} from "./interaction/types";

export { TimelineEngine } from "./interaction/TimelineEngine";
export { useTimeline } from "./interaction/useTimeline";
export * from "./presets";
