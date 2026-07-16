import { describe, it, expect } from "vitest";
import {
  serializeExperiment,
  decodeShareHash,
  encodeShareUrl,
  EXPERIMENT_SCHEMA_VERSION,
} from "@/lib/playground/experiment";
import type { PlaygroundExperiment } from "@/lib/playground/experiment";
import { knnPredict } from "@/lib/viz/distance";
import { ALGORITHM_REGISTRY } from "@/lib/algorithms/registry";
import { generatePreset } from "@/lib/viz/dataset/presets";

describe("experiment codec", () => {
  const sample: PlaygroundExperiment = {
    v: EXPERIMENT_SCHEMA_VERSION,
    name: "Test",
    seed: 42,
    task: "classification",
    points: generatePreset("blobs", 42).slice(0, 5),
    trainRatio: 0.75,
    primaryAlgorithm: "knn",
    compareAlgorithms: ["svm"],
    hyperparams: {
      knn: { k: 3 },
      svm: { C: 1 },
    },
    createdAt: new Date().toISOString(),
  };

  it("roundtrips share hash", () => {
    const hash = encodeShareUrl(sample);
    const decoded = decodeShareHash(hash);
    expect(decoded?.name).toBe("Test");
    expect(decoded?.points.length).toBe(5);
    expect(decoded?.primaryAlgorithm).toBe("knn");
  });

  it("serializes JSON", () => {
    const json = serializeExperiment(sample);
    const parsed = JSON.parse(json) as PlaygroundExperiment;
    expect(parsed.v).toBe(1);
  });
});

describe("knn", () => {
  it("predicts majority label", () => {
    const points = [
      { x: 0, y: 0, label: 0 },
      { x: 0.1, y: 0, label: 0 },
      { x: 1, y: 1, label: 1 },
    ];
    expect(knnPredict({ x: 0.05, y: 0.05 }, points, 2)).toBe(0);
  });
});

describe("algorithms", () => {
  it("trains knn on blob data", () => {
    const points = generatePreset("blobs", 1);
    const train = points.filter((p) => p.split !== "test");
    const test = points.filter((p) => p.split === "test");
    const model = ALGORITHM_REGISTRY.knn.fit(train, test, { k: 3 });
    expect(model.metrics.trainAccuracy).toBeGreaterThan(0);
    expect(model.steps.length).toBeGreaterThan(0);
  });

  it("trains kmeans with steps", () => {
    const points = generatePreset("blobs", 2);
    const model = ALGORITHM_REGISTRY.kmeans.fit(points, [], { k: 2, iterations: 5 });
    expect(model.steps.length).toBe(5);
  });
});
