"use client";

import { create } from "zustand";
import type { LabeledPoint } from "@/engines/interaction/types";
import type { AlgorithmId, AlgorithmModel } from "@/lib/algorithms/types";
import {
  ALGORITHM_REGISTRY,
  defaultHyperparams,
} from "@/lib/algorithms/registry";
import { splitTrainTest } from "@/lib/algorithms/metrics";
import type { DatasetPresetId } from "@/lib/viz/dataset/presets";
import { generatePreset } from "@/lib/viz/dataset/presets";
import type { PlaygroundExperiment } from "@/lib/playground/experiment";
import {
  createExperimentId,
  encodeShareUrl,
  saveExperimentLocal,
} from "@/lib/playground/experiment";

export type DrawTool = "select" | "draw" | "label";

export type PlaygroundState = {
  points: LabeledPoint[];
  seed: number;
  preset: DatasetPresetId;
  task: "classification" | "regression" | "clustering";
  trainRatio: number;
  drawTool: DrawTool;
  drawLabel: number;
  primaryAlgorithm: AlgorithmId;
  compareAlgorithms: AlgorithmId[];
  hyperparams: Partial<Record<AlgorithmId, Record<string, number>>>;
  models: Partial<Record<AlgorithmId, AlgorithmModel>>;
  timelineIndex: number;
  timelinePlaying: boolean;
  timelineSpeed: number;
  activeThinkAlgorithm: AlgorithmId | null;
  experimentName: string;
  experimentId: string;
  shareUrl: string | null;
  statusMessage: string | null;

  setDrawTool: (tool: DrawTool) => void;
  setDrawLabel: (label: number) => void;
  setSeed: (seed: number) => void;
  setPreset: (preset: DatasetPresetId) => void;
  generateDataset: () => void;
  addPoint: (x: number, y: number) => void;
  movePoint: (id: string, x: number, y: number) => void;
  toggleLabel: (id: string) => void;
  removePoint: (id: string) => void;
  setPoints: (points: LabeledPoint[]) => void;
  resetPoints: () => void;
  setPrimaryAlgorithm: (id: AlgorithmId) => void;
  toggleCompare: (id: AlgorithmId) => void;
  setHyperparam: (algo: AlgorithmId, key: string, value: number) => void;
  train: () => void;
  trainAll: () => void;
  setTimelineIndex: (i: number) => void;
  setTimelinePlaying: (playing: boolean) => void;
  setTimelineSpeed: (speed: number) => void;
  setActiveThinkAlgorithm: (id: AlgorithmId | null) => void;
  stepTimeline: (delta: number) => void;
  resetExperiment: () => void;
  saveExperiment: () => void;
  copyShareLink: () => Promise<void>;
  loadExperiment: (exp: PlaygroundExperiment) => void;
  setStatus: (msg: string | null) => void;
  setTrainRatio: (ratio: number) => void;
};

let pointCounter = 1000;

function nextPointId() {
  return `u-${pointCounter++}`;
}

function getHyperparams(state: PlaygroundState, algoId: AlgorithmId) {
  return {
    ...defaultHyperparams(algoId),
    ...state.hyperparams[algoId],
  };
}

function trainAlgorithm(
  algoId: AlgorithmId,
  points: LabeledPoint[],
  trainRatio: number,
  params: Record<string, number>,
): AlgorithmModel {
  const { train, test } = splitTrainTest(points, trainRatio);
  return ALGORITHM_REGISTRY[algoId].fit(train, test, params);
}

