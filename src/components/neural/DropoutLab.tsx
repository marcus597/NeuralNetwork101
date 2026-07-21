"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { NetworkCanvas } from "@/components/experience/NetworkCanvas";
import { createTinyNetwork, forwardTiny } from "@/lib/nn/math";
import { useLabSnapshot } from "@/lib/nn/useLabSnapshot";
import type { SimSnapshot } from "@/engines/interaction/types";
import type { PresetComponent } from "@/engines/presets/PresetPlayground";
import { ExperienceHint, MetricChip } from "@/components/experience/ExperienceChrome";

function dropoutMask(size: number, rate: number, seed: number): boolean[] {
  return Array.from({ length: size }, (_, i) => {
    const r = Math.sin(seed * 999 + i * 77) * 10000;
    return (r - Math.floor(r)) > rate;
  });
}

export const DropoutLab: PresetComponent = forwardRef(function DropoutLab(_props, ref) {
  const [rate, setRate] = useState(0.5);
  const [seed, setSeed] = useState(1);
  const net = createTinyNetwork();
  const inputs = [1, 0];
  const { hiddenPre, hidden, outputPre, output } = forwardTiny(net, inputs);
  const mask = dropoutMask(hidden.length, rate, seed);
  const dropped = hidden.map((h, i) => (mask[i] ? h : 0));
  const activeCount = mask.filter(Boolean).length;

  const snapshot: SimSnapshot = useMemo(
    () => ({
      presetId: "nn-dropout",
      params: { rate, activeCount },
      metrics: { output, activeCount, rate },
      flags: { triedDropout: rate > 0.2 && seed > 1 },
    }),
    [rate, output, activeCount, seed],
  );

  useImperativeHandle(ref, () => ({
    reset: () => { setRate(0.5); setSeed(1); },
    getSnapshot: () => snapshot,
    getState: () => ({ rate, seed }),
  }));
  useLabSnapshot(snapshot);

  const maskedNet = { ...net, frozenHidden: false };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-bg-deep/70 p-3">
        <NetworkCanvas net={maskedNet} inputs={inputs}
          activations={{ hidden: dropped, hiddenPre, output, outputPre }} mode="heat" flowPhase={1} />
      </div>
      <InteractiveSlider label="Dropout rate" value={rate} min={0} max={0.9} step={0.05} format={(v) => `${(v * 100).toFixed(0)}%`} accent="coral" onChange={setRate} />
      <div className="grid grid-cols-3 gap-2">
        <MetricChip label="active neurons" value={`${activeCount}/${hidden.length}`} tone="mint" />
        <MetricChip label="ŷ (with dropout)" value={output.toFixed(3)} />
        <MetricChip label="mask seed" value={String(seed)} />
      </div>
      <Button onClick={() => setSeed((s) => s + 1)}>Resample dropout mask →</Button>
      <ExperienceHint>Each forward pass randomly silences neurons. Resample — output changes. That randomness prevents co-adaptation.</ExperienceHint>
    </div>
  );
});
