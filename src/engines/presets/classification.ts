import type { LabeledPoint, SimSnapshot } from "@/engines/interaction/types";
import { DatasetManager } from "@/lib/viz/dataset/DatasetManager";
import { generateClassificationDataset } from "@/lib/viz/dataset/generate";
import { Canvas2D } from "@/engines/visualization/Canvas2D";
import {
  boundaryFromPointer,
  drawDecisionBoundaryLayer,
  predictLinearBoundary,
} from "@/engines/visualization/layers/decision-boundary-layer";
import {
  drawPointLayer,
} from "@/engines/visualization/layers/point-layer";
import type { PointerEventNorm } from "@/engines/interaction/types";

export type ClassificationSimState = {
  dataset: DatasetManager;
  boundary: { angle: number; offset: number };
  revealHidden: boolean;
  hasDragged: boolean;
  pulseWrong: number;
  dragIndex: number | null;
};

export function createClassificationState(
  revealHiddenDefault = false,
): ClassificationSimState {
  const points = generateClassificationDataset({
    seed: 42,
    trainCount: 8,
    hiddenCount: 4,
  });
  return {
    dataset: new DatasetManager(points),
    boundary: { angle: -0.55, offset: -0.02 },
    revealHidden: revealHiddenDefault,
    hasDragged: false,
    pulseWrong: 0,
    dragIndex: null,
  };
}

export function classificationAccuracy(
  points: LabeledPoint[],
  boundary: { angle: number; offset: number },
): number {
  if (points.length === 0) return 0;
  const correct = points.filter(
    (p) => predictLinearBoundary(p.x, p.y, boundary) === p.label,
  ).length;
  return correct / points.length;
}

export function drawClassificationSim(
  canvas: Canvas2D,
  state: ClassificationSimState,
): void {
  canvas.clear();
  drawDecisionBoundaryLayer(canvas, {
    ...state.boundary,
    showHandle: true,
    showRegions: true,
  });
  const visible = state.dataset.visible(state.revealHidden);
  drawPointLayer(canvas, {
    points: visible,
    predict: (p) => predictLinearBoundary(p.x, p.y, state.boundary),
    showPrediction: state.hasDragged,
    pulseWrong: state.pulseWrong,
    dragIndex: state.dragIndex,
  });
}

export function classificationPointer(
  state: ClassificationSimState,
  event: PointerEventNorm,
): ClassificationSimState {
  const boundary = boundaryFromPointer(event.x, event.y);
  return {
    ...state,
    boundary,
    hasDragged: true,
    pulseWrong: 1,
  };
}

export function classificationSnapshot(
  state: ClassificationSimState,
): SimSnapshot {
  const train = state.dataset.train();
  const hidden = state.dataset.hidden();
  return {
    presetId: "classification",
    params: {
      angle: state.boundary.angle,
      offset: state.boundary.offset,
      revealHidden: state.revealHidden,
    },
    metrics: {
      trainAccuracy: classificationAccuracy(train, state.boundary),
      hiddenAccuracy: state.revealHidden
        ? classificationAccuracy(hidden, state.boundary)
        : -1,
    },
    flags: {
      hasDragged: state.hasDragged,
      locked: state.hasDragged && !state.revealHidden,
    },
  };
}

export function resetClassificationState(
  revealHiddenDefault = false,
): ClassificationSimState {
  return createClassificationState(revealHiddenDefault);
}
