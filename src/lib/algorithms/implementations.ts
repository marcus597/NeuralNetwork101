import { sigmoid } from "@/lib/ml-math";
import { distance, knnPredict } from "@/lib/viz/distance";
import type { LabeledPoint, NormPoint, TreeNode } from "@/engines/interaction/types";
import type {
  AlgorithmDefinition,
  AlgorithmModel,
  Hyperparams,
  ThinkStep,
} from "./types";
import { accuracy, mae } from "./metrics";

function buildModel(
  id: AlgorithmDefinition["id"],
  params: Hyperparams,
  state: Record<string, unknown>,
  steps: ThinkStep[],
  train: LabeledPoint[],
  test: LabeledPoint[],
  predictFn: (p: NormPoint) => number,
  task: "classification" | "regression",
  inferenceMs: number,
): AlgorithmModel {
  const metrics =
    task === "regression"
      ? {
          trainMae: mae(train, predictFn, (p) => getRegressionTarget(p)),
          testMae: mae(test, predictFn, (p) => getRegressionTarget(p)),
          inferenceMs,
        }
      : {
          trainAccuracy: accuracy(train, predictFn),
          testAccuracy: accuracy(test, predictFn),
          inferenceMs,
        };
  return {
    algorithmId: id,
    params,
    steps,
    state,
    metrics,
  };
}

function getRegressionTarget(p: LabeledPoint): number {
  return typeof p.meta?.value === "number" ? p.meta.value : p.y;
}

export const knnAlgorithm: AlgorithmDefinition = {
  id: "knn",
  name: "K-Nearest Neighbors",
  task: "classification",
  description: "Vote from the K closest points.",
  hyperparameters: [
    { key: "k", label: "K", min: 1, max: 15, step: 1, default: 3 },
  ],
  fit(train, test, params) {
    const t0 = performance.now();
    const k = Math.round(params.k ?? 3);
    const steps: ThinkStep[] = train.slice(0, Math.min(8, train.length)).map((p, i) => ({
      id: `knn-${i}`,
      label: `Highlight neighbors for point ${i + 1}`,
      overlay: { queryId: p.id, k, highlightIndex: i },
    }));
    const state = { train, k };
    const predictFn = (p: NormPoint) =>
      knnPredict(p, train, k);
    return buildModel(
      "knn",
      params,
      state,
      steps,
      train,
      test,
      predictFn,
      "classification",
      performance.now() - t0,
    );
  },
  predict(model, point) {
    const { train, k } = model.state as { train: LabeledPoint[]; k: number };
    return knnPredict(point, train, k);
  },
  predictLabel(model, point) {
    return this.predict(model, point);
  },
};

export const linearRegressionAlgorithm: AlgorithmDefinition = {
  id: "linear-regression",
  name: "Linear Regression",
  task: "regression",
  description: "Best-fit line through points.",
  hyperparameters: [],
  fit(train, test, params) {
    const t0 = performance.now();
    const xs = train.map((p) => p.x);
    const ys = train.map((p) => getRegressionTarget(p));
    const n = xs.length;
    const meanX = xs.reduce((a, b) => a + b, 0) / n;
    const meanY = ys.reduce((a, b) => a + b, 0) / n;
    let num = 0;
    let den = 0;
    for (let i = 0; i < n; i++) {
      num += (xs[i] - meanX) * (ys[i] - meanY);
      den += (xs[i] - meanX) ** 2;
    }
    const slope = den === 0 ? 0 : num / den;
    const intercept = meanY - slope * meanX;
    const steps: ThinkStep[] = Array.from({ length: 12 }, (_, i) => {
      const t = (i + 1) / 12;
      return {
        id: `lr-${i}`,
        label: `Adjusting line (${Math.round(t * 100)}%)`,
        overlay: {
          slope: slope * t + 0.2 * (1 - t),
          intercept: intercept * t + 0.5 * (1 - t),
        },
      };
    });
    const state = { slope, intercept };
    const predictFn = (p: NormPoint) => slope * p.x + intercept;
    return buildModel(
      "linear-regression",
      params,
      state,
      steps,
      train,
      test,
      predictFn,
      "regression",
      performance.now() - t0,
    );
  },
  predict(model, point) {
    const { slope, intercept } = model.state as { slope: number; intercept: number };
    return slope * point.x + intercept;
  },
  predictLabel(model, point) {
    return Math.round(this.predict(model, point));
  },
};

