"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { attentionWeights, weightedSum } from "@/lib/nn/sequence";
import { useLabSnapshot } from "@/lib/nn/useLabSnapshot";
import type { SimSnapshot } from "@/engines/interaction/types";
import type { PresetComponent } from "@/engines/presets/PresetPlayground";
import { ExperienceHint, MetricChip } from "@/components/experience/ExperienceChrome";
import { cn } from "@/lib/cn";

const TOKENS = ["The", "cat", "sat", "mat"];
const KEYS = [[1, 0], [0.8, 0.6], [0.2, 0.9], [0.7, 0.5]];
const VALUES = [[1, 0], [0, 1], [0.5, 0.5], [0.3, 0.8]];

export const AttentionLab: PresetComponent = forwardRef(function AttentionLab(_props, ref) {
  const [queryIdx, setQueryIdx] = useState(1);
  const query = KEYS[queryIdx];
  const weights = attentionWeights(query, KEYS);
  const output = weightedSum(weights, VALUES);
  const maxW = Math.max(...weights);

  const snapshot: SimSnapshot = useMemo(
    () => ({
      presetId: "nn-attention",
      params: { queryIdx },
      metrics: { maxWeight: maxW, entropy: -weights.reduce((s, w) => s + (w > 0 ? w * Math.log(w) : 0), 0) },
      flags: { focusedAttention: maxW > 0.5 },
    }),
    [queryIdx, weights, maxW],
  );

  useImperativeHandle(ref, () => ({
    reset: () => setQueryIdx(1),
    getSnapshot: () => snapshot,
    getState: () => ({ queryIdx }),
  }));
  useLabSnapshot(snapshot);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-[10px] uppercase text-ink-muted">Pick query token</p>
          <div className="flex flex-wrap gap-2">
            {TOKENS.map((t, i) => (
              <button key={t} type="button" onClick={() => setQueryIdx(i)}
                className={cn("focus-ring rounded-full px-3 py-1.5 text-sm", queryIdx === i ? "bg-violet/20 text-violet ring-1 ring-violet/30" : "bg-bg-muted text-ink-muted")}>{t}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {weights.map((w, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-full rounded bg-violet/30 transition-all" style={{ height: `${w * 80 + 4}px`, background: `rgba(139,124,255,${w})` }} />
              <span className="text-[9px] text-ink-muted">{TOKENS[i]}</span>
              <span className="font-mono text-[9px] text-violet">{(w * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl bg-bg-deep/70 p-4 font-mono text-sm">
        <p className="text-ink-muted">Weighted sum of values:</p>
        <p className="mt-1 text-mint">[{output.map((v) => v.toFixed(2)).join(", ")}]</p>
      </div>
      <MetricChip label="strongest focus" value={`${TOKENS[weights.indexOf(maxW)]} (${(maxW * 100).toFixed(0)}%)`} tone="mint" />
      <ExperienceHint>Change the query — attention weights shift. The output is a blend of all values, weighted by relevance.</ExperienceHint>
    </div>
  );
});
