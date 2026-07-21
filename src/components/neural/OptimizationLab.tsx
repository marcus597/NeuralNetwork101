"use client";

import { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { getSurface, type Point2, type SurfaceId } from "@/lib/nn/surfaces";
import { useLabSnapshot } from "@/lib/nn/useLabSnapshot";
import type { SimSnapshot } from "@/engines/interaction/types";
import type { PresetComponent } from "@/engines/presets/PresetPlayground";
import { ExperienceHint, MetricChip } from "@/components/experience/ExperienceChrome";

const COLORS = ["#3dffb5", "#8b7cff", "#ffc857"];
const START: Point2 = { x: -1.2, y: 1.0 };

function runOptimizer(
  id: "sgd" | "momentum" | "adam",
  surface: SurfaceId,
  lr: number,
  maxSteps: number,
): Point2[] {
  const { loss, grad } = getSurface(surface);
  const path: Point2[] = [{ ...START }];
  let p = { ...START };
  let vel: Point2 = { x: 0, y: 0 };
  let m: Point2 = { x: 0, y: 0 };
  let v: Point2 = { x: 0, y: 0 };

  for (let t = 0; t < maxSteps; t++) {
    const g = grad(p);
    if (id === "sgd") {
      p = { x: p.x - lr * g.x, y: p.y - lr * g.y };
    } else if (id === "momentum") {
      vel = { x: 0.9 * vel.x + g.x, y: 0.9 * vel.y + g.y };
      p = { x: p.x - lr * vel.x, y: p.y - lr * vel.y };
    } else {
      m = { x: 0.9 * m.x + (1 - 0.9) * g.x, y: 0.9 * m.y + (1 - 0.9) * g.y };
      v = { x: 0.999 * v.x + (1 - 0.999) * g.x * g.x, y: 0.999 * v.y + (1 - 0.999) * g.y * g.y };
      const mh = m.x / (1 - 0.9 ** (t + 1));
      const mh2 = m.y / (1 - 0.9 ** (t + 1));
      const vh = v.x / (1 - 0.999 ** (t + 1));
      const vh2 = v.y / (1 - 0.999 ** (t + 1));
      p = { x: p.x - lr * mh / (Math.sqrt(vh) + 1e-8), y: p.y - lr * mh2 / (Math.sqrt(vh2) + 1e-8) };
    }
    path.push({ ...p });
    if (loss(p) < 0.01) break;
  }
  return path;
}

export const OptimizationLab: PresetComponent = forwardRef(function OptimizationLab(_props, ref) {
  const [lr, setLr] = useState(0.05);
  const [paths, setPaths] = useState<{ id: string; pts: Point2[] }[]>([]);

  const snapshot: SimSnapshot = useMemo(
    () => ({
      presetId: "nn-optimization",
      params: { lr },
      metrics: { paths: paths.length },
      flags: { comparedOptimizers: paths.length >= 3 },
    }),
    [lr, paths.length],
  );

  const runAll = useCallback(() => {
    setPaths([
      { id: "sgd", pts: runOptimizer("sgd", "rosenbrock", lr, 80) },
      { id: "momentum", pts: runOptimizer("momentum", "rosenbrock", lr, 80) },
      { id: "adam", pts: runOptimizer("adam", "rosenbrock", lr, 80) },
    ]);
  }, [lr]);

  useImperativeHandle(ref, () => ({
    reset: () => setPaths([]),
    getSnapshot: () => snapshot,
    getState: () => ({ paths }),
  }));
  useLabSnapshot(snapshot);

  const toSvg = (p: Point2) => ({ cx: 160 + p.x * 40, cy: 110 - p.y * 40 });

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-bg-deep/70 p-4">
        <svg viewBox="0 0 320 180" className="w-full">
          {paths.map((path, pi) => (
            <polyline key={path.id} fill="none" stroke={COLORS[pi]} strokeWidth="2" opacity={0.85}
              points={path.pts.map((p) => { const { cx, cy } = toSvg(p); return `${cx},${cy}`; }).join(" ")} />
          ))}
          <circle cx={toSvg(START).cx} cy={toSvg(START).cy} r="6" fill="white" />
        </svg>
      </div>
      <InteractiveSlider label="Learning rate η" value={lr} min={0.01} max={0.15} step={0.005} accent="sky" onChange={setLr} />
      <div className="flex flex-wrap gap-2">
        {["sgd", "momentum", "adam"].map((o, i) => (
          <MetricChip key={o} label={o} value={paths[i] ? `${paths[i].pts.length} steps` : "—"} tone={i === 0 ? "mint" : i === 1 ? "violet" : "gold"} />
        ))}
      </div>
      <Button onClick={runAll}>Race optimizers on Rosenbrock →</Button>
      <ExperienceHint>Same start, same loss surface — three optimizers take wildly different paths. Run again with different learning rates.</ExperienceHint>
    </div>
  );
});