export const logisticRegressionAlgorithm: AlgorithmDefinition = {
  id: "logistic-regression",
  name: "Logistic Regression",
  task: "classification",
  description: "Probability boundary via sigmoid.",
  hyperparameters: [
    { key: "lr", label: "Learning rate", min: 0.01, max: 0.5, step: 0.01, default: 0.1 },
    { key: "iterations", label: "Iterations", min: 10, max: 200, step: 10, default: 80 },
  ],
  fit(train, test, params) {
    const t0 = performance.now();
    const lr = params.lr ?? 0.1;
    const iterations = Math.round(params.iterations ?? 80);
    let w1 = 0;
    let w2 = 0;
    let b = 0;
    const steps: ThinkStep[] = [];
    for (let iter = 0; iter < iterations; iter += 5) {
      for (let j = 0; j < 5 && iter + j < iterations; j++) {
        let dw1 = 0;
        let dw2 = 0;
        let db = 0;
        for (const p of train) {
          const z = w1 * p.x + w2 * p.y + b;
          const pred = sigmoid(z);
          const err = pred - p.label;
          dw1 += err * p.x;
          dw2 += err * p.y;
          db += err;
        }
        const n = train.length || 1;
        w1 -= (lr * dw1) / n;
        w2 -= (lr * dw2) / n;
        b -= (lr * db) / n;
      }
      steps.push({
        id: `log-${iter}`,
        label: `Gradient step ${iter + 5}`,
        overlay: { w1, w2, b },
      });
    }
    const state = { w1, w2, b };
    const predictFn = (p: NormPoint) => {
      const z = w1 * p.x + w2 * p.y + b;
      return sigmoid(z) >= 0.5 ? 1 : 0;
    };
    return buildModel(
      "logistic-regression",
      params,
      state,
      steps,
      train,
      test,
      predictFn,
      "classification",
      performance.now() - t0,
    );
  },
  predict(model, point) {
    const { w1, w2, b } = model.state as { w1: number; w2: number; b: number };
    const z = w1 * point.x + w2 * point.y + b;
    return sigmoid(z);
  },
  predictLabel(model, point) {
    return this.predict(model, point) >= 0.5 ? 1 : 0;
  },
};

function gini(labels: number[]): number {
  if (labels.length === 0) return 0;
  const counts: Record<number, number> = {};
  labels.forEach((l) => {
    counts[l] = (counts[l] ?? 0) + 1;
  });
  let impurity = 1;
  Object.values(counts).forEach((c) => {
    const p = c / labels.length;
    impurity -= p * p;
  });
  return impurity;
}

function buildTree(
  points: LabeledPoint[],
  depth: number,
  maxDepth: number,
  minSplit: number,
  steps: ThinkStep[],
  path = "",
): TreeNode {
  const labels = points.map((p) => p.label);
  const majority =
    labels.sort((a, b) =>
      labels.filter((l) => l === a).length - labels.filter((l) => l === b).length,
    ).pop() ?? 0;

  if (depth >= maxDepth || points.length < minSplit || gini(labels) === 0) {
    return { id: `leaf-${path}`, isLeaf: true, prediction: majority };
  }

  let bestGain = -1;
  let bestFeature: "x" | "y" = "x";
  let bestThreshold = 0.5;

  for (const feature of ["x", "y"] as const) {
    const values = points.map((p) => p[feature]).sort((a, b) => a - b);
    for (let i = 0; i < values.length - 1; i++) {
      const threshold = (values[i] + values[i + 1]) / 2;
      const left = points.filter((p) => p[feature] <= threshold);
      const right = points.filter((p) => p[feature] > threshold);
      if (left.length === 0 || right.length === 0) continue;
      const gain =
        gini(labels) -
        (left.length / points.length) * gini(left.map((p) => p.label)) -
        (right.length / points.length) * gini(right.map((p) => p.label));
      if (gain > bestGain) {
        bestGain = gain;
        bestFeature = feature;
        bestThreshold = threshold;
      }
    }
  }

  if (bestGain <= 0) {
    return { id: `leaf-${path}`, isLeaf: true, prediction: majority };
  }

  const leftPts = points.filter((p) => p[bestFeature] <= bestThreshold);
  const rightPts = points.filter((p) => p[bestFeature] > bestThreshold);

  steps.push({
    id: `split-${path}`,
    label: `Split on ${bestFeature} ≤ ${bestThreshold.toFixed(2)}`,
    overlay: { feature: bestFeature, threshold: bestThreshold, depth },
  });

  return {
    id: `node-${path}`,
    feature: bestFeature,
    threshold: bestThreshold,
    isLeaf: false,
    left: buildTree(leftPts, depth + 1, maxDepth, minSplit, steps, `${path}L`),
    right: buildTree(rightPts, depth + 1, maxDepth, minSplit, steps, `${path}R`),
  };
}

