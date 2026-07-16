import { describe, expect, it } from "vitest";
import {
  generateClassificationDataset,
  generateClusterDataset,
  generateRegressionDataset,
  createRng,
} from "@/lib/viz/dataset/generate";
import { distance, knnPredict } from "@/lib/viz/distance";
import { TimelineEngine } from "@/engines/interaction/TimelineEngine";
import { regressionLoss, gradientDescentStep } from "@/lib/viz/training";
import { predictLinearBoundary } from "@/engines/visualization/layers/decision-boundary-layer";

describe("dataset generation", () => {
  it("produces reproducible classification data with seed", () => {
    const a = generateClassificationDataset({ seed: 1, trainCount: 8, hiddenCount: 4 });
    const b = generateClassificationDataset({ seed: 1, trainCount: 8, hiddenCount: 4 });
    expect(a).toEqual(b);
    expect(a.filter((p) => p.split === "train")).toHaveLength(8);
    expect(a.filter((p) => p.split === "hidden")).toHaveLength(4);
  });

  it("generates regression points", () => {
    const pts = generateRegressionDataset({ count: 5, seed: 3 });
    expect(pts).toHaveLength(5);
  });

  it("generates cluster data", () => {
    const pts = generateClusterDataset({ k: 3, pointsPerCluster: 10, seed: 5 });
    expect(pts).toHaveLength(30);
  });

  it("rng is deterministic", () => {
    const r1 = createRng(99);
    const r2 = createRng(99);
    expect(r1()).toBe(r2());
  });
});

describe("distance & knn", () => {
  const points = [
    { x: 0, y: 0, label: 0 },
    { x: 1, y: 1, label: 1 },
    { x: 0.1, y: 0.1, label: 0 },
  ];

  it("computes euclidean distance", () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });

  it("predicts via majority vote", () => {
    expect(knnPredict({ x: 0.05, y: 0.05 }, points, 2)).toBe(0);
  });
});

describe("TimelineEngine", () => {
  it("steps forward and rewinds", () => {
    const engine = new TimelineEngine([
      { id: "a", state: { v: 1 } },
      { id: "b", state: { v: 2 } },
      { id: "c", state: { v: 3 } },
    ]);
    expect(engine.getState().currentIndex).toBe(0);
    engine.stepForward();
    expect(engine.getState().currentIndex).toBe(1);
    engine.rewind();
    expect(engine.getState().currentIndex).toBe(0);
    engine.destroy();
  });
});

describe("training", () => {
  it("reduces loss with gradient descent", () => {
    const points = generateRegressionDataset({ count: 5, seed: 1 });
    const before = regressionLoss(points, 0.2, 0.5);
    const after = gradientDescentStep(points, 0.2, 0.5, 0.1);
    expect(after.loss).toBeLessThanOrEqual(before);
  });
});

describe("classification boundary", () => {
  it("predicts sides consistently", () => {
    const b = { angle: 0, offset: -0.5 };
    expect(predictLinearBoundary(0.8, 0.8, b)).toBe(1);
    expect(predictLinearBoundary(0.1, 0.1, b)).toBe(0);
  });
});
