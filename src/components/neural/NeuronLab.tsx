"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { motion } from "motion/react";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { sigmoid, linear } from "@/lib/nn/math";
import { useLabSnapshot } from "@/lib/nn/useLabSnapshot";
import type { SimSnapshot } from "@/engines/interaction/types";
import type { PresetComponent } from "@/engines/presets/PresetPlayground";
import { ControlDock, ExperienceHint, MetricChip } from "@/components/experience/ExperienceChrome";
import { colors } from "@/lib/theme/colors";
import { cn } from "@/lib/cn";

const INPUT_LABELS = ["Input 1", "Input 2", "Input 3"];

export const NeuronLab: PresetComponent = forwardRef(function NeuronLab(_props, ref) {
  const [inputs, setInputs] = useState([0.9, 0.5, 0.2]);
  const [weights, setWeights] = useState([1.0, -0.5, 0.7]);
  const [bias, setBias] = useState(-0.3);
  const [pulse, setPulse] = useState(false);

  const z = linear(inputs, weights, bias);
  const output = sigmoid(z);
  const fired = output >= 0.5;

  const snapshot: SimSnapshot = useMemo(
    () => ({
      presetId: "nn-neuron",
      params: { z, output },
      metrics: { z, output },
      flags: { fired, understood: fired && inputs.every((x) => x > 0) },
    }),
    [z, output, fired, inputs],
  );

  useImperativeHandle(ref, () => ({
    reset: () => {
      setInputs([0.9, 0.5, 0.2]);
      setWeights([1.0, -0.5, 0.7]);
      setBias(-0.3);
      setPulse(false);
    },
    getSnapshot: () => snapshot,
    getState: () => ({ inputs, weights, bias }),
  }));

  useLabSnapshot(snapshot);

  const curvePts = Array.from({ length: 81 }, (_, i) => {
    const x = -4 + (i / 80) * 8;
    return { x, y: sigmoid(x) };
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <div className="relative overflow-hidden rounded-xl bg-bg-deep/70 p-4">
          <svg viewBox="0 0 400 280" className="w-full" aria-label="Single neuron">
            {[0, 1, 2].map((i) => {
              const y = 50 + i * 70;
              const w = weights[i];
              const active = inputs[i] > 0.1;
              return (
                <g key={i}>
                  <motion.line
                    x1={60}
                    y1={y}
                    x2={200}
                    y2={140}
                    stroke={w >= 0 ? colors.mint : colors.coral}
                    strokeWidth={1 + Math.abs(w) * 2}
                    strokeOpacity={active ? 0.8 : 0.25}
                    animate={pulse && active ? { strokeOpacity: [0.4, 1, 0.4] } : {}}
                    transition={{ duration: 0.6, repeat: pulse ? Infinity : 0 }}
                  />
                  <circle cx={60} cy={y} r={22} fill="rgba(56,189,248,0.15)" stroke="rgba(56,189,248,0.5)" strokeWidth={2} />
                  <text x={60} y={y + 4} textAnchor="middle" className="fill-white text-[11px] font-mono">
                    {inputs[i].toFixed(1)}
                  </text>
                  <text x={28} y={y + 4} className="fill-white/50 text-[10px]">{INPUT_LABELS[i]}</text>
                </g>
              );
            })}
            <motion.circle
              cx={200}
              cy={140}
              r={36}
              fill={fired ? "rgba(61,255,181,0.2)" : "rgba(255,107,107,0.15)"}
              stroke={fired ? colors.mint : colors.coral}
              strokeWidth={3}
              animate={fired ? { scale: [1, 1.08, 1] } : { scale: 1 }}
              transition={{ duration: 0.7, repeat: fired ? Infinity : 0 }}
            />
            <text x={200} y={135} textAnchor="middle" className="fill-white/60 text-[10px]">σ(z)</text>
            <text x={200} y={152} textAnchor="middle" className="fill-white text-sm font-mono font-bold">
              {output.toFixed(2)}
            </text>
            <motion.line
              x1={236}
              y1={140}
              x2={340}
              y2={140}
              stroke={fired ? colors.mint : "rgba(255,255,255,0.2)"}
              strokeWidth={fired ? 4 : 2}
              animate={pulse && fired ? { strokeDashoffset: [20, 0] } : {}}
              strokeDasharray="8 4"
            />
            <text x={360} y={145} className={cn("text-sm font-bold", fired ? "fill-mint" : "fill-white/30")}>
              →
            </text>
          </svg>
          <button
            type="button"
            onClick={() => setPulse((p) => !p)}
            className="focus-ring absolute bottom-3 right-3 rounded-full bg-violet/20 px-3 py-1.5 text-xs font-medium text-violet ring-1 ring-violet/30"
          >
            {pulse ? "Stop pulse" : "Pulse signal →"}
          </button>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl bg-bg-deep/70 p-3">
            <svg viewBox="0 0 320 100" className="w-full" aria-hidden>
              <polyline
                fill="none"
                stroke="rgba(139,124,255,0.7)"
                strokeWidth="2.5"
                points={curvePts.map((p) => `${20 + ((p.x + 4) / 8) * 280},${90 - p.y * 80}`).join(" ")}
              />
              <circle
                cx={20 + ((z + 4) / 8) * 280}
                cy={90 - output * 80}
                r="7"
                fill={fired ? colors.mint : colors.coral}
                stroke="white"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <MetricChip label="raw sum" value={z.toFixed(3)} tone={z > 0 ? "mint" : "coral"} />
            <MetricChip label="output" value={output.toFixed(3)} tone={fired ? "mint" : "coral"} />
            <MetricChip label="status" value={fired ? "strong" : "quiet"} tone={fired ? "mint" : "violet"} />
          </div>
        </div>
      </div>

      <ControlDock>
        {inputs.map((v, i) => (
          <div key={`in-${i}`} className="min-w-[140px] flex-1">
            <InteractiveSlider
              label={INPUT_LABELS[i]}
              value={v}
              min={0}
              max={1}
              step={0.05}
              accent="sky"
              onChange={(val) => {
                const next = [...inputs];
                next[i] = val;
                setInputs(next);
              }}
            />
          </div>
        ))}
      </ControlDock>
      <ControlDock>
        {weights.map((w, i) => (
          <div key={`w-${i}`} className="min-w-[140px] flex-1">
            <InteractiveSlider
              label={`Weight ${i + 1}`}
              value={w}
              min={-2}
              max={2}
              step={0.05}
              hint={`How much input ${i + 1} matters`}
              accent={w >= 0 ? "mint" : "coral"}
              onChange={(val) => {
                const next = [...weights];
                next[i] = val;
                setWeights(next);
              }}
            />
          </div>
        ))}
        <div className="min-w-[140px] flex-1">
          <InteractiveSlider label="Bias (baseline)" value={bias} min={-2} max={2} step={0.05} accent="violet" hint="A head start before inputs are counted" onChange={setBias} />
        </div>
      </ControlDock>

      <ExperienceHint>
        Move the input sliders (how much signal arrives), weight sliders (how much each input matters), and
        bias (baseline push). Watch the dot on the curve — when the output is high, the neuron responds strongly.
      </ExperienceHint>
    </div>
  );
});
