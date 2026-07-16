"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { LiveHint } from "@/components/shell/LiveHint";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { SimulationHost } from "@/engines/interaction/SimulationHost";
import {
  createOverfitState,
  drawOverfitSim,
  overfitSnapshot,
  type OverfitSimState,
} from "@/engines/presets/overfit";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import type { SimSnapshot } from "@/engines/interaction/types";

type OverfitDialProps = {
  compact?: boolean;
  onSnapshot?: (s: SimSnapshot) => void;
};

export function OverfitDial({ compact = false, onSnapshot }: OverfitDialProps) {
  const [sim, setSim] = useState<OverfitSimState>(createOverfitState);
  const [chaos, setChaos] = useState(false);
  const reducedMotion = useReducedMotion();

  const snap = overfitSnapshot(sim);
  const overfit = snap.flags.overfit ?? false;

  useEffect(() => {
    onSnapshot?.(snap);
  }, [snap, onSnapshot]);

  const hint = useMemo(() => {
    if (sim.degree <= 2) {
      return "Low degree — the curve follows the trend, not every quirk in Maya's ratings.";
    }
    if (overfit) {
      return "Validation error spiked — the model memorized training films, not taste.";
    }
    if (sim.degree >= 5) {
      return "Watch the dashed gap widen as the curve wiggles through every training dot.";
    }
    return "Crank polynomial degree — train loss drops fast, but does validation follow?";
  }, [sim.degree, overfit]);

  const handleDegreeChange = (v: number) => {
    const degree = Math.round(v);
    if (degree >= 9 && !reducedMotion) {
      setChaos(true);
      window.setTimeout(() => setChaos(false), 500);
    }
    setSim((prev) => ({ ...prev, degree }));
  };

  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
      <motion.div
        animate={chaos ? { x: [0, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.35 }}
        className="panel relative overflow-hidden glow-violet"
      >
        <SimulationHost
          state={sim}
          onStateChange={setSim}
          draw={drawOverfitSim}
          getSnapshot={overfitSnapshot}
          className="h-56 w-full sm:h-72"
          ariaLabel="Polynomial curve fitting with train and validation points"
        />
      </motion.div>

      <InteractiveSlider
        label="Polynomial degree"
        value={sim.degree}
        min={1}
        max={10}
        step={1}
        accent={overfit ? "coral" : "violet"}
        format={(v) => String(Math.round(v))}
        onChange={handleDegreeChange}
        hint="Higher degree = more wiggles through training dots."
      />

      <LiveHint
        message={hint}
        tone={overfit ? "warning" : sim.degree <= 2 ? "success" : "discovery"}
      />
    </div>
  );
}
