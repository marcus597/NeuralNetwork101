"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/Button";
import { NetworkCanvas } from "@/components/experience/NetworkCanvas";
import { FrameScrubber } from "@/components/experience/FrameScrubber";
import { MetricChip } from "@/components/experience/ExperienceChrome";
import { usePlayback } from "@/hooks/usePlayback";
import {
  cloneNetwork,
  createTinyNetwork,
  recordTrainingFrame,
  trainTinyStep,
  accuracy,
  type TrainingFrame,
} from "@/lib/nn/math";

export function TrainingLabPreview() {
  const [frames, setFrames] = useState<TrainingFrame[]>(() => [
    recordTrainingFrame(0, createTinyNetwork()),
  ]);
  const playback = usePlayback(frames.length, 300);

  const current = frames[playback.index] ?? frames[0];
  const sample = current.sampleTraces[0];

  const train = useCallback(() => {
    let net = cloneNetwork(frames[frames.length - 1].net);
    const newFrames = [...frames];
    let step = frames[frames.length - 1].step;
    for (let i = 0; i < 15; i++) {
      const r = trainTinyStep(net, 0.6);
      net = r.net;
      step += 1;
      newFrames.push({
        step,
        net: cloneNetwork(net),
        loss: r.loss,
        accuracy: accuracy(net),
        gradients: r.gradients,
        sampleTraces: r.sampleTraces,
      });
    }
    const trimmed = newFrames.slice(-60);
    setFrames(trimmed);
    playback.setIndex(trimmed.length - 1);
  }, [frames, playback]);

  return (
    <div className="panel space-y-4 p-4 sm:p-5">
      <div className="rounded-xl bg-bg-deep/70 p-3">
        <NetworkCanvas
          net={current.net}
          inputs={sample?.inputs ?? [1, 0]}
          activations={
            sample
              ? {
                  hidden: sample.hidden,
                  hiddenPre: sample.hiddenPre,
                  output: sample.output,
                  outputPre: sample.outputPre,
                }
              : undefined
          }
          mode="weights"
        />
      </div>

      <FrameScrubber
        index={playback.index}
        total={frames.length}
        playing={playback.playing}
        speed={playback.speed}
        label="Step"
        onIndexChange={playback.setIndex}
        onPlay={playback.play}
        onPause={playback.pause}
        onStepForward={playback.stepForward}
        onStepBack={playback.stepBack}
        onRewind={playback.rewind}
        onSpeedChange={playback.setSpeed}
      />

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={train}>Train on XOR</Button>
        <MetricChip label="loss" value={current.loss.toFixed(3)} tone={current.loss < 0.15 ? "mint" : "coral"} />
        <MetricChip label="step" value={String(current.step)} />
      </div>
    </div>
  );
}
