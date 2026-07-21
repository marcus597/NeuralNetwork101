"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { NetworkCanvas } from "@/components/experience/NetworkCanvas";
import { FrameScrubber } from "@/components/experience/FrameScrubber";
import { ControlDock, ExperienceHint, MetricChip } from "@/components/experience/ExperienceChrome";
import { usePlayback } from "@/hooks/usePlayback";
import {
  forwardTiny,
  createTinyNetwork,
  type TinyNetwork,
} from "@/lib/nn/math";
import { useLabSnapshot } from "@/lib/nn/useLabSnapshot";
import type { SimSnapshot } from "@/engines/interaction/types";
import type { PresetComponent } from "@/engines/presets/PresetPlayground";

const FLOW_STEPS = 4;

export const ForwardPassLab: PresetComponent = forwardRef(function ForwardPassLab(_props, ref) {
  const [net, setNet] = useState<TinyNetwork>(createTinyNetwork);
  const [inputs, setInputs] = useState([1, 0]);
  const playback = usePlayback(FLOW_STEPS, 700);

  const { hiddenPre, hidden, outputPre, output } = forwardTiny(net, inputs);
  const flowPhase = playback.index;

  const snapshot: SimSnapshot = useMemo(
    () => ({
      presetId: "nn-forward",
      params: { out: output },
      metrics: { output, hidden0: hidden[0] ?? 0, hidden1: hidden[1] ?? 0 },
      flags: { traced: flowPhase >= 3 },
    }),
    [output, hidden, flowPhase],
  );

  useImperativeHandle(ref, () => ({
    reset: () => {
      setNet(createTinyNetwork());
      setInputs([1, 0]);
      playback.rewind();
    },
    getSnapshot: () => snapshot,
    getState: () => ({ net, inputs, flowPhase }),
  }));

  useLabSnapshot(snapshot);

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-bg-deep/70 p-4">
        <NetworkCanvas
          net={net}
          inputs={inputs}
          activations={{ hidden, hiddenPre, output, outputPre }}
          flowPhase={flowPhase}
          mode="heat"
        />
      </div>

      <FrameScrubber
        index={playback.index}
        total={FLOW_STEPS}
        playing={playback.playing}
        speed={playback.speed}
        label="Forward step"
        onIndexChange={playback.setIndex}
        onPlay={playback.play}
        onPause={playback.pause}
        onStepForward={playback.stepForward}
        onStepBack={playback.stepBack}
        onRewind={playback.rewind}
        onSpeedChange={playback.setSpeed}
      />

      <ControlDock>
        {inputs.map((v, i) => (
          <div key={i} className="min-w-[120px] flex-1">
            <InteractiveSlider
              label={`x${i + 1}`}
              value={v}
              min={0}
              max={1}
              step={1}
              format={(n) => n.toFixed(0)}
              accent="sky"
              onChange={(val) => {
                const next = [...inputs];
                next[i] = val;
                setInputs(next);
                playback.rewind();
              }}
            />
          </div>
        ))}
      </ControlDock>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <MetricChip label="h₁ pre" value={(hiddenPre[0] ?? 0).toFixed(2)} />
        <MetricChip label="h₁" value={(hidden[0] ?? 0).toFixed(2)} tone="mint" />
        <MetricChip label="h₂ pre" value={(hiddenPre[1] ?? 0).toFixed(2)} />
        <MetricChip label="ŷ" value={output.toFixed(3)} tone={output > 0.5 ? "mint" : "coral"} />
      </div>

      <ExperienceHint>
        Scrub forward steps — watch the green pulse carry signal through every connection. Change inputs and replay.
      </ExperienceHint>
    </div>
  );
});
