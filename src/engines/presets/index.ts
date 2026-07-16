export type PresetId =
  | "classification"
  | "regression-training"
  | "overfit"
  | "knn"
  | "decision-tree"
  | "kmeans";

export const PRESET_IDS: PresetId[] = [
  "classification",
  "regression-training",
  "overfit",
  "knn",
  "decision-tree",
];

export { createClassificationState, drawClassificationSim, classificationPointer, classificationSnapshot, classificationAccuracy, resetClassificationState } from "./classification";
export type { ClassificationSimState } from "./classification";

export { createRegressionTrainingState, drawRegressionTrainingSim, regressionTrainingStep, regressionTrainingPointerDown, regressionTrainingPointerMove, regressionTrainingPointerUp, regressionTrainingSnapshot } from "./regression-training";
export type { RegressionTrainingState } from "./regression-training";

export { createOverfitState, drawOverfitSim, overfitSnapshot } from "./overfit";
export type { OverfitSimState } from "./overfit";

export { createKnnState, drawKnnSim, knnSnapshot } from "./knn";
export type { KnnSimState } from "./knn";

export { createTreeState, drawTreeSim, treeSnapshot, sampleTree } from "./decision-tree";
export type { TreeSimState } from "./decision-tree";
