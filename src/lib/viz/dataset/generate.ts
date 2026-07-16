import type { LabeledPoint } from "@/engines/interaction/types";

/** Seeded PRNG (mulberry32) for reproducible datasets. */
export function createRng(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export type ClassificationDatasetConfig = {
  seed?: number;
  trainCount?: number;
  testCount?: number;
  hiddenCount?: number;
  separation?: number;
  noise?: number;
};

export function generateClassificationDataset(
  config: ClassificationDatasetConfig = {},
): LabeledPoint[] {
  const {
    seed = 42,
    trainCount = 8,
    testCount = 0,
    hiddenCount = 4,
    separation = 0.35,
    noise = 0.06,
  } = config;
  const rng = createRng(seed);
  const points: LabeledPoint[] = [];
  let id = 0;

  const addCluster = (
    cx: number,
    cy: number,
    label: number,
    count: number,
    split: LabeledPoint["split"],
  ) => {
    for (let i = 0; i < count; i++) {
      const angle = rng() * Math.PI * 2;
      const r = rng() * noise;
      points.push({
        id: `p-${id++}`,
        x: Math.min(0.95, Math.max(0.05, cx + Math.cos(angle) * r)),
        y: Math.min(0.95, Math.max(0.05, cy + Math.sin(angle) * r)),
        label,
        split,
      });
    }
  };

  addCluster(0.25, 0.7, 0, Math.floor(trainCount / 2), "train");
  addCluster(0.75, 0.3, 1, Math.ceil(trainCount / 2), "train");
  addCluster(0.5, 0.5, 0, Math.floor(hiddenCount / 2), "hidden");
  addCluster(0.52, 0.48, 1, Math.ceil(hiddenCount / 2), "hidden");

  if (testCount > 0) {
    addCluster(0.25 + separation * 0.1, 0.65, 0, testCount / 2, "test");
    addCluster(0.75 - separation * 0.1, 0.35, 1, Math.ceil(testCount / 2), "test");
  }

  return points;
}

export type RegressionDatasetConfig = {
  seed?: number;
  count?: number;
  slope?: number;
  intercept?: number;
  noise?: number;
};

export function generateRegressionDataset(
  config: RegressionDatasetConfig = {},
): { x: number; y: number; id: string }[] {
  const {
    seed = 7,
    count = 8,
    slope = 0.65,
    intercept = 0.2,
    noise = 0.04,
  } = config;
  const rng = createRng(seed);
  return Array.from({ length: count }, (_, i) => {
    const x = 0.08 + (i / (count - 1)) * 0.84;
    const y =
      slope * x +
      intercept +
      (rng() - 0.5) * noise;
    return { id: `r-${i}`, x, y: Math.min(0.92, Math.max(0.08, y)) };
  });
}

export type ClusterDatasetConfig = {
  seed?: number;
  k?: number;
  pointsPerCluster?: number;
};

export function generateClusterDataset(
  config: ClusterDatasetConfig = {},
): LabeledPoint[] {
  const { seed = 99, k = 3, pointsPerCluster = 12 } = config;
  const rng = createRng(seed);
  const centroids = Array.from({ length: k }, (_, i) => ({
    x: 0.2 + (i / (k - 1 || 1)) * 0.6,
    y: 0.25 + rng() * 0.5,
  }));

  const points: LabeledPoint[] = [];
  let id = 0;
  centroids.forEach((c, label) => {
    for (let i = 0; i < pointsPerCluster; i++) {
      const angle = rng() * Math.PI * 2;
      const r = rng() * 0.08;
      points.push({
        id: `c-${id++}`,
        x: c.x + Math.cos(angle) * r,
        y: c.y + Math.sin(angle) * r,
        label,
        split: "train",
      });
    }
  });
  return points;
}
