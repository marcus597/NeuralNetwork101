"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import {
  activate,
  activateDerivative,
  type ActivationId,
} from "@/lib/nn/math";
import { useLabSnapshot } from "@/lib/nn/useLabSnapshot";
import type { SimSnapshot } from "@/engines/interaction/types";
import type { PresetComponent } from "@/engines/presets/PresetPlayground";
import { ControlDock, ExperienceHint, MetricChip } from "@/components/experience/ExperienceChrome";
import { cn } from "@/lib/cn";

const FNS: ActivationId[] = ["sigmoid", "relu", "tanh"];
const FN_COLORS: Record<ActivationId, string> = {
  sigmoid: "rgba(139,124,255,0.85)",
  relu: "rgba(61,255,181,0.85)",
  tanh: "rgba(255,200,87,0.85)",
};

function sampleCurve(fn: ActivationId, min = -4, max = 4, steps = 80) {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = min + ((max - min) * i) / steps;
    pts.push({ x, y: activate(x, fn) });
  }
  return pts;
}

export const ActivationLab: PresetComponent = forwardRef(function ActivationLab(_props, ref) {
  const [z, setZ] = useState(0.5);
  const [activeFns, setActiveFns] = useState<Set<ActivationId>>(new Set(["relu"]));
  const [showDeriv, setShowDeriv] = useState(false);
  const [tried, setTried] = useState<Set<ActivationId>>(new Set(["relu"]));

  const toggleFn = (id: ActivationId) => {
    setActiveFns((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    setTried((t) => new Set(t).add(id));
  };

  const primary = [...activeFns][0] ?? "relu";
  const out = activate(z, primary);
  const deriv = activateDerivative(z, primary);

  const snapshot: SimSnapshot = useMemo(
    () => ({
      presetId: "nn-activations",
      params: { z, fn: primary },
      metrics: { output: out, derivative: deriv },
      flags: {
        triedAll: tried.size >= 3,
        exploredReLU: tried.has("relu") && z > 0,
      },
    }),
    [z, primary, out, deriv, tried],
  );

  useImperativeHandle(ref, () => ({
    reset: () => {
      setZ(0.5);
      setActiveFns(new Set(["relu"]));
      setShowDeriv(false);
      setTried(new Set(["relu"]));
    },
    getSnapshot: () => snapshot,
    getState: () => ({ z, activeFns: [...activeFns] }),
  }));

  useLabSnapshot(snapshot);

  const toSvg = (x: number, y: number, fn: ActivationId) => ({
    cx: 30 + ((x + 4) / 8) * 260,
    cy: 110 - (fn === "tanh" ? (y + 1) / 2 : fn === "relu" ? Math.min(1, y) : y) * 90,
  });

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-bg-deep/70 p-4">
        <svg viewBox="0 0 320 130" className="w-full" aria-label="Activation comparison">
          <line x1="30" y1="110" x2="290" y2="110" stroke="rgba(255,255,255,0.08)" />
          <line x1="30" y1="20" x2="30" y2="110" stroke="rgba(255,255,255,0.08)" />
          {FNS.filter((f) => activeFns.has(f)).map((fn) => {
            const curve = sampleCurve(fn);
            return (
              <polyline
                key={fn}
                fill="none"
                stroke={FN_COLORS[fn]}
                strokeWidth="2.5"
                points={curve.map((p) => {
                  const { cx, cy } = toSvg(p.x, p.y, fn);
                  return `${cx},${cy}`;
                }).join(" ")}
              />
            );
          })}
          {FNS.filter((f) => activeFns.has(f)).map((fn) => {
            const v = activate(z, fn);
            const { cx, cy } = toSvg(z, v, fn);
            return <circle key={`dot-${fn}`} cx={cx} cy={cy} r="5" fill={FN_COLORS[fn]} stroke="white" strokeWidth="1.5" />;
          })}
          <line x1={30 + ((z + 4) / 8) * 260} y1="20" x2={30 + ((z + 4) / 8) * 260} y2="110" stroke="rgba(255,255,255,0.15)" strokeDasharray="4 3" />
        </svg>
      </div>

      <ControlDock>
        {FNS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => toggleFn(f)}
            className={cn(
              "focus-ring rounded-full px-4 py-2 text-sm font-medium capitalize",
              activeFns.has(f) ? "bg-violet/20 text-violet ring-1 ring-violet/30" : "bg-bg-muted text-ink-muted",
            )}
          >
            {f}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowDeriv((s) => !s)}
          className={cn(
            "focus-ring rounded-full px-4 py-2 text-sm",
            showDeriv ? "bg-gold/15 text-gold" : "bg-bg-muted text-ink-muted",
          )}
        >
          {showDeriv ? "∂f/∂z on" : "∂f/∂z off"}
        </button>
      </ControlDock>

      <InteractiveSlider label="z — scrub here" value={z} min={-4} max={4} step={0.05} accent="violet" onChange={setZ} />

      <div className="grid gap-2 sm:grid-cols-3">
        {FNS.map((fn) => (
          <MetricChip
            key={fn}
            label={fn}
            value={activeFns.has(fn) ? activate(z, fn).toFixed(3) : "—"}
            tone={fn === "relu" ? "mint" : fn === "tanh" ? "gold" : "violet"}
          />
        ))}
      </div>

      {showDeriv && (
        <div className="grid gap-2 sm:grid-cols-3">
          {FNS.filter((f) => activeFns.has(f)).map((fn) => (
            <MetricChip key={`d-${fn}`} label={`∂${fn}/∂z`} value={activateDerivative(z, fn).toFixed(3)} tone="gold" />
          ))}
        </div>
      )}

      <ExperienceHint>
        Toggle activations and scrub z — same input, three different outputs. Turn on ∂f/∂z to see why ReLU dies below zero.
      </ExperienceHint>
    </div>
  );
});
