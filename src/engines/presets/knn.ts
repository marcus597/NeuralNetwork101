import type { LabeledPoint, NormPoint } from "@/engines/interaction/types";
import { distance, knnPredict } from "@/lib/viz/distance";
import { generateClassificationDataset } from "@/lib/viz/dataset/generate";
import { Canvas2D } from "@/engines/visualization/Canvas2D";
import { drawPointLayer } from "@/engines/visualization/layers/point-layer";
import { drawKnnOverlay } from "@/engines/visualization/layers/prediction-overlay";
import type { SimSnapshot } from "@/engines/interaction/types";

export type KnnSimState = {
  points: LabeledPoint[];
  query: NormPoint;
  k: number;
};

export function createKnnState(k = 3): KnnSimState {
  return {
    points: generateClassificationDataset({ seed: 11, trainCount: 16, hiddenCount: 0 }),
    query: { x: 0.5, y: 0.5 },
    k,
  };
}

export function drawKnnSim(canvas: Canvas2D, state: KnnSimState): void {
  canvas.clear();
  drawPointLayer(canvas, { points: state.points });
  const neighbors = state.points
    .map((p) => ({ ...p, dist: distance(state.query, p) }))
    .sort((a, b) => a.dist - b.dist);
  drawKnnOverlay(canvas, {
    query: state.query,
    neighbors,
    k: state.k,
  });
}

export function knnSnapshot(state: KnnSimState): SimSnapshot {
  const pred = knnPredict(state.query, state.points, state.k);
  return {
    presetId: "knn",
    params: { k: state.k, queryX: state.query.x, queryY: state.query.y },
    metrics: { prediction: pred },
    flags: {},
  };
}
