"use client";

import { ALGORITHM_REGISTRY } from "@/lib/algorithms/registry";
import { usePlaygroundStore } from "@/stores/playground-store";
import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";

import type { AlgorithmModel } from "@/lib/algorithms/types";

function formatMetric(metrics: AlgorithmModel["metrics"]) {
  if (metrics.trainAccuracy !== undefined) {
    const train = Math.round((metrics.trainAccuracy ?? 0) * 100);
    const test = Math.round((metrics.testAccuracy ?? 0) * 100);
    return `Train ${train}% · Test ${test}%`;
  }
  if (metrics.trainMae !== undefined) {
    return `MAE train ${(metrics.trainMae ?? 0).toFixed(3)} · test ${(metrics.testMae ?? 0).toFixed(3)}`;
  }
  return "—";
}

export function ComparisonPanel() {
  const primaryAlgorithm = usePlaygroundStore((s) => s.primaryAlgorithm);
  const compareAlgorithms = usePlaygroundStore((s) => s.compareAlgorithms);
  const models = usePlaygroundStore((s) => s.models);
  const setActiveThinkAlgorithm = usePlaygroundStore((s) => s.setActiveThinkAlgorithm);

  const ids = [primaryAlgorithm, ...compareAlgorithms].filter(
    (id, i, arr) => arr.indexOf(id) === i,
  );

  const trained = ids.filter((id) => models[id]);

  if (trained.length === 0) {
    return (
      <Panel>
        <EmptyState
          icon="flask"
          title="Nothing to compare yet"
          description="Train a model — then add a second algorithm and hit Compare. You'll see accuracy, speed, and who wins."
          className="border-none bg-transparent py-8"
        />
      </Panel>
    );
  }

  return (
    <Panel glow="mint">
      <h2 className="mb-3 text-sm font-semibold text-white">Comparison</h2>
      <div className="space-y-2">
        {trained.map((id) => {
          const model = models[id]!;
          const name = ALGORITHM_REGISTRY[id].name;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveThinkAlgorithm(id)}
              className="focus-ring min-h-11 w-full rounded-xl border border-white/8 bg-bg-deep/50 px-3 py-3 text-left transition-colors hover:border-violet/30 active:scale-[0.99]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-ink">{name}</span>
                <span className="font-mono text-xs text-mint">
                  {model.metrics.inferenceMs?.toFixed(1)}ms
                </span>
              </div>
              <p className="mt-1 font-mono text-xs text-ink-muted">
                {formatMetric(model.metrics)}
              </p>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}
