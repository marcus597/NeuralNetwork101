"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { getSurface, sgdStep, type Point2, type SurfaceId } from "@/lib/nn/surfaces";
import { useLabSnapshot } from "@/lib/nn/useLabSnapshot";
import type { SimSnapshot } from "@/engines/interaction/types";
import type { PresetComponent } from "@/engines/presets/PresetPlayground";
import { ControlDock, ExperienceHint, MetricChip } from "@/components/experience/ExperienceChrome";
import { cn } from "@/lib/cn";

export const GradientDescentLab: PresetComponent = forwardRef(function GradientDescentLab(_props, ref) {
  const [surface, setSurface] = useState<SurfaceId>("bowl");
  const [pos, setPos] = useState<Point2>({ x: 1.5, y: 1.2 });
  const [lr, setLr] = useState(0.1);
  const [path, setPath] = useState<Point2[]>([{ x: 1.5, y: 1.2 }]);
  const [steps, setSteps] = useState(0);

  const surf = getSurface(surface);
  const loss = surf.loss(pos);
  const grad = surf.grad(pos);

  const snapshot: SimSnapshot = useMemo(
    () => ({
      presetId: "nn-gd",
      params: { steps, lr },
      metrics: { loss, gradMag: Math.hypot(grad.x, grad.y), steps },
      flags: { converged: loss < 0.05 && steps > 0 },
    }),
    [loss, grad, steps, lr],
  );

  useImperativeHandle(ref, () => ({
    reset: () => { setPos({ x: 1.5, y: 1.2 }); setPath([{ x: 1.5, y: 1.2 }]); setSteps(0); },
    getSnapshot: () => snapshot,
    getState: () => ({ pos, steps }),
  }));
  useLabSnapshot(snapshot);

  const step = () => {
    const next = sgdStep(pos, grad, lr);
    setPos(next);
    setPath((p) => [...p, next]);
    setSteps((s) => s + 1);
  };

  const toSvg = (p: Point2) => ({ cx: 160 + p.x * 50, cy: 100 - p.y * 50 });

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-bg-deep/70 p-4">
        <svg viewBox="0 0 320 200" className="w-full">
          {Array.from({ length: 8 }).map((_, i) => (
            <circle key={i} cx={160} cy={100} r={15 + i * 18} fill="none" stroke="rgba(139,124,255,0.08)" />
          ))}
          <polyline fill="none" stroke="rgba(61,255,181,0.6)" strokeWidth="2"
            points={path.map((p) => { const { cx, cy } = toSvg(p); return `${cx},${cy}`; }).join(" ")} />
          <line x1={toSvg(pos).cx} y1={toSvg(pos).cy}
            x2={toSvg(pos).cx - grad.x * 8} y2={toSvg(pos).cy + grad.y * 8}
            stroke="#ff6b6b" strokeWidth="2" markerEnd="url(#arrow)" />
          <circle cx={toSvg(pos).cx} cy={toSvg(pos).cy} r="8" fill="#3dffb5" stroke="white" strokeWidth="2" />
        </svg>
      </div>
      <ControlDock>
        {(["bowl", "rosenbrock", "saddle"] as SurfaceId[]).map((s) => (
          <button key={s} type="button" onClick={() => { setSurface(s); setPos({ x: 1.5, y: 1.2 }); setPath([{ x: 1.5, y: 1.2 }]); setSteps(0); }}
            className={cn("focus-ring rounded-full px-3 py-2 text-xs", surface === s ? "bg-violet/20 text-violet" : "bg-bg-muted text-ink-muted")}>
            {getSurface(s).label}
          </button>
        ))}
      </ControlDock>
      <InteractiveSlider label="Learning rate η" value={lr} min={0.01} max={0.5} step={0.01} accent="sky" onChange={setLr} />
      <div className="grid grid-cols-3 gap-2">
        <MetricChip label="loss" value={loss.toFixed(4)} />
        <MetricChip label="∇ magnitude" value={Math.hypot(grad.x, grad.y).toFixed(3)} tone="coral" />
        <MetricChip label="steps" value={String(steps)} />
      </div>
      <Button onClick={step}>Take gradient step →</Button>
      <ExperienceHint>The red arrow is the gradient — the steepest uphill direction. Each step moves opposite to it.</ExperienceHint>
    </div>
  );
});
