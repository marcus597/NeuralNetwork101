import type { SimSnapshot } from "@/engines/interaction/types";
import { Canvas2D } from "@/engines/visualization/Canvas2D";
import { drawPointLayer, hitTestPointNorm } from "@/engines/visualization/layers/point-layer";
import { drawRegressionLine } from "@/engines/visualization/layers/curve-layer";
import { drawLossLayer } from "@/engines/visualization/layers/loss-layer";
import {
  generateRegressionDataset,
} from "@/lib/viz/dataset/generate";
import {
  gradientDescentStep,
  regressionLoss,
  type RegressionPoint,
} from "@/lib/viz/training";
import type { PointerEventNorm } from "@/engines/interaction/types";

export type RegressionTrainingState = {
  points: RegressionPoint[];
  slope: number;
  intercept: number;
  lr: number;
  step: number;
  lossHistory: number[];
  dragIndex: number | null;
};

export function createRegressionTrainingState(): RegressionTrainingState {
  return {
    points: generateRegressionDataset({ seed: 7, count: 5 }),
    slope: 0.2,
    intercept: 0.5,
    lr: 0.08,
    step: 0,
    lossHistory: [],
    dragIndex: null,
  };
}

export function drawRegressionTrainingSim(
  canvas: Canvas2D,
  state: RegressionTrainingState,
): void {
  canvas.clear();
  const loss = regressionLoss(state.points, state.slope, state.intercept);
  drawLossLayer(canvas, { history: state.lossHistory, current: loss });
  drawRegressionLine(canvas, {
    slope: state.slope,
    intercept: state.intercept,
    unstable: state.lr > 0.25,
  });
  drawPointLayer(canvas, {
    points: state.points.map((p) => ({
      id: p.id,
      x: p.x,
      y: p.y,
      label: 0,
      split: "train" as const,
    })),
    radius: state.dragIndex !== null ? 10 : 8,
    dragIndex: state.dragIndex,
  });
}

export function regressionTrainingStep(
  state: RegressionTrainingState,
): RegressionTrainingState {
  const next = gradientDescentStep(
    state.points,
    state.slope,
    state.intercept,
    state.lr,
  );
  return {
    ...state,
    slope: next.slope,
    intercept: next.intercept,
    step: state.step + 1,
    lossHistory: [...state.lossHistory.slice(-39), next.loss],
  };
}

export function regressionTrainingPointerDown(
  state: RegressionTrainingState,
  event: PointerEventNorm,
): RegressionTrainingState {
  const yUp = 1 - event.y;
  const idx = hitTestPointNorm(state.points, event.x, yUp);
  if (idx >= 0) return { ...state, dragIndex: idx };
  return state;
}

export function regressionTrainingPointerMove(
  state: RegressionTrainingState,
  event: PointerEventNorm,
): RegressionTrainingState {
  if (state.dragIndex === null) return state;
  const x = Math.min(0.95, Math.max(0.05, event.x));
  const y = Math.min(0.92, Math.max(0.08, 1 - event.y));
  const points = state.points.map((p, i) =>
    i === state.dragIndex ? { ...p, x, y } : p,
  );
  return { ...state, points };
}

export function regressionTrainingPointerUp(
  state: RegressionTrainingState,
): RegressionTrainingState {
  return { ...state, dragIndex: null };
}

export function regressionTrainingSnapshot(
  state: RegressionTrainingState,
): SimSnapshot {
  const loss = regressionLoss(state.points, state.slope, state.intercept);
  return {
    presetId: "regression-training",
    params: { slope: state.slope, intercept: state.intercept, lr: state.lr },
    metrics: { loss, step: state.step },
    flags: { unstable: state.lr > 0.25 },
  };
}
