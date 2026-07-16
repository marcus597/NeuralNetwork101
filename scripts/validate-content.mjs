#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { z } from "zod";

const PRESET_IDS = [
  "prediction-game", "data-replay", "feature-forge", "label-lens",
  "regression-training", "train-test-split", "metrics-dashboard", "underfit-rigid",
  "overfit-dial", "bias-variance", "cross-validation", "knn-voronoi",
  "linear-regression", "logistic-boundary", "decision-tree", "random-forest",
  "naive-bayes", "svm-margin", "kmeans-cluster", "gradient-descent",
  "neural-network", "model-arena", "feature-engineering", "pipeline-blocks",
  "deployment-drift", "ethics-bubble",
];

const lessonSchema = z.object({
  id: z.string(),
  slug: z.string(),
  presetId: z.enum(PRESET_IDS),
  phases: z.object({
    quiz: z.object({ steps: z.array(z.unknown()).length(3) }),
  }),
});

const dir = path.join(process.cwd(), "content/lessons");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
let ok = 0;
for (const f of files) {
  const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"));
  lessonSchema.parse(data);
  ok++;
}
if (ok !== 26) throw new Error(`Expected 26 lessons, found ${ok}`);
console.log(`Validated ${ok} lessons.`);
