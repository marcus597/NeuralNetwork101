#!/usr/bin/env node
/**
 * Generates all 26 lesson JSON files + manifest for Wonder curriculum.
 */
import fs from "fs";
import path from "path";

const ROOT = path.join(process.cwd(), "content");
const LESSONS = path.join(ROOT, "lessons");

const SLUGS = [
  { id: "0.1", slug: "prediction-game", module: "world", moduleTitle: "The World", title: "The Prediction Game", kicker: "Introduction", presetId: "prediction-game" },
  { id: "0.2", slug: "data", module: "world", moduleTitle: "The World", title: "What Counts as Data?", kicker: "Data", presetId: "data-replay" },
  { id: "0.3", slug: "features", module: "world", moduleTitle: "The World", title: "What We Measure", kicker: "Features", presetId: "feature-forge" },
  { id: "0.4", slug: "labels", module: "world", moduleTitle: "The World", title: "What We Predict", kicker: "Labels", presetId: "label-lens" },
  { id: "1.1", slug: "training", module: "evaluation", moduleTitle: "Honest Evaluation", title: "The Practice Test", kicker: "Training", presetId: "regression-training" },
  { id: "1.2", slug: "testing", module: "evaluation", moduleTitle: "Honest Evaluation", title: "The Blind Taste Test", kicker: "Testing", presetId: "train-test-split", presetConfig: { variant: "train-test" } },
  { id: "1.3", slug: "evaluation-metrics", module: "evaluation", moduleTitle: "Honest Evaluation", title: "How Wrong Are We?", kicker: "Metrics", presetId: "metrics-dashboard" },
  { id: "2.1", slug: "underfitting", module: "fit", moduleTitle: "The Fit Tension", title: "Too Simple", kicker: "Underfitting", presetId: "underfit-rigid", presetConfig: { variant: "underfit" } },
  { id: "2.2", slug: "overfitting", module: "fit", moduleTitle: "The Fit Tension", title: "Too Eager", kicker: "Overfitting", presetId: "overfit-dial" },
  { id: "2.3", slug: "bias-variance", module: "fit", moduleTitle: "The Fit Tension", title: "The Tug-of-War", kicker: "Bias & Variance", presetId: "bias-variance" },
  { id: "2.4", slug: "cross-validation", module: "fit", moduleTitle: "The Fit Tension", title: "Many Small Exams", kicker: "Cross Validation", presetId: "cross-validation" },
  { id: "3.1", slug: "knn", module: "toolbox", moduleTitle: "Your First Toolbox", title: "Ask the Neighbors", kicker: "KNN", presetId: "knn-voronoi" },
  { id: "3.2", slug: "linear-regression", module: "toolbox", moduleTitle: "Your First Toolbox", title: "Draw the Trend Line", kicker: "Linear Regression", presetId: "linear-regression" },
  { id: "3.3", slug: "logistic-regression", module: "toolbox", moduleTitle: "Your First Toolbox", title: "Draw the Boundary", kicker: "Logistic Regression", presetId: "logistic-boundary" },
  { id: "3.4", slug: "decision-trees", module: "toolbox", moduleTitle: "Your First Toolbox", title: "Twenty Questions", kicker: "Decision Trees", presetId: "decision-tree" },
  { id: "3.5", slug: "random-forests", module: "toolbox", moduleTitle: "Your First Toolbox", title: "The Committee", kicker: "Random Forests", presetId: "random-forest" },
  { id: "3.6", slug: "naive-bayes", module: "toolbox", moduleTitle: "Your First Toolbox", title: "Words as Evidence", kicker: "Naive Bayes", presetId: "naive-bayes" },
  { id: "4.1", slug: "svm", module: "geometry", moduleTitle: "Geometry & Groups", title: "The Widest Street", kicker: "SVM", presetId: "svm-margin" },
  { id: "4.2", slug: "kmeans", module: "geometry", moduleTitle: "Geometry & Groups", title: "Find the Tribes", kicker: "KMeans", presetId: "kmeans-cluster" },
  { id: "5.1", slug: "gradient-descent", module: "engine", moduleTitle: "The Engine Room", title: "Walking Downhill", kicker: "Gradient Descent", presetId: "gradient-descent" },
  { id: "5.2", slug: "neural-networks", module: "engine", moduleTitle: "The Engine Room", title: "Stacks of Neurons", kicker: "Neural Networks", presetId: "neural-network" },
  { id: "6.1", slug: "model-selection", module: "production", moduleTitle: "Making It Real", title: "Pick Your Fighter", kicker: "Model Selection", presetId: "model-arena" },
  { id: "6.2", slug: "feature-engineering", module: "production", moduleTitle: "Making It Real", title: "Feature Alchemy", kicker: "Feature Engineering", presetId: "feature-engineering", presetConfig: { advanced: true } },
  { id: "6.3", slug: "pipelines", module: "production", moduleTitle: "Making It Real", title: "The Assembly Line", kicker: "Pipelines", presetId: "pipeline-blocks" },
  { id: "6.4", slug: "deployment", module: "production", moduleTitle: "Making It Real", title: "Ship It", kicker: "Deployment", presetId: "deployment-drift" },
  { id: "6.5", slug: "ethics", module: "production", moduleTitle: "Making It Real", title: "Who Gets Hurt?", kicker: "Ethics", presetId: "ethics-bubble" },
];

