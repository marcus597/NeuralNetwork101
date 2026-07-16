import type { LabeledPoint, NormPoint, TreeNode } from "@/engines/interaction/types";

export type TaskType = "classification" | "regression" | "clustering";

export type AlgorithmId =
  | "knn"
  | "linear-regression"
  | "logistic-regression"
  | "decision-tree"
  | "random-forest"
  | "svm"
  | "kmeans"
  | "naive-bayes";

export type HyperparamDef = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
};

export type Hyperparams = Record<string, number>;

export type FitMetrics = {
  trainAccuracy?: number;
  testAccuracy?: number;
  trainMae?: number;
  testMae?: number;
  inferenceMs?: number;
};

export type ThinkStep = {
  id: string;
  label: string;
  /** Partial model state for visualization */
  overlay: Record<string, unknown>;
};

export type AlgorithmModel = {
  algorithmId: AlgorithmId;
  params: Hyperparams;
  steps: ThinkStep[];
  /** Trained state — shape varies by algorithm */
  state: Record<string, unknown>;
  metrics: FitMetrics;
};

export type AlgorithmDefinition = {
  id: AlgorithmId;
  name: string;
  task: TaskType;
  description: string;
  hyperparameters: HyperparamDef[];
  fit: (
    train: LabeledPoint[],
    test: LabeledPoint[],
    params: Hyperparams,
  ) => AlgorithmModel;
  predict: (model: AlgorithmModel, point: NormPoint) => number;
  predictLabel: (model: AlgorithmModel, point: NormPoint) => number;
};

export type { TreeNode };
