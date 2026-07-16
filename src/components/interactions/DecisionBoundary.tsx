"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { RotateCcw, Eye } from "lucide-react";
import { LiveHint } from "@/components/shell/LiveHint";
import { MetricPill } from "@/components/ui/MetricPill";
import { Button } from "@/components/ui/Button";
import { SimulationHost } from "@/engines/interaction/SimulationHost";
import {
  classificationAccuracy,
  classificationPointer,
  classificationSnapshot,
  createClassificationState,
  drawClassificationSim,
  resetClassificationState,
  type ClassificationSimState,
} from "@/engines/presets/classification";

import type { SimSnapshot } from "@/engines/interaction/types";

type DecisionBoundaryProps = {
  compact?: boolean;
  revealHiddenDefault?: boolean;
  onSnapshot?: (s: SimSnapshot) => void;
};

export function DecisionBoundary({
  compact = false,
  revealHiddenDefault = false,
  onSnapshot,
}: DecisionBoundaryProps) {
  const [sim, setSim] = useState<ClassificationSimState>(() =>
    createClassificationState(revealHiddenDefault),
  );
  const [pulseWrong, setPulseWrong] = useState(0);

  const trainAcc = classificationAccuracy(sim.dataset.train(), sim.boundary);
  const hiddenAcc = classificationAccuracy(sim.dataset.hidden(), sim.boundary);

  useEffect(() => {
    onSnapshot?.(classificationSnapshot(sim));
  }, [sim, onSnapshot]);

  useEffect(() => {
    if (pulseWrong <= 0) return;
    const id = requestAnimationFrame(() =>
      setPulseWrong((p) => Math.max(0, p - 0.08)),
    );
    return () => cancelAnimationFrame(id);
  }, [pulseWrong]);

  const hint = useMemo(() => {
    if (!sim.hasDragged) {
      return "Grab the violet handle — split Reel's loves (mint) from skips (coral).";
    }
    if (!sim.revealHidden && trainAcc >= 1) {
      return "Perfect on Maya's training picks… suspiciously perfect. Reveal the films she hasn't rated yet.";
    }
    if (sim.revealHidden && hiddenAcc < 0.75) {
      return "Gray dots are unseen films — your boundary memorized quirks, not taste.";
    }
    if (sim.revealHidden && hiddenAcc >= 0.75) {
      return "This boundary generalizes. Maya's future watches would land on the right side.";
    }
    if (trainAcc < 0.6) {
      return "Several dots disagree — rotate until each side matches its color.";
    }
    return "Accuracy updates live. Small nudges, big shifts in who gets recommended.";
  }, [sim.hasDragged, sim.revealHidden, trainAcc, hiddenAcc]);

  const handlePointer = (
    state: ClassificationSimState,
    event: { x: number; y: number; type: string },
    phase: "down" | "move" | "up",
  ) => {
    if (phase === "up") return state;
    const next = classificationPointer(state, {
      ...event,
      type: phase === "down" ? "down" : "move",
    });
    setPulseWrong(1);
    return next;
  };

  const drawState = { ...sim, pulseWrong };

  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
      <div className="panel relative overflow-hidden glow-violet">
        <SimulationHost
          state={drawState}
          onStateChange={setSim}
          draw={drawClassificationSim}
          onPointer={handlePointer}
          getSnapshot={classificationSnapshot}
          ariaLabel="Interactive classification canvas. Drag to rotate the decision boundary."
        />
        <div
          className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-2"
          aria-live="polite"
        >
          <MetricPill label="Train" value={`${Math.round(trainAcc * 100)}%`} tone="mint" />
          {sim.revealHidden && (
            <MetricPill
              label="Hidden"
              value={`${Math.round(hiddenAcc * 100)}%`}
              tone={hiddenAcc >= 0.75 ? "mint" : "danger"}
            />
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {!sim.revealHidden && trainAcc >= 0.99 && (
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSim((s) => ({ ...s, revealHidden: true }))}
              className="bg-violet/15 text-violet ring-1 ring-violet/25 hover:bg-violet/25"
            >
              <Eye className="mr-2 h-4 w-4" aria-hidden />
              Reveal hidden films
            </Button>
          </motion.div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSim(resetClassificationState(revealHiddenDefault))}
        >
          <RotateCcw className="mr-2 h-4 w-4" aria-hidden />
          Reset
        </Button>
      </div>

      <LiveHint
        message={hint}
        tone={
          sim.revealHidden && hiddenAcc < 0.75
            ? "warning"
            : !sim.hasDragged
              ? "discovery"
              : sim.revealHidden && hiddenAcc >= 0.75
                ? "success"
                : "neutral"
        }
      />
    </div>
  );
}