const MASTERY_BY_SLUG = {
  "prediction-game": { type: "flag", flag: "guessed" },
  "data": { type: "threshold", metric: "rowCount", op: "gte", value: 10 },
  "features": { type: "flag", flag: "forged" },
  "labels": { type: "flag", flag: "switched" },
  "training": { type: "threshold", metric: "loss", op: "lte", value: 0.05 },
  "testing": { type: "flag", flag: "locked" },
  "evaluation-metrics": { type: "flag", flag: "spottedTrap" },
  "underfitting": { type: "flag", flag: "hasDragged" },
  "overfitting": { type: "threshold", metric: "valMse", op: "lte", value: 0.15 },
  "bias-variance": { type: "flag", flag: "sweetSpot" },
  "cross-validation": { type: "flag", flag: "viewedAllFolds" },
  "knn": { type: "flag", flag: "hasMovedProbe" },
  "linear-regression": { type: "threshold", metric: "loss", op: "lte", value: 0.05 },
  "logistic-regression": { type: "threshold", metric: "trainAccuracy", op: "gte", value: 0.75 },
  "decision-trees": { type: "flag", flag: "explored" },
  "random-forests": { type: "flag", flag: "nGte25" },
  "naive-bayes": { type: "flag", flag: "toggled" },
  "svm": { type: "flag", flag: "wideMargin" },
  "kmeans": { type: "flag", flag: "centroidsMoved" },
  "gradient-descent": { type: "threshold", metric: "loss", op: "lte", value: 0.05 },
  "neural-networks": { type: "flag", flag: "fired" },
  "model-selection": { type: "flag", flag: "picked" },
  "feature-engineering": { type: "flag", flag: "forged" },
  "pipelines": { type: "flag", flag: "valid" },
  "deployment": { type: "flag", flag: "decayed" },
  "ethics": { type: "flag", flag: "fixed" },
};

const QUIZ_METRIC = {
  "prediction-game": { metric: "trainingSize", op: "gte", value: 5 },
  "data": { metric: "rowCount", op: "gte", value: 5 },
  default: { metric: "separation", op: "gte", value: 0 },
};

