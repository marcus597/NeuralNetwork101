"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { LiveHint } from "@/components/shell/LiveHint";
import { Canvas2D } from "@/engines/visualization/Canvas2D";
import { useSimulationLoop, useResizeCanvas } from "@/engines/simulation/useSimulationLoop";
import { generateClassificationDataset } from "@/lib/viz/dataset/generate";
import { generateClusterDataset } from "@/lib/viz/dataset/generate";
import { drawPointLayer } from "@/engines/visualization/layers/point-layer";
import { drawDecisionBoundaryLayer } from "@/engines/visualization/layers/decision-boundary-layer";
import { drawClusterLayer } from "@/engines/visualization/layers/cluster-layer";
import { drawTreeLayer } from "@/engines/visualization/layers/tree-layer";
import { distance as euclidean } from "@/lib/viz/distance";
import type { SimSnapshot, TreeNode } from "@/engines/interaction/types";
import type { PresetComponent } from "../PresetPlayground";
import { usePresetContext } from "../PresetPlayground";
import { vizColors } from "@/engines/visualization/colors";

function useCanvasPreset(
  drawFn: (c: Canvas2D) => void,
  onSnapshot: () => SimSnapshot,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const c2d = useRef<Canvas2D | null>(null);
  const { onSnapshot: emit } = usePresetContext();

  const init = useCallback(() => {
    if (!canvasRef.current) return;
    c2d.current = new Canvas2D(canvasRef.current);
    c2d.current.resize();
  }, []);

  useResizeCanvas(canvasRef, init);

  const draw = useCallback(() => {
    const c = c2d.current;
    if (!c) return;
    c.resize();
    c.clear();
    drawFn(c);
  }, [drawFn]);

  useSimulationLoop(draw);

  useEffect(() => {
    emit(onSnapshot());
  });

  return { canvasRef, c2d };
}

