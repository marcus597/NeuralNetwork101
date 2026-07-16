import type { AlgorithmDefinition } from "./types";
import {
  decisionTreeAlgorithm,
  kmeansAlgorithm,
  knnAlgorithm,
  linearRegressionAlgorithm,
  logisticRegressionAlgorithm,
  naiveBayesAlgorithm,
  randomForestAlgorithm,
  svmAlgorithm,
} from "./implementations";

export const ALGORITHM_REGISTRY: Record<
  AlgorithmDefinition["id"],
  AlgorithmDefinition
> = {
  knn: knnAlgorithm,
  "linear-regression": linearRegressionAlgorithm,
  "logistic-regression": logisticRegressionAlgorithm,
  "decision-tree": decisionTreeAlgorithm,
  "random-forest": randomForestAlgorithm,
  svm: svmAlgorithm,
  kmeans: kmeansAlgorithm,
  "naive-bayes": naiveBayesAlgorithm,
};

export const ALGORITHM_LIST = Object.values(ALGORITHM_REGISTRY);

export function getAlgorithm(id: AlgorithmDefinition["id"]): AlgorithmDefinition {
  return ALGORITHM_REGISTRY[id];
}

export function defaultHyperparams(id: AlgorithmDefinition["id"]): Record<string, number> {
  const algo = getAlgorithm(id);
  return Object.fromEntries(
    algo.hyperparameters.map((h) => [h.key, h.default]),
  );
}

/** Register a new algorithm — step 3 for adding #9 */
export function registerAlgorithm(def: AlgorithmDefinition): void {
  ALGORITHM_REGISTRY[def.id] = def;
}

export type { AlgorithmDefinition, AlgorithmId, AlgorithmModel } from "./types";
export { defaultHyperparams as getDefaultHyperparams };