function predictTree(node: TreeNode, p: NormPoint): number {
  if (node.isLeaf || node.prediction !== undefined) return node.prediction ?? 0;
  const val = node.feature === "x" ? p.x : p.y;
  if (val <= (node.threshold ?? 0)) {
    return node.left ? predictTree(node.left, p) : 0;
  }
  return node.right ? predictTree(node.right, p) : 0;
}

export const decisionTreeAlgorithm: AlgorithmDefinition = {
  id: "decision-tree",
  name: "Decision Tree",
  task: "classification",
  description: "Ask yes/no questions to classify.",
  hyperparameters: [
    { key: "maxDepth", label: "Max depth", min: 1, max: 8, step: 1, default: 4 },
    { key: "minSplit", label: "Min split", min: 2, max: 10, step: 1, default: 3 },
  ],
  fit(train, test, params) {
    const t0 = performance.now();
    const maxDepth = Math.round(params.maxDepth ?? 4);
    const minSplit = Math.round(params.minSplit ?? 3);
    const steps: ThinkStep[] = [];
    const tree = buildTree(train, 0, maxDepth, minSplit, steps);
    const state = { tree, activeSplit: steps.length - 1 };
    const predictFn = (p: NormPoint) => predictTree(tree, p);
    return buildModel(
      "decision-tree",
      params,
      state,
      steps,
      train,
      test,
      predictFn,
      "classification",
      performance.now() - t0,
    );
  },
  predict(model, point) {
    const { tree } = model.state as { tree: TreeNode };
    return predictTree(tree, point);
  },
  predictLabel(model, point) {
    return this.predict(model, point);
  },
};

export const randomForestAlgorithm: AlgorithmDefinition = {
  id: "random-forest",
  name: "Random Forest",
  task: "classification",
  description: "Many trees vote together.",
  hyperparameters: [
    { key: "nTrees", label: "Trees", min: 3, max: 25, step: 1, default: 9 },
    { key: "maxDepth", label: "Max depth", min: 2, max: 6, step: 1, default: 3 },
  ],
  fit(train, test, params) {
    const t0 = performance.now();
    const nTrees = Math.round(params.nTrees ?? 9);
    const maxDepth = Math.round(params.maxDepth ?? 3);
    const trees: TreeNode[] = [];
    const steps: ThinkStep[] = [];
    const rng = (i: number) => {
      const subset = train.filter((_, idx) => (idx + i * 7) % 3 !== 0 || idx % 2 === i % 2);
      const sample = subset.length >= 3 ? subset : train;
      return sample;
    };
    for (let i = 0; i < nTrees; i++) {
      const subSteps: ThinkStep[] = [];
      const tree = buildTree(rng(i), 0, maxDepth, 2, subSteps);
      trees.push(tree);
      steps.push({
        id: `rf-${i}`,
        label: `Tree ${i + 1} votes`,
        overlay: { treeIndex: i, trees: trees.length },
      });
    }
    const state = { trees };
    const predictFn = (p: NormPoint) => {
      const votes = trees.map((t) => predictTree(t, p));
      const counts: Record<number, number> = {};
      votes.forEach((v) => {
        counts[v] = (counts[v] ?? 0) + 1;
      });
      return Number(Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 0);
    };
    return buildModel(
      "random-forest",
      params,
      state,
      steps,
      train,
      test,
      predictFn,
      "classification",
      performance.now() - t0,
    );
  },
  predict(model, point) {
    return this.predictLabel(model, point);
  },
  predictLabel(model, point) {
    const { trees } = model.state as { trees: TreeNode[] };
    const votes = trees.map((t) => predictTree(t, point));
    const counts: Record<number, number> = {};
    votes.forEach((v) => {
      counts[v] = (counts[v] ?? 0) + 1;
    });
    return Number(Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 0);
  },
};