export const usePlaygroundStore = create<PlaygroundState>((set, get) => ({
  points: generatePreset("blobs", 42),
  seed: 42,
  preset: "blobs",
  task: "classification",
  trainRatio: 0.75,
  drawTool: "select",
  drawLabel: 0,
  primaryAlgorithm: "knn",
  compareAlgorithms: [],
  hyperparams: {},
  models: {},
  timelineIndex: 0,
  timelinePlaying: false,
  timelineSpeed: 1,
  activeThinkAlgorithm: null,
  experimentName: "Untitled experiment",
  experimentId: createExperimentId(),
  shareUrl: null,
  statusMessage: null,

  setDrawTool: (drawTool) => set({ drawTool }),
  setDrawLabel: (drawLabel) => set({ drawLabel }),
  setSeed: (seed) => set({ seed }),
  setPreset: (preset) => {
    const presetDef = generatePreset(preset, get().seed);
    set({
      preset,
      task:
        preset === "linear"
          ? "regression"
          : preset === "blobs"
            ? "classification"
            : get().task,
      points: presetDef,
      models: {},
      timelineIndex: 0,
    });
  },
  generateDataset: () => {
    const { preset, seed } = get();
    set({
      points: generatePreset(preset, seed),
      models: {},
      timelineIndex: 0,
    });
  },
  addPoint: (x, y) => {
    const { drawLabel, points } = get();
    set({
      points: [
        ...points,
        {
          id: nextPointId(),
          x: Math.min(0.98, Math.max(0.02, x)),
          y: Math.min(0.98, Math.max(0.02, y)),
          label: drawLabel,
          split: "train",
        },
      ],
      models: {},
    });
  },
  movePoint: (id, x, y) => {
    set({
      points: get().points.map((p) =>
        p.id === id
          ? {
              ...p,
              x: Math.min(0.98, Math.max(0.02, x)),
              y: Math.min(0.98, Math.max(0.02, y)),
            }
          : p,
      ),
      models: {},
    });
  },
  toggleLabel: (id) => {
    set({
      points: get().points.map((p) =>
        p.id === id ? { ...p, label: p.label === 0 ? 1 : 0 } : p,
      ),
      models: {},
    });
  },
  removePoint: (id) => {
    set({
      points: get().points.filter((p) => p.id !== id),
      models: {},
    });
  },
  setPoints: (points) => set({ points, models: {} }),
  resetPoints: () => {
    const { preset, seed } = get();
    set({
      points: generatePreset(preset, seed),
      models: {},
      timelineIndex: 0,
      timelinePlaying: false,
    });
  },
  setPrimaryAlgorithm: (primaryAlgorithm) =>
    set({ primaryAlgorithm, timelineIndex: 0 }),
  toggleCompare: (id) => {
    const current = get().compareAlgorithms;
    if (current.includes(id)) {
      set({ compareAlgorithms: current.filter((a) => a !== id) });
    } else if (current.length < 3) {
      set({ compareAlgorithms: [...current, id] });
    }
  },
  setHyperparam: (algo, key, value) =>
    set({
      hyperparams: {
        ...get().hyperparams,
        [algo]: { ...get().hyperparams[algo], [key]: value },
      },
      models: {},
    }),
  train: () => {
    const state = get();
    const params = getHyperparams(state, state.primaryAlgorithm);
    const model = trainAlgorithm(
      state.primaryAlgorithm,
      state.points,
      state.trainRatio,
      params,
    );
    set({
      models: { ...state.models, [state.primaryAlgorithm]: model },
      activeThinkAlgorithm: state.primaryAlgorithm,
      timelineIndex: 0,
      timelinePlaying: false,
      statusMessage: `Trained ${ALGORITHM_REGISTRY[state.primaryAlgorithm].name}`,
    });
  },
  trainAll: () => {
    const state = get();
    const ids = [
      state.primaryAlgorithm,
      ...state.compareAlgorithms,
    ] as AlgorithmId[];
    const models = { ...state.models };
    ids.forEach((id) => {
      models[id] = trainAlgorithm(
        id,
        state.points,
        state.trainRatio,
        getHyperparams(state, id),
      );
    });
    set({
      models,
      activeThinkAlgorithm: state.primaryAlgorithm,
      timelineIndex: 0,
      statusMessage: `Trained ${ids.length} model(s)`,
    });
  },
  setTimelineIndex: (timelineIndex) => set({ timelineIndex }),
  setTimelinePlaying: (timelinePlaying) => set({ timelinePlaying }),
  setTimelineSpeed: (timelineSpeed) => set({ timelineSpeed }),
  setActiveThinkAlgorithm: (activeThinkAlgorithm) =>
    set({ activeThinkAlgorithm, timelineIndex: 0 }),
  stepTimeline: (delta) => {
    const { activeThinkAlgorithm, models, timelineIndex } = get();
    if (!activeThinkAlgorithm || !models[activeThinkAlgorithm]) return;
    const steps = models[activeThinkAlgorithm]!.steps;
    const next = Math.max(0, Math.min(steps.length - 1, timelineIndex + delta));
    set({ timelineIndex: next });
  },
  resetExperiment: () => {
    set({
      points: generatePreset("blobs", 42),
      seed: 42,
      preset: "blobs",
      models: {},
      compareAlgorithms: [],
      hyperparams: {},
      timelineIndex: 0,
      timelinePlaying: false,
      experimentId: createExperimentId(),
      experimentName: "Untitled experiment",
      statusMessage: "Reset complete",
    });
  },
  saveExperiment: () => {
    const state = get();
    const exp: PlaygroundExperiment = {
      v: 1,
      name: state.experimentName,
      seed: state.seed,
      task: state.task,
      points: state.points,
      trainRatio: state.trainRatio,
      primaryAlgorithm: state.primaryAlgorithm,
      compareAlgorithms: state.compareAlgorithms,
      hyperparams: Object.fromEntries(
        [
          state.primaryAlgorithm,
          ...state.compareAlgorithms,
        ].map((id) => [id, getHyperparams(state, id)]),
      ) as PlaygroundExperiment["hyperparams"],
      createdAt: new Date().toISOString(),
    };
    saveExperimentLocal(state.experimentId, exp);
    set({ statusMessage: `Saved "${state.experimentName}"` });
  },
  copyShareLink: async () => {
    const state = get();
    const exp: PlaygroundExperiment = {
      v: 1,
      name: state.experimentName,
      seed: state.seed,
      task: state.task,
      points: state.points,
      trainRatio: state.trainRatio,
      primaryAlgorithm: state.primaryAlgorithm,
      compareAlgorithms: state.compareAlgorithms,
      hyperparams: Object.fromEntries(
        [
          state.primaryAlgorithm,
          ...state.compareAlgorithms,
        ].map((id) => [id, getHyperparams(state, id)]),
      ) as PlaygroundExperiment["hyperparams"],
      createdAt: new Date().toISOString(),
    };
    const hash = encodeShareUrl(exp);
    const url = `${window.location.origin}${window.location.pathname}${hash}`;
    await navigator.clipboard.writeText(url);
    set({ shareUrl: url, statusMessage: "Share link copied!" });
  },
  loadExperiment: (exp) => {
    set({
      points: exp.points,
      seed: exp.seed,
      task: exp.task,
      trainRatio: exp.trainRatio,
      primaryAlgorithm: exp.primaryAlgorithm,
      compareAlgorithms: exp.compareAlgorithms,
      hyperparams: exp.hyperparams,
      experimentName: exp.name,
      models: {},
      timelineIndex: 0,
      statusMessage: `Loaded "${exp.name}"`,
    });
  },
  setStatus: (statusMessage) => set({ statusMessage }),
  setTrainRatio: (trainRatio) => set({ trainRatio, models: {} }),
}));
