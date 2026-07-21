"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { LiveHint } from "@/components/shell/LiveHint";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { sigmoid, linear } from "@/lib/nn/math";

/** Compact homepage demo — same math as NeuronLab without lesson snapshot wiring. */
export function NeuronLabPreview() {
  const [weights, setWeights] = useState([1.0, -0.5, 0.7]);
  const [bias, setBias] = useState(-0.3);
  const inputs = [0.9, 0.5, 0.2];
  const z = linear(inputs, weights, bias);
  const output = sigmoid(z);
  const fired = output >= 0.5;

  const hint = fired
    ? "The neuron fired — this is the building block every network stacks."
    : "Tune weights until σ(z) ≥ 0.5. Then start the full course.";

  return (
    <div className="panel p-5 space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {weights.map((w, i) => (
          <InteractiveSlider
            key={i}
            label={`w${i + 1}`}
            value={w}
            min={-2}
            max={2}
            step={0.05}
            accent={w >= 0 ? "mint" : "coral"}
            onChange={(v) => {
              const next = [...weights];
              next[i] = v;
              setWeights(next);
            }}
          />
        ))}
      </div>
      <InteractiveSlider label="Bias b" value={bias} min={-2} max={2} step={0.05} accent="violet" onChange={setBias} />
      <div className="flex items-center justify-between font-mono text-sm">
        <span>z = {z.toFixed(3)}</span>
        <motion.span
          animate={fired ? { color: "#3dffb5" } : {}}
          className={fired ? "text-mint" : "text-coral"}
        >
          σ(z) = {output.toFixed(3)}
        </motion.span>
      </div>
      <LiveHint message={hint} tone={fired ? "success" : "discovery"} />
    </div>
  );
}
