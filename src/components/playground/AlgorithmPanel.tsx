"use client";

import { ALGORITHM_LIST } from "@/lib/algorithms/registry";
import type { AlgorithmId } from "@/lib/algorithms/types";
import { usePlaygroundStore } from "@/stores/playground-store";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { cn } from "@/lib/cn";

export function AlgorithmPanel() {
  const primaryAlgorithm = usePlaygroundStore((s) => s.primaryAlgorithm);
  const compareAlgorithms = usePlaygroundStore((s) => s.compareAlgorithms);
  const hyperparams = usePlaygroundStore((s) => s.hyperparams);
  const setPrimaryAlgorithm = usePlaygroundStore((s) => s.setPrimaryAlgorithm);
  const toggleCompare = usePlaygroundStore((s) => s.toggleCompare);
  const setHyperparam = usePlaygroundStore((s) => s.setHyperparam);
  const train = usePlaygroundStore((s) => s.train);
  const trainAll = usePlaygroundStore((s) => s.trainAll);
  const setActiveThinkAlgorithm = usePlaygroundStore((s) => s.setActiveThinkAlgorithm);

  const algo = ALGORITHM_LIST.find((a) => a.id === primaryAlgorithm)!;
  const params = {
    ...Object.fromEntries(algo.hyperparameters.map((h) => [h.key, h.default])),
    ...hyperparams[primaryAlgorithm],
  };

  return (
    <Panel glow="violet">
      <h2 className="mb-1 text-sm font-semibold text-white">Algorithm</h2>
      <p className="mb-3 text-xs text-ink-muted">{algo.description}</p>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {ALGORITHM_LIST.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => {
              setPrimaryAlgorithm(a.id);
              setActiveThinkAlgorithm(a.id);
            }}
            className={cn(
              "focus-ring min-h-11 rounded-full px-3 py-2 text-xs font-medium transition-colors active:scale-[0.98]",
              primaryAlgorithm === a.id
                ? "bg-violet/25 text-violet"
                : "text-ink-muted hover:text-ink",
            )}
          >
            {a.name}
          </button>
        ))}
      </div>

      {algo.hyperparameters.map((h) => (
        <div key={h.key} className="mb-3">
          <InteractiveSlider
            label={h.label}
            value={params[h.key] ?? h.default}
            min={h.min}
            max={h.max}
            step={h.step}
            format={(v) =>
              h.step >= 1 ? String(Math.round(v)) : v.toFixed(2)
            }
            onChange={(v) => setHyperparam(primaryAlgorithm, h.key, v)}
            accent="violet"
          />
        </div>
      ))}

      <div className="mb-3 flex gap-2">
        <Button variant="primary" onClick={train}>
          Train
        </Button>
        <Button variant="secondary" onClick={trainAll}>
          Compare all
        </Button>
      </div>

      <div className="border-t border-white/8 pt-3">
        <p className="mb-2 text-xs font-medium text-ink-muted">
          Compare (up to 3)
        </p>
        <div className="flex flex-wrap gap-1.5">
          {ALGORITHM_LIST.filter((a) => a.id !== primaryAlgorithm).map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => toggleCompare(a.id as AlgorithmId)}
              className={cn(
                "focus-ring min-h-11 rounded-full px-3 py-2 text-xs transition-colors active:scale-[0.98]",
                compareAlgorithms.includes(a.id as AlgorithmId)
                  ? "bg-sky/20 text-sky"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              {a.name}
            </button>
          ))}
        </div>
      </div>
    </Panel>
  );
}
