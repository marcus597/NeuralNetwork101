"use client";

import { DATASET_PRESETS } from "@/lib/viz/dataset/presets";
import { usePlaygroundStore, type DrawTool } from "@/stores/playground-store";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { cn } from "@/lib/cn";

const tools: { id: DrawTool; label: string }[] = [
  { id: "select", label: "Move" },
  { id: "draw", label: "Draw" },
  { id: "label", label: "Label" },
];

export function DatasetPanel() {
  const preset = usePlaygroundStore((s) => s.preset);
  const seed = usePlaygroundStore((s) => s.seed);
  const drawTool = usePlaygroundStore((s) => s.drawTool);
  const drawLabel = usePlaygroundStore((s) => s.drawLabel);
  const trainRatio = usePlaygroundStore((s) => s.trainRatio);
  const points = usePlaygroundStore((s) => s.points);
  const setPreset = usePlaygroundStore((s) => s.setPreset);
  const setSeed = usePlaygroundStore((s) => s.setSeed);
  const generateDataset = usePlaygroundStore((s) => s.generateDataset);
  const setDrawTool = usePlaygroundStore((s) => s.setDrawTool);
  const setDrawLabel = usePlaygroundStore((s) => s.setDrawLabel);
  const setTrainRatio = usePlaygroundStore((s) => s.setTrainRatio);

  return (
    <Panel>
      <h2 className="mb-3 text-sm font-semibold text-white">Dataset</h2>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {DATASET_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPreset(p.id)}
            className={cn(
              "focus-ring min-h-11 rounded-full px-3 py-2 text-xs font-medium transition-colors active:scale-[0.98]",
              preset === p.id
                ? "bg-white/10 text-white"
                : "text-ink-muted hover:text-ink",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <InteractiveSlider
        label="Seed"
        value={seed}
        min={1}
        max={999}
        step={1}
        format={(v) => String(Math.round(v))}
        onChange={(v) => setSeed(Math.round(v))}
        accent="sky"
      />

      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="primary" onClick={generateDataset}>
          Generate
        </Button>
        <span className="self-center font-mono text-xs text-ink-muted">
          {points.length} points
        </span>
      </div>

      <div className="mt-4 border-t border-white/8 pt-4">
        <p className="mb-2 text-xs font-medium text-ink-muted">Tools</p>
        <div className="flex flex-wrap gap-1.5">
          {tools.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setDrawTool(t.id)}
              className={cn(
                "focus-ring rounded-full px-3 py-1.5 text-xs font-medium",
                drawTool === t.id
                  ? "bg-violet/20 text-violet"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-ink-muted">New point class:</span>
          <button
            type="button"
            onClick={() => setDrawLabel(0)}
            className={cn(
              "focus-ring h-7 w-7 rounded-full text-xs font-bold",
              drawLabel === 0 ? "bg-mint/30 text-mint ring-2 ring-mint" : "bg-white/5",
            )}
          >
            A
          </button>
          <button
            type="button"
            onClick={() => setDrawLabel(1)}
            className={cn(
              "focus-ring h-7 w-7 rounded-full text-xs font-bold",
              drawLabel === 1 ? "bg-coral/30 text-coral ring-2 ring-coral" : "bg-white/5",
            )}
          >
            B
          </button>
        </div>
      </div>

      <div className="mt-4">
        <InteractiveSlider
          label="Train ratio"
          value={trainRatio}
          min={0.5}
          max={0.9}
          step={0.05}
          format={(v) => `${Math.round(v * 100)}%`}
          onChange={setTrainRatio}
          hint="Split applied on next generate/train"
          accent="mint"
        />
      </div>
    </Panel>
  );
}
