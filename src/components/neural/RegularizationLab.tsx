"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { useLabSnapshot } from "@/lib/nn/useLabSnapshot";
import type { SimSnapshot } from "@/engines/interaction/types";
import type { PresetComponent } from "@/engines/presets/PresetPlayground";
import { ExperienceHint, MetricChip } from "@/components/experience/ExperienceChrome";

export const RegularizationLab: PresetComponent = forwardRef(function RegularizationLab(_props, ref) {
  const [w1, setW1] = useState(2.5);
  const [w2, setW2] = useState(-2.0);
  const [lambda, setLambda] = useState(0);
  const target = 1;
  const pred = w1 * 0.5 + w2 * 0.3;
  const dataLoss = (pred - target) ** 2;
  const regLoss = lambda * (w1 * w1 + w2 * w2);
  const total = dataLoss + regLoss;

  const snapshot: SimSnapshot = useMemo(
    () => ({
      presetId: "nn-regularization",
      params: { lambda },
      metrics: { dataLoss, regLoss, total, wMag: Math.hypot(w1, w2) },
      flags: { usedRegularization: lambda > 0.1 },
    }),
    [lambda, dataLoss, regLoss, total, w1, w2],
  );

  useImperativeHandle(ref, () => ({
    reset: () => { setW1(2.5); setW2(-2.0); setLambda(0); },
    getSnapshot: () => snapshot,
    getState: () => ({ lambda }),
  }));
  useLabSnapshot(snapshot);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-8 rounded-xl bg-bg-deep/70 p-6">
        {[w1, w2].map((w, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-violet/20 ring-2 ring-violet/40 transition-all"
              style={{ width: 40 + Math.abs(w) * 12, height: 40 + Math.abs(w) * 12 }} />
            <span className="font-mono text-xs text-ink">w{i + 1}={w.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <InteractiveSlider label="w₁" value={w1} min={-3} max={3} step={0.05} accent="violet" onChange={setW1} />
      <InteractiveSlider label="w₂" value={w2} min={-3} max={3} step={0.05} accent="violet" onChange={setW2} />
      <InteractiveSlider label="L2 penalty λ" value={lambda} min={0} max={1} step={0.05} accent="gold" onChange={setLambda} />
      <div className="grid grid-cols-3 gap-2">
        <MetricChip label="data loss" value={dataLoss.toFixed(3)} />
        <MetricChip label="L2 penalty" value={regLoss.toFixed(3)} tone="gold" />
        <MetricChip label="total" value={total.toFixed(3)} tone="mint" />
      </div>
      <ExperienceHint>Large weights fit noise. Turn up λ — feel the penalty push weights toward zero.</ExperienceHint>
    </div>
  );
});
