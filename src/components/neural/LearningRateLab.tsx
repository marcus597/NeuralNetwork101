"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { useLabSnapshot } from "@/lib/nn/useLabSnapshot";
import type { SimSnapshot } from "@/engines/interaction/types";
import type { PresetComponent } from "@/engines/presets/PresetPlayground";
import { ExperienceHint, MetricChip } from "@/components/experience/ExperienceChrome";
import { cn } from "@/lib/cn";

function simulateLR(lr: number, steps: number): number[] {
  let w = 2.5;
  const losses: number[] = [];
  for (let i = 0; i < steps; i++) {
    const grad = 2 * w;
    w -= lr * grad;
    losses.push(w * w);
  }
  return losses;
}

export const LearningRateLab: PresetComponent = forwardRef(function LearningRateLab(_props, ref) {
  const [lr, setLr] = useState(0.3);
  const [compare, setCompare] = useState<number[]>([]);

  const losses = simulateLR(lr, 40);
  const diverged = losses.some((l) => l > 10) || losses.at(-1)! > 2;
  const converged = losses.at(-1)! < 0.05;

  const snapshot: SimSnapshot = useMemo(
    () => ({
      presetId: "nn-lr",
      params: { lr },
      metrics: { finalLoss: losses.at(-1) ?? 1, lr },
      flags: { foundGoodLR: converged, sawDivergence: diverged || compare.some((c) => simulateLR(c, 40).some((l) => l > 10)) },
    }),
    [lr, losses, converged, diverged, compare],
  );

  useImperativeHandle(ref, () => ({
    reset: () => { setLr(0.3); setCompare([]); },
    getSnapshot: () => snapshot,
    getState: () => ({ lr }),
  }));
  useLabSnapshot(snapshot);

  const curves = [lr, ...compare].map((l) => ({ lr: l, losses: simulateLR(l, 40) }));
  const COLORS = ["#3dffb5", "#ff6b6b", "#ffc857", "#8b7cff"];

  return (
    <div className="space-y-4">
      <div className="flex h-32 items-end gap-0.5 rounded-xl bg-bg-deep/70 p-3">
        {losses.map((l, i) => (
          <div key={i} className="flex-1 rounded-t bg-violet/50" style={{ height: `${Math.min(100, l * 8 + 2)}%` }} />
        ))}
      </div>
      {compare.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-3">
          {curves.slice(1).map((c, i) => (
            <div key={i} className="flex h-16 items-end gap-px rounded bg-bg-stage p-2">
              {c.losses.map((l, j) => (
                <div key={j} className="flex-1 rounded-t" style={{ height: `${Math.min(100, l * 8 + 2)}%`, background: COLORS[i + 1] }} />
              ))}
            </div>
          ))}
        </div>
      )}
      <InteractiveSlider label="Learning rate η" value={lr} min={0.01} max={0.99} step={0.01} accent={diverged ? "coral" : "mint"} onChange={setLr} />
      <div className="grid grid-cols-2 gap-2">
        <MetricChip label="final loss" value={(losses.at(-1) ?? 0).toFixed(4)} tone={converged ? "mint" : diverged ? "coral" : "gold"} />
        <MetricChip label="status" value={diverged ? "diverging!" : converged ? "converged" : "learning…"} tone={diverged ? "coral" : "mint"} />
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => setCompare((c) => (c.length < 3 ? [...c, lr] : c))}>Pin this curve</Button>
        <Button variant="ghost" onClick={() => setCompare([])}>Clear pins</Button>
      </div>
      <ExperienceHint>Too high → loss explodes. Too low → crawls. Pin curves and compare — find the sweet spot yourself.</ExperienceHint>
    </div>
  );
});
