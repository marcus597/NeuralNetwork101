"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { motion } from "motion/react";
import { FrameScrubber } from "@/components/experience/FrameScrubber";
import { usePlayback } from "@/hooks/usePlayback";
import { useLabSnapshot } from "@/lib/nn/useLabSnapshot";
import type { SimSnapshot } from "@/engines/interaction/types";
import type { PresetComponent } from "@/engines/presets/PresetPlayground";
import { ExperienceHint, MetricChip } from "@/components/experience/ExperienceChrome";
import { cn } from "@/lib/cn";

const BLOCKS = [
  { id: "embed", label: "Token embed", color: "sky" },
  { id: "attn", label: "Self-attention", color: "violet" },
  { id: "ffn", label: "Feed-forward", color: "mint" },
  { id: "norm", label: "Layer norm", color: "gold" },
  { id: "out", label: "Next token", color: "coral" },
];

export const TransformerLab: PresetComponent = forwardRef(function TransformerLab(_props, ref) {
  const [layers, setLayers] = useState(2);
  const playback = usePlayback(BLOCKS.length * layers, 600);
  const step = playback.index;
  const layerIdx = Math.floor(step / BLOCKS.length);
  const blockIdx = step % BLOCKS.length;

  const snapshot: SimSnapshot = useMemo(
    () => ({
      presetId: "nn-transformer",
      params: { layers, step },
      metrics: { layer: layerIdx, block: blockIdx, step },
      flags: { sawFullPass: step >= BLOCKS.length * layers - 1 },
    }),
    [layers, step, layerIdx, blockIdx],
  );

  useImperativeHandle(ref, () => ({
    reset: () => { setLayers(2); playback.rewind(); },
    getSnapshot: () => snapshot,
    getState: () => ({ layers, step }),
  }));
  useLabSnapshot(snapshot);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {[1, 2, 4].map((n) => (
          <button key={n} type="button" onClick={() => { setLayers(n); playback.rewind(); }}
            className={cn("focus-ring rounded-full px-3 py-1.5 text-xs", layers === n ? "bg-violet/20 text-violet" : "bg-bg-muted text-ink-muted")}>{n} layers</button>
        ))}
      </div>
      <div className="space-y-2 rounded-xl bg-bg-deep/70 p-4">
        {Array.from({ length: layers }).map((_, li) => (
          <div key={li} className="flex flex-wrap gap-2">
            {BLOCKS.map((b, bi) => {
              const active = li === layerIdx && bi === blockIdx;
              const past = li < layerIdx || (li === layerIdx && bi < blockIdx);
              return (
                <motion.div key={b.id} animate={{ scale: active ? 1.05 : 1, opacity: past ? 0.5 : active ? 1 : 0.35 }}
                  className={cn("rounded-lg px-3 py-2 text-xs font-medium ring-1",
                    b.color === "violet" && "bg-violet/15 text-violet ring-violet/25",
                    b.color === "mint" && "bg-mint/15 text-mint ring-mint/25",
                    b.color === "sky" && "bg-sky/15 text-sky ring-sky/25",
                    b.color === "gold" && "bg-gold/15 text-gold ring-gold/25",
                    b.color === "coral" && "bg-coral/15 text-coral ring-coral/25",
                  )}>{b.label}</motion.div>
              );
            })}
          </div>
        ))}
      </div>
      <FrameScrubber index={playback.index} total={BLOCKS.length * layers} playing={playback.playing} speed={playback.speed}
        label="Block" onIndexChange={playback.setIndex} onPlay={playback.play} onPause={playback.pause}
        onStepForward={playback.stepForward} onStepBack={playback.stepBack} onRewind={playback.rewind} onSpeedChange={playback.setSpeed} />
      <MetricChip label="active" value={`Layer ${layerIdx + 1} · ${BLOCKS[blockIdx]?.label}`} tone="violet" />
      <ExperienceHint>Scrub through a transformer — every token talks to every other token via self-attention, then gets transformed.</ExperienceHint>
    </div>
  );
});
