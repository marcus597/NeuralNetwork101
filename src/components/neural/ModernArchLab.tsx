"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { motion } from "motion/react";
import { useLabSnapshot } from "@/lib/nn/useLabSnapshot";
import type { SimSnapshot } from "@/engines/interaction/types";
import type { PresetComponent } from "@/engines/presets/PresetPlayground";
import { ExperienceHint, MetricChip } from "@/components/experience/ExperienceChrome";
import { cn } from "@/lib/cn";

const ARCHS = [
  { id: "mlp", name: "Feedforward", era: "1980s–", strength: "Tabular data, simple patterns", flow: ["Input", "Hidden", "Hidden", "Output"] },
  { id: "cnn", name: "Convolutional", era: "2012–", strength: "Images, spatial patterns", flow: ["Image", "Conv", "Pool", "Conv", "Class"] },
  { id: "rnn", name: "Recurrent", era: "1990s–", strength: "Sequences, time series", flow: ["x₁", "h₁", "h₂", "h₃", "y"] },
  { id: "transformer", name: "Transformer", era: "2017–", strength: "Language, long-range context", flow: ["Tokens", "Attention", "FFN", "Attention", "Logits"] },
  { id: "diffusion", name: "Diffusion", era: "2020–", strength: "Image/audio generation", flow: ["Noise", "Denoise", "Denoise", "Sample"] },
];

export const ModernArchLab: PresetComponent = forwardRef(function ModernArchLab(_props, ref) {
  const [arch, setArch] = useState(0);
  const [pulse, setPulse] = useState(0);
  const current = ARCHS[arch];

  const snapshot: SimSnapshot = useMemo(
    () => ({
      presetId: "nn-modern",
      params: { arch: arch },
      metrics: { viewed: arch + 1 },
      flags: { exploredAll: arch >= ARCHS.length - 1 },
    }),
    [arch],
  );

  useImperativeHandle(ref, () => ({
    reset: () => { setArch(0); setPulse(0); },
    getSnapshot: () => snapshot,
    getState: () => ({ arch }),
  }));
  useLabSnapshot(snapshot);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {ARCHS.map((a, i) => (
          <button key={a.id} type="button" onClick={() => { setArch(i); setPulse(0); }}
            className={cn("focus-ring rounded-full px-3 py-2 text-xs font-medium", arch === i ? "bg-violet/20 text-violet ring-1 ring-violet/30" : "bg-bg-muted text-ink-muted")}>{a.name}</button>
        ))}
      </div>
      <div className="rounded-xl bg-bg-deep/70 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-ink">{current.name}</h3>
          <span className="text-xs text-ink-muted">{current.era}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {current.flow.map((node, i) => (
            <div key={i} className="flex items-center gap-2">
              <motion.div animate={{ opacity: pulse >= i ? 1 : 0.35, scale: pulse === i ? 1.08 : 1 }}
                className="rounded-lg bg-violet/15 px-3 py-2 text-xs font-medium text-violet ring-1 ring-violet/25">{node}</motion.div>
              {i < current.flow.length - 1 && <span className="text-ink-muted">→</span>}
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-ink-muted">{current.strength}</p>
      </div>
      <button type="button" onClick={() => setPulse((p) => (p + 1) % current.flow.length)}
        className="focus-ring w-full rounded-xl bg-sky/15 py-3 text-sm font-medium text-sky ring-1 ring-sky/25">
        Pulse data flow →
      </button>
      <MetricChip label="architectures viewed" value={`${arch + 1} / ${ARCHS.length}`} tone="mint" />
      <ExperienceHint>Hop between eras — each architecture matched the data of its time. Pulse to watch data flow through.</ExperienceHint>
    </div>
  );
});
