"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { FrameScrubber } from "@/components/experience/FrameScrubber";
import { usePlayback } from "@/hooks/usePlayback";
import { createRNN, runRNN } from "@/lib/nn/sequence";
import { useLabSnapshot } from "@/lib/nn/useLabSnapshot";
import type { SimSnapshot } from "@/engines/interaction/types";
import type { PresetComponent } from "@/engines/presets/PresetPlayground";
import { ExperienceHint, MetricChip } from "@/components/experience/ExperienceChrome";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { motion } from "motion/react";

const SEQ = [0, 1, 0, 1, 1];

export const RNNLab: PresetComponent = forwardRef(function RNNLab(_props, ref) {
  const [seq, setSeq] = useState(SEQ);
  const playback = usePlayback(seq.length, 800);
  const rnn = createRNN();
  const steps = runRNN(rnn, seq);
  const current = steps[playback.index] ?? steps[0];

  const snapshot: SimSnapshot = useMemo(
    () => ({
      presetId: "nn-rnn",
      params: { step: playback.index },
      metrics: { hidden: current?.h ?? 0, output: current?.y ?? 0, step: playback.index },
      flags: { unrolled: playback.index >= seq.length - 1 },
    }),
    [playback.index, current, seq.length],
  );

  useImperativeHandle(ref, () => ({
    reset: () => { setSeq(SEQ); playback.rewind(); },
    getSnapshot: () => snapshot,
    getState: () => ({ step: playback.index }),
  }));
  useLabSnapshot(snapshot);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl bg-bg-deep/70 p-4">
        <div className="flex min-w-[480px] items-center gap-2">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <motion.div animate={{ opacity: i === playback.index ? 1 : 0.35, scale: i === playback.index ? 1.05 : 1 }}
                className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky/15 font-mono text-sm ring-1 ring-sky/30">
                {s.x}
              </motion.div>
              <span className="text-ink-muted">→</span>
              <motion.div animate={{ opacity: i === playback.index ? 1 : 0.35 }}
                className="flex h-14 w-14 flex-col items-center justify-center rounded-full bg-violet/15 font-mono text-xs ring-2 ring-violet/40">
                <span className="text-ink-muted">h</span>
                <span className="font-bold text-violet">{s.h.toFixed(2)}</span>
              </motion.div>
              {i < steps.length - 1 && <span className="text-lg text-ink-muted/30">⟶</span>}
            </div>
          ))}
        </div>
      </div>
      <FrameScrubber index={playback.index} total={seq.length} playing={playback.playing} speed={playback.speed}
        label="Timestep" onIndexChange={playback.setIndex} onPlay={playback.play} onPause={playback.pause}
        onStepForward={playback.stepForward} onStepBack={playback.stepBack} onRewind={playback.rewind} onSpeedChange={playback.setSpeed} />
      <InteractiveSlider label={`Input t=${playback.index + 1}`} value={seq[playback.index] ?? 0} min={0} max={1} step={1} format={(v) => v.toFixed(0)}
        accent="sky" onChange={(v) => setSeq((s) => s.map((x, i) => (i === playback.index ? v : x)))} />
      <div className="grid grid-cols-2 gap-2">
        <MetricChip label="hidden hₜ" value={current.h.toFixed(3)} tone="violet" />
        <MetricChip label="output yₜ" value={current.y.toFixed(3)} tone="mint" />
      </div>
      <ExperienceHint>Scrub time — the hidden state carries memory forward. Change an input and replay the sequence.</ExperienceHint>
    </div>
  );
});
