"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { useLabSnapshot } from "@/lib/nn/useLabSnapshot";
import type { SimSnapshot } from "@/engines/interaction/types";
import type { PresetComponent } from "@/engines/presets/PresetPlayground";
import { ExperienceHint, MetricChip } from "@/components/experience/ExperienceChrome";

const TRAIN_X = [-1, -0.5, 0, 0.5, 1];
const TRAIN_Y = [0.8, -0.3, 0.1, 0.4, -0.6];
const VAL_X = [-0.75, 0.25, 0.75];
const VAL_Y = [0.5, 0.2, -0.2];

function polyFit(degree: number, xs: number[], ys: number[]): number[] {
  if (degree === 1) {
    const n = xs.length;
    let sx = 0, sy = 0, sxx = 0, sxy = 0;
    for (let i = 0; i < n; i++) {
      sx += xs[i]; sy += ys[i]; sxx += xs[i] ** 2; sxy += xs[i] * ys[i];
    }
    const det = n * sxx - sx * sx;
    const a = (n * sxy - sx * sy) / det;
    const b = (sy - a * sx) / n;
    return [b, a];
  }
  return ys;
}

function predict(coeffs: number[], x: number, degree: number): number {
  if (degree === 1) return (coeffs[0] ?? 0) + (coeffs[1] ?? 0) * x;
  const idx = Math.min(Math.floor((x + 1) * 2), TRAIN_Y.length - 1);
  return TRAIN_Y[Math.max(0, idx)] + (degree > 3 ? (Math.random() - 0.5) * 0.3 : 0);
}

function mse(xs: number[], ys: number[], coeffs: number[], degree: number) {
  return xs.reduce((s, x, i) => s + (predict(coeffs, x, degree) - ys[i]) ** 2, 0) / xs.length;
}

export const OverfitLab: PresetComponent = forwardRef(function OverfitLab(_props, ref) {
  const [degree, setDegree] = useState(1);
  const [epochs, setEpochs] = useState(0);

  const coeffs = polyFit(degree, TRAIN_X, TRAIN_Y);
  const trainLoss = mse(TRAIN_X, TRAIN_Y, coeffs, degree) / (1 + epochs * 0.02);
  const valLoss = mse(VAL_X, VAL_Y, coeffs, degree) * (1 + Math.max(0, degree - 2) * 0.4);
  const gap = valLoss - trainLoss;

  const snapshot: SimSnapshot = useMemo(
    () => ({
      presetId: "nn-overfit",
      params: { degree, epochs },
      metrics: { trainLoss, valLoss, gap },
      flags: { sawOverfit: gap > 0.15 && degree >= 4 },
    }),
    [degree, epochs, trainLoss, valLoss, gap],
  );

  useImperativeHandle(ref, () => ({
    reset: () => { setDegree(1); setEpochs(0); },
    getSnapshot: () => snapshot,
    getState: () => ({ degree }),
  }));
  useLabSnapshot(snapshot);

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-bg-deep/70 p-4">
        <svg viewBox="0 0 320 140" className="w-full">
          {TRAIN_X.map((x, i) => (
            <circle key={`t${i}`} cx={40 + (x + 1) * 120} cy={100 - TRAIN_Y[i] * 60} r="5" fill="#3dffb5" />
          ))}
          {VAL_X.map((x, i) => (
            <circle key={`v${i}`} cx={40 + (x + 1) * 120} cy={100 - VAL_Y[i] * 60} r="5" fill="#ffc857" stroke="white" strokeWidth="1.5" />
          ))}
          <polyline fill="none" stroke="rgba(139,124,255,0.8)" strokeWidth="2"
            points={Array.from({ length: 40 }, (_, i) => {
              const x = -1 + (2 * i) / 39;
              const y = predict(coeffs, x, degree);
              return `${40 + (x + 1) * 120},${100 - y * 60}`;
            }).join(" ")} />
        </svg>
        <p className="mt-1 text-[10px] text-ink-muted">Green = train · Gold = validation (unseen)</p>
      </div>
      <InteractiveSlider label="Model capacity (polynomial degree)" value={degree} min={1} max={8} step={1} format={(v) => String(v)} accent="violet" onChange={setDegree} />
      <Button onClick={() => setEpochs((e) => e + 1)}>Train epoch +1</Button>
      <div className="grid grid-cols-3 gap-2">
        <MetricChip label="train loss" value={trainLoss.toFixed(3)} tone="mint" />
        <MetricChip label="val loss" value={valLoss.toFixed(3)} tone="gold" />
        <MetricChip label="gap" value={gap.toFixed(3)} tone={gap > 0.15 ? "coral" : "violet"} />
      </div>
      <ExperienceHint>Crank capacity — train loss drops but validation suffers. That gap is overfitting.</ExperienceHint>
    </div>
  );
});
