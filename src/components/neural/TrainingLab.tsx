"use client";

import { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from "react";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { Button } from "@/components/ui/Button";
import { NetworkCanvas } from "@/components/experience/NetworkCanvas";
import { FrameScrubber } from "@/components/experience/FrameScrubber";
import { ControlDock, ExperienceHint, MetricChip } from "@/components/experience/ExperienceChrome";
import { usePlayback } from "@/hooks/usePlayback";
import {
  XOR_DATA,
  accuracy,
  cloneNetwork,
  createTinyNetwork,
  recordTrainingFrame,
  trainTinyStep,
  type DataPoint,
  type OptimizerId,
  type OptimizerState,
  type TrainingFrame,
  type TinyNetwork,
} from "@/lib/nn/math";
import { useLabSnapshot } from "@/lib/nn/useLabSnapshot";
import type { SimSnapshot } from "@/engines/interaction/types";
import type { PresetComponent } from "@/engines/presets/PresetPlayground";
import { cn } from "@/lib/cn";

export const TrainingLab: PresetComponent = forwardRef(function TrainingLab(_props, ref) {
  const [deep, setDeep] = useState(true);
  const [data, setData] = useState<DataPoint[]>(
    XOR_DATA.map((d) => ({ inputs: [...d.inputs], target: d.target })),
  );
  const [frames, setFrames] = useState<TrainingFrame[]>(() => [
    recordTrainingFrame(0, createTinyNetwork()),
  ]);
  const [lr, setLr] = useState(0.5);
  const [optimizerId, setOptimizerId] = useState<OptimizerId>("sgd");
  const [freezeHidden, setFreezeHidden] = useState(false);
  const playback = usePlayback(frames.length, 350);

  const current = frames[playback.index] ?? frames[0];
  const net = current.net;
  const sample = data[0];
  const trace = current.sampleTraces[0];

  const snapshot: SimSnapshot = useMemo(
    () => ({
      presetId: "nn-training",
      params: { step: current.step, lr },
      metrics: { loss: current.loss, accuracy: current.accuracy, step: current.step },
      flags: { xorSolved: current.accuracy >= 1 && current.step > 0 },
    }),
    [current, lr],
  );

  const resetAll = useCallback(() => {
    const n = createTinyNetwork(deep ? 2 : 0);
    setFrames([recordTrainingFrame(0, n)]);
    playback.rewind();
  }, [deep, playback]);

  useImperativeHandle(ref, () => ({
    reset: resetAll,
    getSnapshot: () => snapshot,
    getState: () => ({ frames, lr }),
  }));

  useLabSnapshot(snapshot);

  const trainSteps = (count: number) => {
    let working = cloneNetwork(frames[frames.length - 1].net);
    let opt: OptimizerState = { id: optimizerId };
    const newFrames = [...frames];
    let step = frames[frames.length - 1].step;

    working = { ...working, frozenHidden: freezeHidden };

    for (let i = 0; i < count; i++) {
      const result = trainTinyStep(working, lr, data, opt);
      working = { ...result.net, frozenHidden: freezeHidden };
      opt = result.optimizer;
      step += 1;
      newFrames.push({
        step,
        net: cloneNetwork(working),
        loss: result.loss,
        accuracy: accuracy(working, data),
        gradients: result.gradients,
        sampleTraces: result.sampleTraces,
      });
    }
    setFrames(newFrames.slice(-120));
    playback.setIndex(newFrames.length - 1);
  };

  const toggleDeep = () => {
    setDeep((d) => {
      const next = !d;
      const n = createTinyNetwork(next ? 2 : 0);
      setFrames([recordTrainingFrame(0, n)]);
      playback.rewind();
      return next;
    });
  };

  const flipTarget = (idx: number) => {
    setData((d) =>
      d.map((pt, i) => (i === idx ? { ...pt, target: pt.target === 1 ? 0 : 1 } : pt)),
    );
    resetAll();
  };

  const landscape = useMemo(() => {
    const n = current.net;
    if (n.w2.length < 2) return null;
    const grid = 16;
    const pts: { x: number; y: number; loss: number }[] = [];
    for (let i = 0; i <= grid; i++) {
      for (let j = 0; j <= grid; j++) {
        const trial = cloneNetwork(n);
        trial.w2[0] = n.w2[0] + ((i / grid) * 2 - 1) * 1.5;
        trial.w2[1] = n.w2[1] + ((j / grid) * 2 - 1) * 1.5;
        const loss = recordTrainingFrame(0, trial).loss;
        pts.push({ x: i, y: j, loss });
      }
    }
    return pts;
  }, [current.net]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl bg-bg-deep/70 p-3">
          <NetworkCanvas
            net={net}
            inputs={sample?.inputs ?? [0, 0]}
            activations={
              trace
                ? {
                    hidden: trace.hidden,
                    hiddenPre: trace.hiddenPre,
                    output: trace.output,
                    outputPre: trace.outputPre,
                  }
                : undefined
            }
            gradients={current.gradients}
            mode="weights"
          />
        </div>

        {landscape && (
          <div className="rounded-xl bg-bg-deep/70 p-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
              Loss landscape (w₂ slice)
            </p>
            <svg viewBox="0 0 160 160" className="w-full max-w-[200px]">
              {landscape.map((p, i) => {
                const t = Math.min(1, p.loss / 0.5);
                return (
                  <rect
                    key={i}
                    x={(p.x / 16) * 160}
                    y={(p.y / 16) * 160}
                    width={10}
                    height={10}
                    fill={`rgba(139,124,255,${0.15 + t * 0.75})`}
                  />
                );
              })}
              <circle
                cx={(8 / 16) * 160}
                cy={(8 / 16) * 160}
                r={4}
                fill="#3dffb5"
                stroke="white"
                strokeWidth={1.5}
              />
            </svg>
          </div>
        )}
      </div>

      <FrameScrubber
        index={playback.index}
        total={frames.length}
        playing={playback.playing}
        speed={playback.speed}
        label="Training step"
        onIndexChange={playback.setIndex}
        onPlay={playback.play}
        onPause={playback.pause}
        onStepForward={playback.stepForward}
        onStepBack={playback.stepBack}
        onRewind={playback.rewind}
        onSpeedChange={playback.setSpeed}
      />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <MetricChip label="step" value={String(current.step)} />
        <MetricChip label="loss" value={current.loss.toFixed(4)} tone={current.loss < 0.1 ? "mint" : "coral"} />
        <MetricChip label="accuracy" value={`${(current.accuracy * 100).toFixed(0)}%`} tone={current.accuracy >= 1 ? "mint" : "violet"} />
        <MetricChip label="depth" value={deep ? "2 hidden" : "0 hidden"} tone="sky" />
      </div>

      <ControlDock>
        <button
          type="button"
          onClick={toggleDeep}
          className={cn(
            "focus-ring rounded-full px-4 py-2 text-sm font-medium",
            deep ? "bg-violet/20 text-violet ring-1 ring-violet/30" : "bg-bg-muted text-ink-muted",
          )}
        >
          {deep ? "Deep (2 hidden)" : "Shallow (linear)"}
        </button>
        <button
          type="button"
          onClick={() => setFreezeHidden((f) => !f)}
          className={cn(
            "focus-ring rounded-full px-4 py-2 text-sm",
            freezeHidden ? "bg-gold/15 text-gold" : "bg-bg-muted text-ink-muted",
          )}
        >
          {freezeHidden ? "Hidden frozen" : "Hidden trainable"}
        </button>
        {(["sgd", "momentum", "adam"] as OptimizerId[]).map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => setOptimizerId(o)}
            className={cn(
              "focus-ring rounded-full px-3 py-2 text-xs font-medium uppercase",
              optimizerId === o ? "bg-sky/15 text-sky ring-1 ring-sky/25" : "bg-bg-muted text-ink-muted",
            )}
          >
            {o}
          </button>
        ))}
      </ControlDock>

      <InteractiveSlider label="Learning rate η" value={lr} min={0.05} max={1.5} step={0.05} accent={lr > 1.2 ? "coral" : "sky"} onChange={setLr} />

      <div className="flex flex-wrap gap-2">
        {data.map((pt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => flipTarget(i)}
            className="focus-ring rounded-lg border border-border-subtle bg-bg-stage px-3 py-2 font-mono text-xs hover:border-violet/30"
            title="Click to flip target — edit the dataset"
          >
            ({pt.inputs[0]},{pt.inputs[1]})→{pt.target}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => trainSteps(1)}>Train 1 step</Button>
        <Button variant="secondary" onClick={() => trainSteps(20)}>
          Train ×20
        </Button>
        <Button variant="ghost" onClick={resetAll}>
          Reset
        </Button>
      </div>

      <div className="flex h-16 items-end gap-0.5 rounded-lg bg-bg-stage p-2">
        {frames.map((f, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 rounded-t transition-colors",
              i === playback.index ? "bg-mint/80" : "bg-violet/40",
            )}
            style={{ height: `${Math.min(100, f.loss * 100 + 4)}%`, minHeight: 2 }}
          />
        ))}
      </div>

      <ExperienceHint>
        Train, then scrub frame-by-frame — watch weights thicken and the loss landscape dot move. Try shallow vs deep on XOR. Flip a target and watch it fail.
      </ExperienceHint>
    </div>
  );
});