function buildLesson(meta, prev, next) {
  const mastery = MASTERY_BY_SLUG[meta.slug] ?? { type: "flag", flag: "forged" };
  const qm = QUIZ_METRIC[meta.slug] ?? QUIZ_METRIC.default;
  return {
    id: meta.id,
    slug: meta.slug,
    module: meta.module,
    moduleTitle: meta.moduleTitle,
    title: meta.title,
    kicker: meta.kicker,
    presetId: meta.presetId,
    presetConfig: meta.presetConfig ?? {},
    phases: {
      hook: {
        prompt: `Will Maya love this film on Reel? You have examples — what would you guess?`,
        tease: "Drag something before anyone explains ML to you.",
      },
      intuition: {
        blocks: [
          { type: "metaphor", body: `ML on Reel is pattern completion: past watches → predict the next one.` },
          { type: "text", body: `In "${meta.title}" you'll manipulate a live model — not read about one.` },
          { type: "prediction-prompt", body: "What do you think happens if you change one parameter?" },
        ],
      },
      playground: { mastery },
      mistakes: {
        traps: [
          {
            id: "trap-1",
            detect: { type: "threshold", metric: "accuracy", op: "gte", value: 0.99 },
            reveal: "Perfect train score can still fail on new films — that's the whole game.",
            tone: "warning",
          },
        ],
      },
      realWorld: {
        example: `Reel uses ${meta.kicker.toLowerCase()} to decide which shorts surface for millions of viewers — same idea, bigger scale.`,
        domain: "Streaming / recommendations",
      },
      miniChallenge: {
        goal: `Reach the mastery condition by experimenting with ${meta.title.toLowerCase()}.`,
        mastery,
      },
      recap: {
        bullets: [
          `You learned ${meta.kicker} by touching it, not reading it.`,
          "Predictions need evidence from data.",
          "Experiment mode is always open — break things on purpose.",
        ],
      },
      quiz: {
        steps: [
          { type: "predict", prompt: "Before changing anything: will accuracy go up or down if you tweak the main slider?" },
          {
            type: "manipulate",
            prompt: "Change a parameter until the model responds.",
            targetMetric: qm.metric,
            targetOp: qm.op,
            targetValue: qm.value,
          },
          {
            type: "explain",
            prompt: "Why did the metric move?",
            choices: [
              { id: "a", text: "The model found a pattern in Maya's watches" },
              { id: "b", text: "The UI randomly animates", wrongReason: "Animations follow your parameter changes — check the metrics." },
              { id: "c", text: "More data always hurts", wrongReason: "More relevant data usually helps; irrelevant data hurts." },
            ],
            correctId: "a",
          },
        ],
      },
      experiment: { config: meta.presetConfig ?? {} },
    },
    nav: { prev, next },
    seo: {
      title: `${meta.title} — Wonder ML`,
      description: `Interactive lesson: ${meta.title}. Learn ${meta.kicker} by experimentation on Reel.`,
    },
  };
}

fs.mkdirSync(LESSONS, { recursive: true });

const lessons = SLUGS.map((s, i) => {
  const prev = i > 0 ? SLUGS[i - 1].slug : undefined;
  const next = i < SLUGS.length - 1 ? SLUGS[i + 1].slug : undefined;
  const lesson = buildLesson(s, prev, next);
  fs.writeFileSync(path.join(LESSONS, `${s.slug}.json`), JSON.stringify(lesson, null, 2));
  return s.slug;
});

const manifest = {
  version: 1,
  modules: [
    { id: "world", title: "The World", lessons: lessons.slice(0, 4) },
    { id: "evaluation", title: "Honest Evaluation", lessons: lessons.slice(4, 7) },
    { id: "fit", title: "The Fit Tension", lessons: lessons.slice(7, 11) },
    { id: "toolbox", title: "Your First Toolbox", lessons: lessons.slice(11, 17) },
    { id: "geometry", title: "Geometry & Groups", lessons: lessons.slice(17, 19) },
    { id: "engine", title: "The Engine Room", lessons: lessons.slice(19, 21) },
    { id: "production", title: "Making It Real", lessons: lessons.slice(21, 26) },
  ],
};

fs.mkdirSync(path.join(ROOT, "curriculum"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "curriculum", "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`Generated ${lessons.length} lessons.`);
