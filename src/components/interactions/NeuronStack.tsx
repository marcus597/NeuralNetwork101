"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { LiveHint } from "@/components/shell/LiveHint";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { sigmoid } from "@/lib/ml-math";
import type { SimSnapshot } from "@/engines/interaction/types";

const INPUTS = [
  { id: "sun", label: "Sunny", emoji: "☀️" },
  { id: "wind", label: "Windy", emoji: "💨" },
  { id: "temp", label: "Warm", emoji: "🌡️" },
];

type NeuronStackProps = {
  compact?: boolean;
  onSnapshot?: (s: SimSnapshot) => void;
};

export function NeuronStack({ compact = false, onSnapshot }: NeuronStackProps) {
  const [weights, setWeights] = useState([0.9, -0.6, 0.4]);
  const [bias, setBias] = useState(-0.2);
  const [probe, setProbe] = useState(0);

  const inputs = [1, 0.8, 0.3];
  const weightedSum = inputs.reduce((s, v, i) => s + v * weights[i], 0) + bias;
  const output = sigmoid(weightedSum);
  const fired = output > 0.5;

  useEffect(() => {
    onSnapshot?.({
      presetId: "neural-network",
      params: { w0: weights[0], w1: weights[1], w2: weights[2], bias },
      metrics: { output },
      flags: { fired },
    });
  }, [weights, bias, output, fired, onSnapshot]);

  const hint = useMemo(() => {
    if (!fired && weightedSum > 0.35) {
      return `Almost — weighted sum is ${weightedSum.toFixed(2)}. Push a signal up to cross the firing threshold.`;
    }
    if (fired) {
      return `Neuron fired because σ(${weightedSum.toFixed(2)}) = ${output.toFixed(2)} crossed 0.5 — recommend the film.`;
    }
    if (weights[1] < -0.3) {
      return "Windy scenes pull the sum down — negative weights suppress a signal.";
    }
    return "Tune the sliders — each input contributes before Reel makes a call.";
  }, [fired, weightedSum, output, weights]);

  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
      <div className={`panel grid gap-6 p-5 sm:p-6 ${compact ? "" : "md:grid-cols-[1fr_1.1fr]"}`}>
        <div className="space-y-4">
          {INPUTS.map((input, i) => (
            <div key={input.id} className="flex items-center gap-3">
              <span className="w-8 text-lg" aria-hidden>
                {input.emoji}
              </span>
              <div className="flex-1">
                <InteractiveSlider
                  label={input.label}
                  value={weights[i]}
                  min={-1.5}
                  max={1.5}
                  step={0.05}
                  accent={weights[i] >= 0 ? "mint" : "coral"}
                  onChange={(v) => {
                    const next = [...weights];
                    next[i] = v;
                    setWeights(next);
                  }}
                />
              </div>
              <div
                className="h-2 w-16 overflow-hidden rounded-full bg-bg-deep"
                aria-hidden
              >
                <motion.div
                  className="h-full rounded-full bg-sky"
                  animate={{ width: `${Math.abs(inputs[i] * weights[i]) * 50}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                />
              </div>
            </div>
          ))}

          <InteractiveSlider
            label="Bias"
            value={bias}
            min={-1}
            max={1}
            step={0.05}
            accent="violet"
            onChange={setBias}
            hint="Shifts the firing threshold without touching inputs."
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-full rounded-xl bg-bg-deep/80 p-4">
            <p className="mb-2 text-xs uppercase tracking-wider text-ink-muted">
              Weighted sum → σ
            </p>
            <svg viewBox="0 0 320 120" className="w-full" aria-hidden>
              <path
                d="M 20 100 C 80 100, 100 20, 300 15"
                fill="none"
                stroke="rgba(139,124,255,0.5)"
                strokeWidth="2"
              />
              <line
                x1={20 + probe * 280}
                y1="10"
                x2={20 + probe * 280}
                y2="110"
                stroke="rgba(255,255,255,0.15)"
                strokeDasharray="4 4"
              />
              <circle
                cx={20 + ((weightedSum + 3) / 6) * 280}
                cy={100 - sigmoid(weightedSum) * 85}
                r="8"
                fill={fired ? "#3dffb5" : "#ff6b4a"}
                stroke="white"
                strokeWidth="2"
              />
            </svg>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={probe}
              onChange={(e) => setProbe(Number(e.target.value))}
              className="wonder-range accent-violet mt-2 w-full"
              aria-label="Scrub along the sigmoid curve"
            />
          </div>

          <motion.div
            animate={
              fired
                ? { scale: [1, 1.08, 1], boxShadow: "0 0 32px rgb(61 255 181 / 45%)" }
                : { scale: 1, boxShadow: "0 0 0px transparent" }
            }
            transition={{ duration: 0.45 }}
            className={`flex h-24 w-24 items-center justify-center rounded-full border-2 ${
              fired ? "border-mint bg-mint/15 text-mint" : "border-white/15 bg-white/5 text-ink-muted"
            }`}
          >
            <span className="text-center text-sm font-semibold">
              {fired ? "FIRE" : "quiet"}
            </span>
          </motion.div>

          <p className="font-mono text-sm text-ink-muted">
            Σ = {weightedSum.toFixed(2)} → σ = {output.toFixed(3)}
          </p>
        </div>
      </div>

      <LiveHint message={hint} tone={fired ? "success" : "discovery"} />
    </div>
  );
}
