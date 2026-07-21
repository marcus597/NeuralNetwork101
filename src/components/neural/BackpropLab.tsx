"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { NetworkCanvas } from "@/components/experience/NetworkCanvas";
import { FrameScrubber } from "@/components/experience/FrameScrubber";
import { ControlDock, ExperienceHint, MetricChip } from "@/components/experience/ExperienceChrome";
import { usePlayback } from "@/hooks/usePlayback";
import {
  computeGradients,
  createTinyNetwork,
  forwardTiny,
  type TinyNetwork,
} from "@/lib/nn/math";
import { useLabSnapshot } from "@/lib/nn/useLabSnapshot";
import type { SimSnapshot } from "@/engines/interaction/types";
import type { PresetComponent } from "@/engines/presets/PresetPlayground";
import { cn } from "@/lib/cn";

const SAMPLES = [
  { inputs: [0, 0], target: 0 },
  { inputs: [0, 1], target: 1 },
  { inputs: [1, 0], target: 1 },
  { inputs: [1, 1], target: 0 },
];

const BACKPROP_STEPS = 5;

export const BackpropLab: PresetComponent = forwardRef(function BackpropLab(_props, ref) {
  const [net] = useState<TinyNetwork>(createTinyNetwork);
  const [sampleIdx, setSampleIdx] = useState(1);
  const playback = usePlayback(BACKPROP_STEPS, 900);

  const sample = SAMPLES[sampleIdx];
  const { hiddenPre, hidden, outputPre, output } = forwardTiny(net, sample.inputs);
  const { gradients, sampleTraces } = computeGradients(net, [sample]);
  const trace = sampleTraces[0];
  const err = output - sample.target;

  const phase = playback.index;
  const showGradients = phase >= 2;

  const snapshot: SimSnapshot = useMemo(
    () => ({
      presetId: "nn-backprop",
      params: { phase },
      metrics: { error: Math.abs(err), phase },
      flags: { completed: phase >= BACKPROP_STEPS - 1 },
    }),
    [phase, err],
  );

  useImperativeHandle(ref, () => ({
    reset: () => {
      setSampleIdx(1);
      playback.rewind();
    },
    getSnapshot: () => snapshot,
    getState: () => ({ phase, sampleIdx }),
  }));

  useLabSnapshot(snapshot);

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-bg-deep/70 p-4">
        <NetworkCanvas
          net={net}
          inputs={sample.inputs}
          activations={{ hidden, hiddenPre, output, outputPre }}
          gradients={showGradients ? gradients : undefined}
          flowPhase={phase >= 1 ? (phase >= 3 ? 2 : 1) : 0}
          mode={showGradients ? "backprop" : "heat"}
        />
      </div>

      <FrameScrubber
        index={playback.index}
        total={BACKPROP_STEPS}
        playing={playback.playing}
        speed={playback.speed}
        label="Backprop step"
        onIndexChange={playback.setIndex}
        onPlay={playback.play}
        onPause={playback.pause}
        onStepForward={playback.stepForward}
        onStepBack={playback.stepBack}
        onRewind={playback.rewind}
        onSpeedChange={playback.setSpeed}
      />

      <ControlDock>
        {SAMPLES.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setSampleIdx(i);
              playback.rewind();
            }}
            className={cn(
              "focus-ring rounded-full px-3 py-1.5 font-mono text-xs",
              sampleIdx === i ? "bg-violet/20 text-violet ring-1 ring-violet/30" : "bg-bg-muted text-ink-muted",
            )}
          >
            ({s.inputs[0]},{s.inputs[1]})→{s.target}
          </button>
        ))}
      </ControlDock>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <MetricChip label="ŷ" value={output.toFixed(3)} />
        <MetricChip label="target" value={String(sample.target)} />
        <MetricChip label="error" value={err.toFixed(3)} tone={Math.abs(err) > 0.3 ? "coral" : "mint"} />
        <MetricChip
          label="∂L/∂z_out"
          value={trace ? trace.dOutputPre.toFixed(3) : "—"}
          tone="gold"
        />
      </div>

      <div className="flex gap-1.5">
        {Array.from({ length: BACKPROP_STEPS }).map((_, i) => (
          <div
            key={i}
            className={cn("h-1.5 flex-1 rounded-full", i <= phase ? "bg-violet" : "bg-bg-inset")}
          />
        ))}
      </div>

      <ExperienceHint>
        Scrub backprop steps — red/green edges show gradient direction and magnitude. Slow motion reveals how error flows backward through every weight.
      </ExperienceHint>
    </div>
  );
});
