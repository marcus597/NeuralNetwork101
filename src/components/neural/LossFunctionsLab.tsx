"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { bceLoss, mseLoss, sampleLossCurve } from "@/lib/nn/loss";
import { useLabSnapshot } from "@/lib/nn/useLabSnapshot";
import type { SimSnapshot } from "@/engines/interaction/types";
import type { PresetComponent } from "@/engines/presets/PresetPlayground";
import { ControlDock, ExperienceHint, MetricChip } from "@/components/experience/ExperienceChrome";
import { cn } from "@/lib/cn";

export const LossFunctionsLab: PresetComponent = forwardRef(function LossFunctionsLab(_props, ref) {
  const [pred, setPred] = useState(0.3);
  const [target, setTarget] = useState(1);
  const [mode, setMode] = useState<"mse" | "bce">("bce");

  const mse = mseLoss(pred, target);
  const bce = bceLoss(pred, target);
  const active = mode === "mse" ? mse : bce;

  const snapshot: SimSnapshot = useMemo(
    () => ({
      presetId: "nn-loss",
      params: { pred, target, mode },
      metrics: { loss: active, mse, bce },
      flags: { comparedBoth: Math.abs(pred - target) < 0.15 },
    }),
    [pred, target, mode, active, mse, bce],
  );

  useImperativeHandle(ref, () => ({
    reset: () => { setPred(0.3); setTarget(1); setMode("bce"); },
    getSnapshot: () => snapshot,
    getState: () => ({ pred, target }),
  }));
  useLabSnapshot(snapshot);

  const curve = sampleLossCurve(mode, target);

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-bg-deep/70 p-4">
        <svg viewBox="0 0 320 120" className="w-full">
          <polyline fill="none" stroke="rgba(139,124,255,0.8)" strokeWidth="2.5"
            points={curve.map((p) => `${20 + p.x * 280},${110 - p.y * 25}`).join(" ")} />
          <circle cx={20 + pred * 280} cy={110 - active * 25} r="7" fill="#3dffb5" stroke="white" strokeWidth="2" />
        </svg>
      </div>
      <ControlDock>
        {(["mse", "bce"] as const).map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)}
            className={cn("focus-ring rounded-full px-4 py-2 text-sm uppercase", mode === m ? "bg-violet/20 text-violet ring-1 ring-violet/30" : "bg-bg-muted text-ink-muted")}>
            {m === "mse" ? "MSE" : "Cross-entropy"}
          </button>
        ))}
      </ControlDock>
      <InteractiveSlider label="Prediction ŷ" value={pred} min={0.01} max={0.99} step={0.01} accent="violet" onChange={setPred} />
      <InteractiveSlider label="Target y" value={target} min={0} max={1} step={1} format={(v) => v.toFixed(0)} accent="sky" onChange={setTarget} />
      <div className="grid grid-cols-2 gap-2">
        <MetricChip label="MSE" value={mse.toFixed(4)} />
        <MetricChip label="BCE" value={bce.toFixed(4)} tone="gold" />
      </div>
      <ExperienceHint>Drag the prediction toward the target — watch how each loss punishes wrong answers differently.</ExperienceHint>
    </div>
  );
});
