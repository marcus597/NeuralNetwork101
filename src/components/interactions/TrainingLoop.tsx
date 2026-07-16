"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LiveHint } from "@/components/shell/LiveHint";
import { Button } from "@/components/ui/Button";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { TimelineControls } from "@/components/ui/TimelineControls";
import { SimulationHost } from "@/engines/interaction/SimulationHost";
import { useTimeline } from "@/engines/interaction/useTimeline";
import {
  createRegressionTrainingState,
  drawRegressionTrainingSim,
  regressionTrainingPointerDown,
  regressionTrainingPointerMove,
  regressionTrainingPointerUp,
  regressionTrainingSnapshot,
  regressionTrainingStep,
  type RegressionTrainingState,
} from "@/engines/presets/regression-training";
import { buildTrainingTimeline } from "@/lib/viz/training";
import type { SimSnapshot, TimelineStep } from "@/engines/interaction/types";

type TrainingLoopProps = {
  compact?: boolean;
  onSnapshot?: (s: SimSnapshot) => void;
};

export function TrainingLoop({ compact = false, onSnapshot }: TrainingLoopProps) {
  const [sim, setSim] = useState<RegressionTrainingState>(createRegressionTrainingState);

  const loss =
    sim.lossHistory.length > 0
      ? sim.lossHistory[sim.lossHistory.length - 1]
      : sim.points.reduce((s, p) => {
          const pred = sim.slope * p.x + sim.intercept;
          return s + (pred - p.y) ** 2;
        }, 0) / sim.points.length;

  useEffect(() => {
    onSnapshot?.(regressionTrainingSnapshot(sim));
  }, [sim, onSnapshot]);

  const hint = useMemo(() => {
    if (sim.lr > 0.25) {
      return "Learning rate is wild — the fit line overshoots because each step jumps too far.";
    }
    if (sim.lr < 0.02 && loss > 0.02) {
      return "Tiny steps — training crawls. Nudge learning rate up.";
    }
    if (loss < 0.005) {
      return "Loss nearly zero — gradient descent found a line that hugs Maya's ratings.";
    }
    if (sim.step === 0) {
      return "Drag a dot or hit play — watch loss shrink as the line chases your data.";
    }
    return "Each step nudges slope and intercept opposite the error gradient.";
  }, [sim.lr, sim.step, loss]);

  const timelineSteps = useMemo(() => {
    const built = buildTrainingTimeline(
      sim.points,
      sim.slope,
      sim.intercept,
      sim.lr,
      40,
    );
    return built.map((s, i) => ({
      id: `step-${i}`,
      label: `Step ${s.step}`,
      state: { slope: s.slope, intercept: s.intercept, loss: s.loss },
    }));
  }, [sim.points, sim.slope, sim.intercept, sim.lr]);

  const onTimelineStep = useCallback(
    (step: TimelineStep<{ slope: number; intercept: number; loss: number }>) => {
      setSim((prev) => ({
        ...prev,
        slope: step.state.slope,
        intercept: step.state.intercept,
        lossHistory: [...prev.lossHistory.slice(-39), step.state.loss],
        step: prev.step,
      }));
    },
    [],
  );

  const timeline = useTimeline(timelineSteps, onTimelineStep);

  const handlePointer = (
    state: RegressionTrainingState,
    event: { x: number; y: number; type: string },
    phase: "down" | "move" | "up",
  ) => {
    if (phase === "down") return regressionTrainingPointerDown(state, { ...event, type: "down" });
    if (phase === "move") return regressionTrainingPointerMove(state, { ...event, type: "move" });
    return regressionTrainingPointerUp(state);
  };

  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
      <div className="panel overflow-hidden glow-coral">
        <SimulationHost
          state={sim}
          onStateChange={setSim}
          draw={drawRegressionTrainingSim}
          onPointer={handlePointer}
          getSnapshot={regressionTrainingSnapshot}
          className="h-56 w-full touch-none sm:h-72"
          ariaLabel="Training visualization. Drag points or run gradient descent."
        />
      </div>

      <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        <InteractiveSlider
          label="Learning rate"
          value={sim.lr}
          min={0.005}
          max={0.4}
          step={0.005}
          accent={sim.lr > 0.25 ? "coral" : "sky"}
          format={(v) => v.toFixed(3)}
          onChange={(lr) => setSim((s) => ({ ...s, lr }))}
        />
        <div className="flex flex-col gap-2">
          <TimelineControls
            playing={timeline.state.playing}
            currentIndex={timeline.state.currentIndex}
            totalSteps={Math.max(timelineSteps.length, 1)}
            speed={timeline.state.speed}
            onPlay={timeline.play}
            onPause={timeline.pause}
            onStepForward={() => {
              timeline.stepForward();
            }}
            onStepBack={timeline.stepBack}
            onRewind={() => {
              timeline.rewind();
              setSim(createRegressionTrainingState());
            }}
            onSpeedChange={timeline.setSpeed}
            compact
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSim((s) => regressionTrainingStep(s))}
          >
            Single step
          </Button>
        </div>
      </div>

      <div className="flex gap-4 font-mono text-xs text-ink-muted">
        <span>step {sim.step}</span>
        <span>slope {sim.slope.toFixed(3)}</span>
        <span>bias {sim.intercept.toFixed(3)}</span>
      </div>

      <LiveHint
        message={hint}
        tone={sim.lr > 0.25 ? "warning" : loss < 0.005 ? "success" : "neutral"}
      />
    </div>
  );
}