export const svmAlgorithm: AlgorithmDefinition = {
  id: "svm",
  name: "SVM",
  task: "classification",
  description: "Widest margin between classes.",
  hyperparameters: [
    { key: "C", label: "C (regularization)", min: 0.1, max: 5, step: 0.1, default: 1 },
  ],
  fit(train, test, params) {
    const t0 = performance.now();
    const class0 = train.filter((p) => p.label === 0);
    const class1 = train.filter((p) => p.label === 1);
    const c0 = {
      x: class0.reduce((s, p) => s + p.x, 0) / (class0.length || 1),
      y: class0.reduce((s, p) => s + p.y, 0) / (class0.length || 1),
    };
    const c1 = {
      x: class1.reduce((s, p) => s + p.x, 0) / (class1.length || 1),
      y: class1.reduce((s, p) => s + p.y, 0) / (class1.length || 1),
    };
    const mx = (c0.x + c1.x) / 2;
    const my = (c0.y + c1.y) / 2;
    const angle = Math.atan2(c1.y - c0.y, c1.x - c0.x) + Math.PI / 2;
    const offset = -(Math.cos(angle) * mx + Math.sin(angle) * my);
    const margin = distance(c0, c1) / 2;
    const steps: ThinkStep[] = [
      { id: "svm-1", label: "Find class centroids", overlay: { c0, c1 } },
      { id: "svm-2", label: "Maximize margin", overlay: { angle, offset, margin } },
    ];
    const state = { angle, offset, margin, c0, c1, supportVectors: [
      ...class0.slice(0, 2),
      ...class1.slice(0, 2),
    ] };
    const predictFn = (p: NormPoint) => {
      const v = Math.cos(angle) * p.x + Math.sin(angle) * p.y + offset;
      return v >= 0 ? 1 : 0;
    };
    return buildModel(
      "svm",
      params,
      state,
      steps,
      train,
      test,
      predictFn,
      "classification",
      performance.now() - t0,
    );
  },
  predict(model, point) {
    const { angle, offset } = model.state as { angle: number; offset: number };
    const v = Math.cos(angle) * point.x + Math.sin(angle) * point.y + offset;
    return v >= 0 ? 1 : 0;
  },
  predictLabel(model, point) {
    return this.predict(model, point);
  },
};

export const kmeansAlgorithm: AlgorithmDefinition = {
  id: "kmeans",
  name: "K-Means",
  task: "clustering",
  description: "Find K group centroids.",
  hyperparameters: [
    { key: "k", label: "Clusters K", min: 2, max: 8, step: 1, default: 3 },
    { key: "iterations", label: "Iterations", min: 1, max: 20, step: 1, default: 10 },
  ],
  fit(train, test, params) {
    const t0 = performance.now();
    const k = Math.round(params.k ?? 3);
    const maxIter = Math.round(params.iterations ?? 10);
    const points = train;
    let centroids = Array.from({ length: k }, (_, i) => ({
      x: 0.2 + (i / k) * 0.6,
      y: 0.3 + (i % 2) * 0.3,
    }));
    const steps: ThinkStep[] = [];
    let assignments: number[] = points.map(() => 0);

    for (let iter = 0; iter < maxIter; iter++) {
      assignments = points.map((p) => {
        let best = 0;
        let bestD = Infinity;
        centroids.forEach((c, ci) => {
          const d = distance(p, c);
          if (d < bestD) {
            bestD = d;
            best = ci;
          }
        });
        return best;
      });
      const next = centroids.map((c, ci) => {
        const cluster = points.filter((_, i) => assignments[i] === ci);
        if (cluster.length === 0) return c;
        return {
          x: cluster.reduce((s, p) => s + p.x, 0) / cluster.length,
          y: cluster.reduce((s, p) => s + p.y, 0) / cluster.length,
        };
      });
      centroids = next;
      steps.push({
        id: `km-${iter}`,
        label: `Iteration ${iter + 1}: reassign & move centroids`,
        overlay: { centroids: [...centroids], assignments: [...assignments] },
      });
    }

    const state = { centroids, assignments };
    const predictFn = (p: NormPoint) => {
      let best = 0;
      let bestD = Infinity;
      centroids.forEach((c, ci) => {
        const d = distance(p, c);
        if (d < bestD) {
          bestD = d;
          best = ci;
        }
      });
      return best;
    };
    return buildModel(
      "kmeans",
      params,
      state,
      steps,
      train,
      test,
      predictFn,
      "classification",
      performance.now() - t0,
    );
  },
  predict(model, point) {
    const { centroids } = model.state as {
      centroids: NormPoint[];
    };
    let best = 0;
    let bestD = Infinity;
    centroids.forEach((c, ci) => {
      const d = distance(point, c);
      if (d < bestD) {
        bestD = d;
        best = ci;
      }
    });
    return best;
  },
  predictLabel(model, point) {
    return this.predict(model, point);
  },
};

