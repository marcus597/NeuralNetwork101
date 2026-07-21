"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { BLUR_KERNEL, convolve2d, defaultDigitGrid, EDGE_KERNEL } from "@/lib/nn/conv";
import { useLabSnapshot } from "@/lib/nn/useLabSnapshot";
import type { SimSnapshot } from "@/engines/interaction/types";
import type { PresetComponent } from "@/engines/presets/PresetPlayground";
import { ControlDock, ExperienceHint, MetricChip } from "@/components/experience/ExperienceChrome";
import { cn } from "@/lib/cn";

export const ConvLab: PresetComponent = forwardRef(function ConvLab(_props, ref) {
  const [kernel, setKernel] = useState<"edge" | "blur" | "custom">("edge");
  const [kw, setKw] = useState(1);
  const grid = defaultDigitGrid();
  const k = kernel === "edge" ? EDGE_KERNEL : kernel === "blur" ? BLUR_KERNEL : [
    [0, -kw, 0], [-kw, 1 + 4 * kw, -kw], [0, -kw, 0],
  ];
  const out = convolve2d(grid, k);
  const maxOut = Math.max(...out.flat().map(Math.abs), 0.01);

  const snapshot: SimSnapshot = useMemo(
    () => ({
      presetId: "nn-conv",
      params: { kernel },
      metrics: { activation: out.flat().reduce((a, b) => a + Math.abs(b), 0) / out.flat().length },
      flags: { triedCustom: kernel === "custom" },
    }),
    [kernel, out],
  );

  useImperativeHandle(ref, () => ({
    reset: () => { setKernel("edge"); setKw(1); },
    getSnapshot: () => snapshot,
    getState: () => ({ kernel }),
  }));
  useLabSnapshot(snapshot);

  const Cell = ({ v, hi }: { v: number; hi?: boolean }) => (
    <div className={cn("aspect-square rounded-sm", hi ? "ring-1 ring-mint" : "")}
      style={{ background: `rgba(139,124,255,${Math.min(1, Math.abs(v) / (hi ? 1 : 8))})` }} />
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="mb-1 text-[10px] uppercase text-ink-muted">Input</p>
          <div className="grid grid-cols-8 gap-0.5">{grid.flatMap((row, y) => row.map((v, x) => <Cell key={`${y}-${x}`} v={v} />))}</div>
        </div>
        <div>
          <p className="mb-1 text-[10px] uppercase text-ink-muted">Filter 3×3</p>
          <div className="grid grid-cols-3 gap-1">{k.flatMap((row, y) => row.map((v, x) => (
            <div key={`k${y}${x}`} className="flex aspect-square items-center justify-center rounded bg-gold/20 font-mono text-[10px] text-gold">{v.toFixed(1)}</div>
          )))}</div>
        </div>
        <div>
          <p className="mb-1 text-[10px] uppercase text-ink-muted">Feature map</p>
          <div className="grid grid-cols-8 gap-0.5">{out.flatMap((row, y) => row.map((v, x) => <Cell key={`o${y}${x}`} v={v / maxOut * 8} hi={Math.abs(v) > maxOut * 0.7} />))}</div>
        </div>
      </div>
      <ControlDock>
        {(["edge", "blur", "custom"] as const).map((k) => (
          <button key={k} type="button" onClick={() => setKernel(k)}
            className={cn("focus-ring rounded-full px-4 py-2 text-sm capitalize", kernel === k ? "bg-violet/20 text-violet" : "bg-bg-muted text-ink-muted")}>{k}</button>
        ))}
      </ControlDock>
      {kernel === "custom" && <InteractiveSlider label="Custom edge strength" value={kw} min={0.2} max={2} step={0.1} accent="gold" onChange={setKw} />}
      <MetricChip label="mean |activation|" value={snapshot.metrics.activation?.toFixed(3) ?? "0"} tone="mint" />
      <ExperienceHint>The filter slides across every position — local patterns become feature maps. Try edge vs blur.</ExperienceHint>
    </div>
  );
});