// ——— KNN ———
export const KnnPreset: PresetComponent = forwardRef(function KnnPreset(
  { config },
  ref,
) {
  const [k, setK] = useState((config.k as number) ?? 5);
  const [probe, setProbe] = useState({ x: 0.5, y: 0.5 });
  const points = useMemo(
    () => generateClassificationDataset({ seed: (config.seed as number) ?? 11, trainCount: 16, hiddenCount: 0 }),
    [config.seed],
  );

  const neighbors = useMemo(() => {
    const sorted = [...points]
      .map((p) => ({ p, d: euclidean(probe, p) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, k);
    const votes = sorted.reduce((acc, { p }) => acc + p.label, 0);
    const pred = votes >= k / 2 ? 1 : 0;
    return { sorted, pred };
  }, [points, probe, k]);

  const snapshot: SimSnapshot = {
    presetId: "knn-voronoi",
    params: { k },
    metrics: { accuracy: neighbors.pred === 1 ? 1 : 0, k },
    flags: { hasMovedProbe: probe.x !== 0.5 || probe.y !== 0.5 },
  };

  const drawFn = useCallback(
    (c: Canvas2D) => {
      drawPointLayer(c, { points });
      const { px, py } = c.toScreen(probe.x, probe.y);
      const ctx = c.ctx;
      for (const { p } of neighbors.sorted) {
        const sp = c.toScreen(p.x, p.y);
        ctx.strokeStyle = "rgba(139,124,255,0.4)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sp.px, sp.py);
        ctx.stroke();
      }
      ctx.fillStyle = neighbors.pred === 1 ? vizColors.coral : vizColors.mint;
      ctx.beginPath();
      ctx.arc(px, py, 12, 0, Math.PI * 2);
      ctx.fill();
    },
    [points, probe, neighbors],
  );

  const { canvasRef, c2d } = useCanvasPreset(drawFn, () => snapshot);

  useImperativeHandle(ref, () => ({
    reset: () => { setProbe({ x: 0.5, y: 0.5 }); setK(5); },
    getSnapshot: () => snapshot,
    getState: () => ({ k, probe }),
  }));

  return (
    <div className="space-y-4">
      <div className="panel glow-violet overflow-hidden">
        <canvas
          ref={canvasRef}
          className="h-56 w-full cursor-crosshair touch-none sm:h-72"
          onPointerDown={(e) => {
            const c = c2d.current;
            if (!c) return;
            const { x, y } = c.pointerToNorm(e.clientX, e.clientY);
            setProbe({ x, y: 1 - y });
          }}
        />
      </div>
      <InteractiveSlider label="K neighbors" value={k} min={1} max={15} step={1} format={(v) => String(Math.round(v))} onChange={(v) => setK(Math.round(v))} />
      <LiveHint message={`${k} nearest films vote: prediction is ${neighbors.pred === 1 ? "Love" : "Skip"}`} />
    </div>
  );
});

// ——— KMeans ———
export const KMeansPreset: PresetComponent = forwardRef(function KMeansPreset(
  { config },
  ref,
) {
  const [k, setK] = useState((config.k as number) ?? 3);
  const points = useMemo(() => generateClusterDataset({ k: 4, seed: (config.seed as number) ?? 99 }), [config.seed]);
  const [centroids, setCentroids] = useState(
    () => Array.from({ length: k }, (_, i) => ({ x: 0.2 + i * 0.25, y: 0.5 })),
  );

  const assignments = points.map((p) => {
    let best = 0;
    let bestD = Infinity;
    centroids.forEach((c, i) => {
      const d = euclidean(p, c);
      if (d < bestD) { bestD = d; best = i; }
    });
    return best;
  });

  const snapshot: SimSnapshot = {
    presetId: "kmeans-cluster",
    params: { k },
    metrics: { inertia: assignments.length },
    flags: { centroidsMoved: centroids.some((c) => c.x !== 0.5) },
  };

  const drawFn = useCallback(
    (c: Canvas2D) => drawClusterLayer(c, { points, centroids, assignments, showVoronoi: true }),
    [points, centroids, assignments],
  );
  const { canvasRef, c2d } = useCanvasPreset(drawFn, () => snapshot);

  useImperativeHandle(ref, () => ({
    reset: () => setCentroids(Array.from({ length: k }, (_, i) => ({ x: 0.2 + i * 0.25, y: 0.5 }))),
    getSnapshot: () => snapshot,
    getState: () => ({ centroids, k }),
  }));

  return (
    <div className="space-y-4">
      <div className="panel overflow-hidden">
        <canvas
          ref={canvasRef}
          className="h-56 w-full cursor-grab touch-none sm:h-72"
          onPointerMove={(e) => {
            if (e.buttons !== 1) return;
            const c = c2d.current;
            if (!c) return;
            const { x, y } = c.pointerToNorm(e.clientX, e.clientY);
            const idx = centroids.findIndex((ct) => euclidean(ct, { x, y: 1 - y }) < 0.08);
            if (idx >= 0) {
              setCentroids((prev) => prev.map((ct, i) => (i === idx ? { x, y: 1 - y } : ct)));
            }
          }}
        />
      </div>
      <InteractiveSlider label="K clusters" value={k} min={2} max={5} step={1} format={(v) => String(Math.round(v))} onChange={(v) => setK(Math.round(v))} />
      <LiveHint message="Drag gold centroids — films re-color to their nearest tribe." tone="discovery" />
    </div>
  );
});

// ——— Tree ———
const sampleTree: TreeNode = {
  id: "root",
  feature: "runtime",
  threshold: 0.45,
  left: { id: "l", feature: "energy", threshold: 0.5, left: { id: "ll", isLeaf: true, prediction: 0 }, right: { id: "lr", isLeaf: true, prediction: 1 } },
  right: { id: "r", isLeaf: true, prediction: 1 },
};

export const TreePreset: PresetComponent = forwardRef(function TreePreset(_props, ref) {
  const [depth, setDepth] = useState(3);
  const [active, setActive] = useState("root");
  const snapshot: SimSnapshot = {
    presetId: "decision-tree",
    params: { depth },
    metrics: { depth },
    flags: { explored: active !== "root" },
  };
  const drawFn = useCallback((c: Canvas2D) => drawTreeLayer(c, { root: sampleTree, activeNodeId: active, splitHighlight: true }), [active]);
  const { canvasRef } = useCanvasPreset(drawFn, () => snapshot);

  useImperativeHandle(ref, () => ({
    reset: () => { setDepth(3); setActive("root"); },
    getSnapshot: () => snapshot,
    getState: () => ({ depth, active }),
  }));

  return (
    <div className="space-y-4">
      <div className="panel overflow-hidden">
        <canvas ref={canvasRef} className="h-56 w-full sm:h-72" onClick={() => setActive(active === "root" ? "l" : "root")} />
      </div>
      <InteractiveSlider label="Max depth" value={depth} min={1} max={5} step={1} format={(v) => String(Math.round(v))} onChange={(v) => setDepth(Math.round(v))} />
      <LiveHint message="Click the tree — each split is a yes/no question about a film trait." />
    </div>
  );
});

export const ForestPreset: PresetComponent = forwardRef(function ForestPreset(_props, ref) {
  const [n, setN] = useState(5);
  const snapshot: SimSnapshot = {
    presetId: "random-forest",
    params: { n },
    metrics: { trees: n, variance: 1 / Math.sqrt(n) },
    flags: { nGte25: n >= 25 },
  };

  useImperativeHandle(ref, () => ({
    reset: () => setN(5),
    getSnapshot: () => snapshot,
    getState: () => ({ n }),
  }));

  return (
    <div className="space-y-4">
      <div className="panel flex h-56 flex-wrap items-center justify-center gap-2 p-4 sm:h-72">
        {Array.from({ length: Math.min(n, 30) }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="h-10 w-10 rounded-full border-2 border-mint/40 bg-mint/10 text-center text-xs leading-10 text-mint"
          >
            {i + 1}
          </motion.div>
        ))}
      </div>
      <InteractiveSlider label="Trees in forest" value={n} min={1} max={50} step={1} format={(v) => String(Math.round(v))} onChange={(v) => setN(Math.round(v))} />
      <LiveHint message={`${n} trees vote — more trees, stabler predictions (variance drops).`} tone="discovery" />
    </div>
  );
});

// ——— SVM ———
export const SvmPreset: PresetComponent = forwardRef(function SvmPreset(_props, ref) {
  const [margin, setMargin] = useState(0.15);
  const points = useMemo(() => generateClassificationDataset({ seed: 33 }), []);
  const boundary = useMemo(() => ({ angle: -0.5, offset: -0.02 }), []);
  const snapshot: SimSnapshot = {
    presetId: "svm-margin",
    params: { margin },
    metrics: { margin },
    flags: { wideMargin: margin >= 0.2 },
  };

  const drawFn = useCallback(
    (c: Canvas2D) => {
      drawDecisionBoundaryLayer(c, boundary);
      drawPointLayer(c, { points });
      const { ctx, size } = c;
      const nx = Math.cos(boundary.angle);
      const ny = Math.sin(boundary.angle);
      ctx.strokeStyle = "rgba(255,209,102,0.5)";
      ctx.lineWidth = 8 * margin;
      ctx.beginPath();
      const cx = size.w / 2;
      const cy = size.h / 2;
      const len = Math.max(size.w, size.h);
      ctx.moveTo(cx - nx * len, cy - ny * len);
      ctx.lineTo(cx + nx * len, cy + ny * len);
      ctx.stroke();
    },
    [points, margin, boundary],
  );
  const { canvasRef } = useCanvasPreset(drawFn, () => snapshot);

  useImperativeHandle(ref, () => ({
    reset: () => setMargin(0.15),
    getSnapshot: () => snapshot,
    getState: () => ({ margin }),
  }));

  return (
    <div className="space-y-4">
      <div className="panel glow-violet overflow-hidden">
        <canvas ref={canvasRef} className="h-56 w-full sm:h-72" />
      </div>
      <InteractiveSlider label="Margin width" value={margin} min={0.05} max={0.35} step={0.01} onChange={setMargin} accent="gold" />
      <LiveHint message="SVM wants the widest street between Loved and Skipped — support films sit on the edges." />
    </div>
  );
});

// ——— Naive Bayes ———
const TAGS = ["warm", "slow", "funny", "dark", "short"] as const;

export const NaiveBayesPreset: PresetComponent = forwardRef(function NaiveBayesPreset(_props, ref) {
  const [tags, setTags] = useState<Record<string, boolean>>({ warm: true, funny: false, dark: false, slow: false, short: true });
  const loveScore = (tags.warm ? 0.35 : 0.05) + (tags.funny ? 0.3 : 0.1) + (tags.dark ? 0.05 : 0.2) + (tags.short ? 0.2 : 0.1);
  const pred = loveScore >= 0.5 ? 1 : 0;
  const snapshot: SimSnapshot = {
    presetId: "naive-bayes",
    params: tags as unknown as Record<string, number | boolean | string>,
    metrics: { loveScore, pred },
    flags: { toggled: Object.values(tags).some(Boolean) },
  };

  useImperativeHandle(ref, () => ({
    reset: () => setTags({ warm: false, funny: false, dark: false, slow: false, short: false }),
    getSnapshot: () => snapshot,
    getState: () => tags,
  }));

  return (
    <div className="space-y-4 panel p-5">
      <p className="text-sm text-ink-muted">Toggle film tags — Naive Bayes multiplies evidence (naively independent).</p>
      <div className="flex flex-wrap gap-2">
        {TAGS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTags((s) => ({ ...s, [t]: !s[t] }))}
            className={`focus-ring rounded-full px-4 py-2 text-sm font-medium transition-colors ${tags[t] ? "bg-mint/25 text-mint" : "border border-white/10 text-ink-muted"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="font-mono text-sm">
        P(Love) ≈ {loveScore.toFixed(2)} → {pred === 1 ? "Love" : "Skip"}
      </div>
      <LiveHint message={pred === 1 ? "Tags stack toward Love — each multiplies odds." : "Negative tags pull toward Skip."} />
    </div>
  );
});

// ——— Metrics ———
export const MetricsPreset: PresetComponent = forwardRef(function MetricsPreset(_props, ref) {
  const [imbalance, setImbalance] = useState(0.95);
  const accuracy = imbalance;
  const recall = 0.72;
  const precision = 0.45;
  const snapshot: SimSnapshot = {
    presetId: "metrics-dashboard",
    params: { imbalance },
    metrics: { accuracy, recall, precision },
    flags: { spottedTrap: imbalance > 0.9 },
  };

  useImperativeHandle(ref, () => ({
    reset: () => setImbalance(0.5),
    getSnapshot: () => snapshot,
    getState: () => ({ imbalance }),
  }));

  return (
    <div className="space-y-4 panel p-5">
      <InteractiveSlider label="Skip rate in data" value={imbalance} min={0.5} max={0.99} step={0.01} format={(v) => `${(v * 100).toFixed(0)}%`} onChange={setImbalance} />
      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { label: "Accuracy", val: accuracy, warn: imbalance > 0.9 },
          { label: "Recall", val: recall, warn: false },
          { label: "Precision", val: precision, warn: false },
        ].map((m) => (
          <div key={m.label} className={`rounded-xl p-3 ${m.warn ? "bg-danger/15 text-danger" : "bg-bg-deep text-ink"}`}>
            <div className="text-xs text-ink-muted">{m.label}</div>
            <div className="font-mono text-lg">{(m.val * 100).toFixed(0)}%</div>
          </div>
        ))}
      </div>
      <LiveHint message={imbalance > 0.9 ? "99% accuracy — but the model always predicts Skip. Metric lied." : "Adjust imbalance — accuracy alone misleads."} tone={imbalance > 0.9 ? "warning" : "neutral"} />
    </div>
  );
});

// ——— Bias Variance ———
export const BiasVariancePreset: PresetComponent = forwardRef(function BiasVariancePreset(_props, ref) {
  const [complexity, setComplexity] = useState(0.3);
  const bias = 1 - complexity;
  const variance = complexity * complexity;
  const snapshot: SimSnapshot = {
    presetId: "bias-variance",
    params: { complexity },
    metrics: { bias, variance, error: bias + variance },
    flags: { sweetSpot: complexity > 0.35 && complexity < 0.65 },
  };

  useImperativeHandle(ref, () => ({
    reset: () => setComplexity(0.3),
    getSnapshot: () => snapshot,
    getState: () => ({ complexity }),
  }));

  return (
    <div className="space-y-4 panel p-5">
      <InteractiveSlider label="Model complexity" value={complexity} min={0} max={1} step={0.01} onChange={setComplexity} />
      <div className="relative h-32 rounded-xl bg-bg-deep">
        <motion.div
          className="absolute bottom-4 h-8 w-8 rounded-full bg-gold"
          animate={{ left: `${(1 - bias) * 80 + 10}%`, top: `${variance * 60 + 10}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-xs text-ink-muted">dartboard — aim for center</div>
      </div>
      <div className="flex gap-4 font-mono text-xs">
        <span className="text-coral">bias {bias.toFixed(2)}</span>
        <span className="text-sky">variance {variance.toFixed(2)}</span>
      </div>
      <LiveHint message="Too simple → off-center (bias). Too jumpy → scattered (variance)." />
    </div>
  );
});

// ——— Cross Val ———
export const CrossValPreset: PresetComponent = forwardRef(function CrossValPreset(_props, ref) {
  const [fold, setFold] = useState(0);
  const folds = 5;
  const accs = [0.72, 0.68, 0.75, 0.71, 0.69];
  const mean = accs.reduce((a, b) => a + b, 0) / folds;
  const snapshot: SimSnapshot = {
    presetId: "cross-validation",
    params: { fold },
    metrics: { meanAccuracy: mean, currentFold: accs[fold] },
    flags: { viewedAllFolds: fold === folds - 1 },
  };

  useImperativeHandle(ref, () => ({
    reset: () => setFold(0),
    getSnapshot: () => snapshot,
    getState: () => ({ fold }),
  }));

  return (
    <div className="space-y-4 panel p-5">
      <div className="flex gap-2">
        {accs.map((a, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setFold(i)}
            className={`focus-ring flex-1 rounded-lg py-4 text-sm font-mono ${i === fold ? "bg-violet/30 text-violet" : "bg-bg-deep text-ink-muted"}`}
          >
            F{i + 1}<br />{(a * 100).toFixed(0)}%
          </button>
        ))}
      </div>
      <p className="font-mono text-sm">Mean CV accuracy: {(mean * 100).toFixed(1)}%</p>
      <LiveHint message="Each fold is a practice exam — mean ± spread beats one lucky split." />
    </div>
  );
});

// Re-export wrapped + more below in other files
export { ClassificationPreset as TrainTestPreset } from "./wrapped";
export { RegressionPreset, OverfitPreset, NeuronPreset } from "./wrapped";
