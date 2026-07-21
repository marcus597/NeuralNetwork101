"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { useLabSnapshot } from "@/lib/nn/useLabSnapshot";
import type { SimSnapshot } from "@/engines/interaction/types";
import type { PresetComponent } from "@/engines/presets/PresetPlayground";
import { ExperienceHint, MetricChip } from "@/components/experience/ExperienceChrome";

const BATCH = [2, 8, 5, 1, 9, 3, 7, 4];

function normalize(vals: number[], on: boolean) {
  if (!on) return vals;
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const variance = vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length;
  const std = Math.sqrt(variance + 1e-6);
  return vals.map((v) => (v - mean) / std);
}

export const BatchNormLab: PresetComponent = forwardRef(function BatchNormLab(_props, ref) {
  const [shift, setShift] = useState(3);
  const [scale, setScale] = useState(2);
  const [bnOn, setBnOn] = useState(false);

  const raw = BATCH.map((v) => v * scale + shift);
  const normed = normalize(raw, bnOn);
  const mean = raw.reduce((a, b) => a + b, 0) / raw.length;
  const std = Math.sqrt(raw.reduce((s, v) => s + (v - mean) ** 2, 0) / raw.length);

  const snapshot: SimSnapshot = useMemo(
    () => ({
      presetId: "nn-batchnorm",
      params: { bnOn: bnOn ? 1 : 0 },
      metrics: { mean, std, spread: Math.max(...raw) - Math.min(...raw), bnOn: bnOn ? 1 : 0 },
      flags: { toggledBN: bnOn },
    }),
    [bnOn, mean, std, raw],
  );

  useImperativeHandle(ref, () => ({
    reset: () => { setShift(3); setScale(2); setBnOn(false); },
    getSnapshot: () => snapshot,
    getState: () => ({ bnOn }),
  }));
  useLabSnapshot(snapshot);

  const display = bnOn ? normed : raw;
  const maxVal = Math.max(...display.map(Math.abs), 1);

  return (
    <div className="space-y-4">
      <div className="flex h-28 items-end justify-center gap-2 rounded-xl bg-bg-deep/70 p-4">
        {display.map((v, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="w-8 rounded-t bg-violet/70 transition-all" style={{ height: `${(Math.abs(v) / maxVal) * 80 + 4}px` }} />
            <span className="font-mono text-[9px] text-ink-muted">{v.toFixed(1)}</span>
          </div>
        ))}
      </div>
      <InteractiveSlider label="Shift batch (bad distribution)" value={shift} min={-2} max={8} step={0.5} accent="coral" onChange={setShift} />
      <InteractiveSlider label="Scale batch" value={scale} min={0.5} max={4} step={0.1} accent="coral" onChange={setScale} />
      <button type="button" onClick={() => setBnOn((b) => !b)}
        className={`focus-ring w-full rounded-xl py-3 text-sm font-semibold ${bnOn ? "bg-mint/20 text-mint ring-1 ring-mint/30" : "bg-bg-muted text-ink-muted ring-1 ring-border-subtle"}`}>
        Batch norm {bnOn ? "ON" : "OFF"}
      </button>
      <div className="grid grid-cols-2 gap-2">
        <MetricChip label="batch mean" value={mean.toFixed(2)} />
        <MetricChip label="batch std" value={std.toFixed(2)} tone="gold" />
      </div>
      <ExperienceHint>Shift the distribution off-center, then flip batch norm — watch activations snap to mean 0, std 1.</ExperienceHint>
    </div>
  );
});
