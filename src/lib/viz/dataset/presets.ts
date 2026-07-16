import type { LabeledPoint } from "@/engines/interaction/types";
import { createRng } from "@/lib/viz/dataset/generate";

export type DatasetPresetId =
  | "blobs"
  | "moons"
  | "circles"
  | "linear"
  | "imbalanced"
  | "reel";

export type DatasetPreset = {
  id: DatasetPresetId;
  label: string;
  task: "classification" | "regression" | "clustering";
  generate: (seed: number) => LabeledPoint[];
};

function assignSplits(points: LabeledPoint[], trainRatio = 0.75): LabeledPoint[] {
  return points.map((p, i) => ({
    ...p,
    split: i / points.length < trainRatio ? "train" : "test",
  }));
}

export const DATASET_PRESETS: DatasetPreset[] = [
  {
    id: "blobs",
    label: "Two blobs",
    task: "classification",
    generate(seed) {
      const rng = createRng(seed);
      const pts: LabeledPoint[] = [];
      let id = 0;
      for (const [label, cx, cy] of [
        [0, 0.28, 0.65],
        [1, 0.72, 0.35],
      ] as const) {
        for (let i = 0; i < 20; i++) {
          const a = rng() * Math.PI * 2;
          const r = rng() * 0.1;
          pts.push({
            id: `b-${id++}`,
            x: Math.min(0.95, Math.max(0.05, cx + Math.cos(a) * r)),
            y: Math.min(0.95, Math.max(0.05, cy + Math.sin(a) * r)),
            label,
          });
        }
      }
      return assignSplits(pts);
    },
  },
  {
    id: "moons",
    label: "Moons",
    task: "classification",
    generate(seed) {
      const rng = createRng(seed);
      const pts: LabeledPoint[] = [];
      let id = 0;
      for (let i = 0; i < 40; i++) {
        const t = (i / 40) * Math.PI + rng() * 0.15;
        const r = 0.22;
        const x1 = 0.35 + Math.cos(t) * r;
        const y1 = 0.5 + Math.sin(t) * r;
        pts.push({
          id: `m-${id++}`,
          x: x1 + (rng() - 0.5) * 0.04,
          y: y1 + (rng() - 0.5) * 0.04,
          label: 0,
        });
        const x2 = 0.65 - Math.cos(t) * r;
        const y2 = 0.5 - Math.sin(t) * r + 0.08;
        pts.push({
          id: `m-${id++}`,
          x: x2 + (rng() - 0.5) * 0.04,
          y: y2 + (rng() - 0.5) * 0.04,
          label: 1,
        });
      }
      return assignSplits(pts);
    },
  },
  {
    id: "circles",
    label: "Concentric circles",
    task: "classification",
    generate(seed) {
      const rng = createRng(seed);
      const pts: LabeledPoint[] = [];
      let id = 0;
      for (let i = 0; i < 50; i++) {
        const angle = rng() * Math.PI * 2;
        const inner = rng() < 0.5;
        const r = inner ? 0.08 + rng() * 0.05 : 0.18 + rng() * 0.06;
        pts.push({
          id: `c-${id++}`,
          x: 0.5 + Math.cos(angle) * r,
          y: 0.5 + Math.sin(angle) * r,
          label: inner ? 0 : 1,
        });
      }
      return assignSplits(pts);
    },
  },
  {
    id: "linear",
    label: "Linear trend",
    task: "regression",
    generate(seed) {
      const rng = createRng(seed);
      const pts: LabeledPoint[] = [];
      for (let i = 0; i < 24; i++) {
        const x = 0.08 + (i / 23) * 0.84;
        const value = 0.15 + 0.65 * x + (rng() - 0.5) * 0.06;
        pts.push({
          id: `l-${i}`,
          x,
          y: value,
          label: value > 0.5 ? 1 : 0,
          meta: { value },
        });
      }
      return assignSplits(pts);
    },
  },
  {
    id: "imbalanced",
    label: "Imbalanced (90/10)",
    task: "classification",
    generate(seed) {
      const rng = createRng(seed);
      const pts: LabeledPoint[] = [];
      let id = 0;
      for (let i = 0; i < 45; i++) {
        pts.push({
          id: `i-${id++}`,
          x: 0.2 + rng() * 0.25,
          y: 0.55 + rng() * 0.3,
          label: 0,
        });
      }
      for (let i = 0; i < 5; i++) {
        pts.push({
          id: `i-${id++}`,
          x: 0.65 + rng() * 0.25,
          y: 0.2 + rng() * 0.25,
          label: 1,
        });
      }
      return assignSplits(pts);
    },
  },
  {
    id: "reel",
    label: "Reel films",
    task: "classification",
    generate(seed) {
      const rng = createRng(seed);
      const films = [
        { x: 0.2, y: 0.7, label: 0 },
        { x: 0.3, y: 0.55, label: 0 },
        { x: 0.75, y: 0.3, label: 1 },
        { x: 0.8, y: 0.45, label: 1 },
      ];
      const pts: LabeledPoint[] = [];
      let id = 0;
      films.forEach((f) => {
        for (let i = 0; i < 8; i++) {
          pts.push({
            id: `r-${id++}`,
            x: f.x + (rng() - 0.5) * 0.08,
            y: f.y + (rng() - 0.5) * 0.08,
            label: f.label,
          });
        }
      });
      return assignSplits(pts);
    },
  },
];

export function getPreset(id: DatasetPresetId): DatasetPreset {
  return DATASET_PRESETS.find((p) => p.id === id)!;
}

export function generatePreset(id: DatasetPresetId, seed: number): LabeledPoint[] {
  return getPreset(id).generate(seed);
}
