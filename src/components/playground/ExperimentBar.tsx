"use client";

import { useEffect, useState } from "react";
import { usePlaygroundStore } from "@/stores/playground-store";
import {
  decodeShareHash,
  loadExperimentIndex,
  loadExperimentLocal,
  type SavedExperimentMeta,
} from "@/lib/playground/experiment";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";

export function ExperimentBar() {
  const experimentName = usePlaygroundStore((s) => s.experimentName);
  const statusMessage = usePlaygroundStore((s) => s.statusMessage);
  const resetExperiment = usePlaygroundStore((s) => s.resetExperiment);
  const saveExperiment = usePlaygroundStore((s) => s.saveExperiment);
  const copyShareLink = usePlaygroundStore((s) => s.copyShareLink);
  const loadExperiment = usePlaygroundStore((s) => s.loadExperiment);
  const resetPoints = usePlaygroundStore((s) => s.resetPoints);
  const setStatus = usePlaygroundStore((s) => s.setStatus);

  const [saved, setSaved] = useState<SavedExperimentMeta[]>(() => loadExperimentIndex());

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("#e=")) {
      const exp = decodeShareHash(hash);
      if (exp) {
        loadExperiment(exp);
        setStatus("Loaded shared experiment");
      }
    }
  }, [loadExperiment, setStatus]);

  return (
    <Panel className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={experimentName}
          onChange={(e) =>
            usePlaygroundStore.setState({ experimentName: e.target.value })
          }
          className="focus-ring min-h-11 w-full min-w-[10rem] rounded-xl border border-white/10 bg-bg-inset px-3 py-2 text-sm text-ink ring-1 ring-white/5 transition-colors placeholder:text-ink-muted hover:border-white/14 focus:border-violet/40 sm:w-auto"
          aria-label="Experiment name"
        />
        {statusMessage && (
          <span className="text-xs text-mint" aria-live="polite">
            {statusMessage}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={resetPoints}>
          Reset data
        </Button>
        <Button size="sm" variant="secondary" onClick={resetExperiment}>
          Reset all
        </Button>
        <Button
          size="sm"
          variant="primary"
          onClick={() => {
            saveExperiment();
            setSaved(loadExperimentIndex());
          }}
        >
          Save
        </Button>
        <Button size="sm" variant="primary" onClick={() => copyShareLink()}>
          Share
        </Button>
      </div>

      {saved.length === 0 ? (
        <p className="w-full border-t border-white/8 pt-3 text-xs text-ink-muted">
          No saved experiments yet — tweak the canvas, then hit Save.
        </p>
      ) : (
        <div className="w-full border-t border-white/8 pt-3 sm:col-span-full">
          <p className="mb-2 text-xs text-ink-muted">Saved experiments</p>
          <div className="flex flex-wrap gap-2">
            {saved.slice(0, 5).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  const exp = loadExperimentLocal(m.id);
                  if (exp) loadExperiment(exp);
                }}
                className="focus-ring min-h-11 rounded-full border border-white/10 px-3 py-2 text-xs text-ink-muted transition-colors hover:border-white/20 hover:text-ink active:scale-[0.98]"
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}
