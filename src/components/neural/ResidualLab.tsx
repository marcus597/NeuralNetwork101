"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { useLabSnapshot } from "@/lib/nn/useLabSnapshot";
import type { SimSnapshot } from "@/engines/interaction/types";
import type { PresetComponent } from "@/engines/presets/PresetPlayground";
import { ExperienceHint, MetricChip } from "@/components/experience/ExperienceChrome";
import { cn } from "@/lib/cn";

export const ResidualLab: PresetComponent = forwardRef(function ResidualLab(_props, ref) {
  const [depth, setDepth] = useState(4);
  const [residual, setResidual] = useState(false);
  const [signal, setSignal] = useState(1);

  const decay = residual ? 0.92 : 0.55;
  const output = signal * decay ** depth;
  const gradFlow = decay ** depth;

  const snapshot: SimSnapshot = useMemo(
    () => ({
      presetId: "nn-residual",
      params: { depth, residual: residual ? 1 : 0 },
      metrics: { output, gradFlow },
      flags: { comparedResidual: residual && depth >= 6 },
    }),
    [depth, residual, output, gradFlow],
  );

  useImperativeHandle(ref, () => ({
    reset: () => { setDepth(4); setResidual(false); setSignal(1); },
    getSnapshot: () => snapshot,
    getState: () => ({ depth, residual }),
  }));
  useLabSnapshot(snapshot);

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-bg-deep/70 p-4">
        <svg viewBox="0 0 320 120" className="w-full">
          {Array.from({ length: depth }).map((_, i) => {
            const x = 30 + i * (260 / Math.max(depth - 1, 1));
            return (
              <g key={i}>
                <rect x={x - 18} y={40} width={36} height={36} rx={6}
                  fill={residual ? "rgba(61,255,181,0.15)" : "rgba(139,124,255,0.15)"}
                  stroke={residual ? "#3dffb5" : "#8b7cff"} strokeWidth={1.5} />
                {residual && i > 0 && (
                  <path d={`M ${x - 40} 30 Q ${x - 20} 10 ${x - 18} 40`} fill="none" stroke="rgba(255,200,87,0.7)" strokeWidth={1.5} strokeDasharray="4 2" />
                )}
                <text x={x} y={62} textAnchor="middle" className="fill-white/60 text-[9px]">L{i + 1}</text>
              </g>
            );
          })}
          <text x={280} y={62} className="fill-mint text-xs font-mono">{output.toFixed(3)}</text>
        </svg>
      </div>
      <InteractiveSlider label="Network depth (layers)" value={depth} min={2} max={12} step={1} format={(v) => String(v)} accent="violet" onChange={setDepth} />
      <button type="button" onClick={() => setResidual((r) => !r)}
        className={cn("focus-ring w-full rounded-xl py-3 text-sm font-semibold", residual ? "bg-gold/15 text-gold ring-1 ring-gold/30" : "bg-bg-muted text-ink-muted ring-1 ring-border-subtle")}>
        Skip connections {residual ? "ON" : "OFF"}
      </button>
      <div className="grid grid-cols-2 gap-2">
        <MetricChip label="output signal" value={output.toFixed(4)} tone={output > 0.1 ? "mint" : "coral"} />
        <MetricChip label="gradient at input" value={gradFlow.toFixed(4)} tone={gradFlow > 0.05 ? "mint" : "coral"} />
      </div>
      <ExperienceHint>Deep plain networks bleed signal. Toggle skip connections — watch gradient survive to the first layer.</ExperienceHint>
    </div>
  );
});