export const naiveBayesAlgorithm: AlgorithmDefinition = {
  id: "naive-bayes",
  name: "Naive Bayes",
  task: "classification",
  description: "Independent feature probabilities.",
  hyperparameters: [
    { key: "smoothing", label: "Laplace smoothing", min: 0.01, max: 2, step: 0.01, default: 0.1 },
  ],
  fit(train, test, params) {
    const t0 = performance.now();
    const smoothing = params.smoothing ?? 0.1;
    const classes = [0, 1];
    const stats: Record<number, { mx: number; my: number; vx: number; vy: number; count: number }> = {};

    classes.forEach((c) => {
      const pts = train.filter((p) => p.label === c);
      const mx = pts.reduce((s, p) => s + p.x, 0) / (pts.length || 1);
      const my = pts.reduce((s, p) => s + p.y, 0) / (pts.length || 1);
      const vx =
        pts.reduce((s, p) => s + (p.x - mx) ** 2, 0) / (pts.length || 1) + smoothing;
      const vy =
        pts.reduce((s, p) => s + (p.y - my) ** 2, 0) / (pts.length || 1) + smoothing;
      stats[c] = { mx, my, vx, vy, count: pts.length };
    });

    const total = train.length || 1;
    const priors = {
      0: (stats[0].count + smoothing) / (total + smoothing * 2),
      1: (stats[1].count + smoothing) / (total + smoothing * 2),
    };

    const steps: ThinkStep[] = classes.map((c) => ({
      id: `nb-${c}`,
      label: `Fit class ${c} distribution`,
      overlay: { class: c, ...stats[c] },
    }));

    const state = { stats, priors, smoothing };
    const gaussian = (x: number, mean: number, var_: number) =>
      Math.exp(-0.5 * ((x - mean) ** 2) / var_) / Math.sqrt(2 * Math.PI * var_);

    const predictFn = (p: NormPoint) => {
      const scores = classes.map((c) => {
        const s = stats[c];
        return (
          Math.log(priors[c as 0 | 1]) +
          Math.log(gaussian(p.x, s.mx, s.vx)) +
          Math.log(gaussian(p.y, s.my, s.vy))
        );
      });
      return scores[1] > scores[0] ? 1 : 0;
    };

    return buildModel(
      "naive-bayes",
      params,
      state,
      steps,
      train,
      test,
      predictFn,
      "classification",
      performance.now() - t0,
    );
  },
  predict(model, point) {
    return this.predictLabel(model, point);
  },
  predictLabel(model, point) {
    const { stats, priors } = model.state as {
      stats: Record<number, { mx: number; my: number; vx: number; vy: number }>;
      priors: Record<number, number>;
    };
    const gaussian = (x: number, mean: number, var_: number) =>
      Math.exp(-0.5 * ((x - mean) ** 2) / var_) / Math.sqrt(2 * Math.PI * var_);
    const s0 =
      Math.log(priors[0]) +
      Math.log(gaussian(point.x, stats[0].mx, stats[0].vx)) +
      Math.log(gaussian(point.y, stats[0].my, stats[0].vy));
    const s1 =
      Math.log(priors[1]) +
      Math.log(gaussian(point.x, stats[1].mx, stats[1].vx)) +
      Math.log(gaussian(point.y, stats[1].my, stats[1].vy));
    return s1 > s0 ? 1 : 0;
  },
};
