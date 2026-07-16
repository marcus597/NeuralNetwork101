"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { motion } from "motion/react";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { LiveHint } from "@/components/shell/LiveHint";
import type { SimSnapshot } from "@/engines/interaction/types";
import type { PresetComponent } from "../PresetPlayground";
import { usePresetContext } from "../PresetPlayground";

function useEmitSnapshot(snapshot: SimSnapshot) {
  const { onSnapshot } = usePresetContext();
  useEffect(() => {
    onSnapshot(snapshot);
  }, [snapshot, onSnapshot]);
}

const FILMS = [
  { id: "1", title: "Neon Drift", mood: "energetic", loved: true },
  { id: "2", title: "Quiet Room", mood: "calm", loved: true },
  { id: "3", title: "Laugh Track", mood: "funny", loved: true },
  { id: "4", title: "Void Walk", mood: "dark", loved: false },
  { id: "5", title: "Sun Slice", mood: "warm", loved: false },
  { id: "6", title: "???", mood: "unknown", loved: null as boolean | null },
];

export const PredictionGamePreset: PresetComponent = forwardRef(function PredictionGamePreset(
  _props,
  ref,
) {
  const [loved, setLoved] = useState<string[]>(["1", "2", "3"]);
  const [skipped, setSkipped] = useState<string[]>(["4", "5"]);
  const [guess, setGuess] = useState<boolean | null>(null);
  const mystery = FILMS[5];
  const rulesLove = loved.length >= 2;

  const snapshot: SimSnapshot = {
    presetId: "prediction-game",
    params: { loved: loved.length, skipped: skipped.length },
    metrics: { trainingSize: loved.length + skipped.length },
    flags: { guessed: guess !== null, rulesBeatML: false },
  };

  useImperativeHandle(ref, () => ({
    reset: () => { setLoved(["1", "2", "3"]); setSkipped(["4", "5"]); setGuess(null); },
    getSnapshot: () => snapshot,
    getState: () => ({ loved, skipped, guess }),
  }));

  useEmitSnapshot(snapshot);

  return (
    <div className="space-y-4 panel p-5">
      <p className="text-sm text-ink-muted">Train on Maya&apos;s taste — drag films to Loved or Skipped, then predict the mystery short.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <DropZone label="Loved" ids={loved} color="mint" onDrop={(id) => { setLoved((s) => [...s, id]); setSkipped((s) => s.filter((x) => x !== id)); }} />
        <DropZone label="Skipped" ids={skipped} color="coral" onDrop={(id) => { setSkipped((s) => [...s, id]); setLoved((s) => s.filter((x) => x !== id)); }} />
      </div>
      <div className="flex flex-wrap gap-2">
        {FILMS.slice(0, 5).filter((f) => !loved.includes(f.id) && !skipped.includes(f.id)).map((f) => (
          <button
            key={f.id}
            type="button"
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/film-id", f.id)}
            className="focus-ring cursor-grab rounded-lg border border-white/10 px-3 py-2 text-sm active:cursor-grabbing"
            onClick={() => setLoved((s) => [...s, f.id])}
          >
            {f.title}
          </button>
        ))}
        <motion.div layout className="rounded-lg border-2 border-dashed border-violet/50 px-4 py-3 text-sm font-medium text-violet">
          {mystery.title} — predict?
        </motion.div>
      </div>
      <div className="flex gap-2">
        <button type="button" className="focus-ring rounded-full bg-mint/20 px-4 py-2 text-sm text-mint" onClick={() => setGuess(true)}>Love</button>
        <button type="button" className="focus-ring rounded-full bg-coral/20 px-4 py-2 text-sm text-coral" onClick={() => setGuess(false)}>Skip</button>
      </div>
      {guess !== null && (
        <LiveHint message={rulesLove ? "You used patterns — that's ML in a nutshell." : "Add more examples — one favorite isn't enough."} tone="success" />
      )}
    </div>
  );
});

function DropZone({
  label,
  ids,
  color,
  onDrop,
}: {
  label: string;
  ids: string[];
  color: string;
  onDrop: (id: string) => void;
}) {
  return (
    <div
      className="min-h-24 rounded-xl border border-white/10 bg-bg-deep/50 p-3"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("text/film-id");
        if (id) onDrop(id);
      }}
    >
      <div className={`mb-2 text-xs font-semibold uppercase text-${color}`}>{label}</div>
      <div className="flex flex-wrap gap-1">
        {ids.map((id) => {
          const f = FILMS.find((x) => x.id === id);
          return f ? <span key={id} className="rounded-full bg-white/10 px-2 py-1 text-xs">{f.title}</span> : null;
        })}
      </div>
    </div>
  );
}

export const DataReplayPreset: PresetComponent = forwardRef(function DataReplayPreset(_props, ref) {
  const [tick, setTick] = useState(0);
  const rows = Array.from({ length: tick }, (_, i) => ({
    t: i + 1,
    film: FILMS[i % 5].title,
    action: i % 2 ? "skip" : "love",
  }));
  const snapshot: SimSnapshot = {
    presetId: "data-replay",
    params: { tick },
    metrics: { rowCount: tick },
    flags: { minRows: tick >= 10 },
  };

  useImperativeHandle(ref, () => ({
    reset: () => setTick(0),
    getSnapshot: () => snapshot,
    getState: () => ({ tick }),
  }));

  useEmitSnapshot(snapshot);

  return (
    <div className="space-y-4 panel p-5">
      <InteractiveSlider label="Evening replay scrubber" value={tick} min={0} max={12} step={1} format={(v) => `Night ${Math.round(v)}`} onChange={(v) => setTick(Math.round(v))} />
      <div className="max-h-40 overflow-auto rounded-xl bg-bg-deep font-mono text-xs">
        <table className="w-full">
          <thead><tr className="text-ink-muted"><th className="p-2">#</th><th>film</th><th>action</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <motion.tr key={r.t} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-white/5">
                <td className="p-2">{r.t}</td><td>{r.film}</td><td className={r.action === "love" ? "text-mint" : "text-coral"}>{r.action}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <LiveHint message="Each scrub adds a row — data is frozen moments of what happened." />
    </div>
  );
});

export const FeatureForgePreset: PresetComponent = forwardRef(function FeatureForgePreset(
  { config },
  ref,
) {
  const advanced = config.advanced === true;
  const [runtime, setRuntime] = useState(0.5);
  const [energy, setEnergy] = useState(0.6);
  const [dialogue, setDialogue] = useState(0.3);
  const [weekend, setWeekend] = useState(advanced ? 0.7 : 0);
  const snapshot: SimSnapshot = {
    presetId: advanced ? "feature-engineering" : "feature-forge",
    params: { runtime, energy, dialogue, weekend },
    metrics: { separation: Math.abs(energy - dialogue) },
    flags: { forged: energy > 0.4 },
  };

  useImperativeHandle(ref, () => ({
    reset: () => { setRuntime(0.5); setEnergy(0.6); setDialogue(0.3); setWeekend(0); },
    getSnapshot: () => snapshot,
    getState: () => ({ runtime, energy, dialogue, weekend }),
  }));

  useEmitSnapshot(snapshot);

  return (
    <div className="space-y-4 panel p-5">
      <InteractiveSlider label="Runtime" value={runtime} min={0} max={1} onChange={setRuntime} />
      <InteractiveSlider label="Energy" value={energy} min={0} max={1} onChange={setEnergy} accent="mint" />
      <InteractiveSlider label="Dialogue density" value={dialogue} min={0} max={1} onChange={setDialogue} accent="sky" />
      {advanced && <InteractiveSlider label="Weekend watch" value={weekend} min={0} max={1} onChange={setWeekend} accent="gold" />}
      <div className="relative h-40 rounded-xl bg-bg-deep">
        <motion.div className="absolute h-4 w-4 rounded-full bg-mint" animate={{ left: `${energy * 90}%`, top: `${(1 - runtime) * 80}%` }} />
        <motion.div className="absolute h-4 w-4 rounded-full bg-coral" animate={{ left: `${dialogue * 90}%`, top: `${runtime * 80}%` }} />
      </div>
      <LiveHint message="Features reposition films in trait-space — pick what helps predict Maya." />
    </div>
  );
});

export const LabelLensPreset: PresetComponent = forwardRef(function LabelLensPreset(_props, ref) {
  const [mode, setMode] = useState<"binary" | "stars" | "genre">("binary");
  const snapshot: SimSnapshot = {
    presetId: "label-lens",
    params: { mode },
    metrics: {},
    flags: { switched: mode !== "binary" },
  };

  useImperativeHandle(ref, () => ({
    reset: () => setMode("binary"),
    getSnapshot: () => snapshot,
    getState: () => ({ mode }),
  }));

  useEmitSnapshot(snapshot);

  return (
    <div className="space-y-4 panel p-5">
      <div className="flex gap-2">
        {(["binary", "stars", "genre"] as const).map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)} className={`focus-ring rounded-full px-4 py-2 text-sm capitalize ${mode === m ? "bg-violet/25 text-violet" : "text-ink-muted"}`}>{m}</button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {FILMS.slice(0, 3).map((f) => (
          <div key={f.id} className="rounded-xl bg-bg-deep p-3 text-center text-sm">
            <div className="font-medium">{f.title}</div>
            <div className="mt-2 text-violet">
              {mode === "binary" ? (f.loved ? "Love" : "Skip") : mode === "stars" ? "★★★★☆" : f.mood}
            </div>
          </div>
        ))}
      </div>
      <LiveHint message="Same films, different labels — the label type picks which tools you'll need." />
    </div>
  );
});

export const ModelArenaPreset: PresetComponent = forwardRef(function ModelArenaPreset(_props, ref) {
  const [selected, setSelected] = useState("forest");
  const models = [
    { id: "knn", acc: 0.72, speed: 0.4, explain: 0.9 },
    { id: "logistic", acc: 0.78, speed: 0.95, explain: 0.85 },
    { id: "forest", acc: 0.84, speed: 0.6, explain: 0.5 },
    { id: "svm", acc: 0.8, speed: 0.7, explain: 0.4 },
  ];
  const m = models.find((x) => x.id === selected)!;
  const snapshot: SimSnapshot = {
    presetId: "model-arena",
    params: { selected },
    metrics: { accuracy: m.acc, speed: m.speed },
    flags: { picked: true },
  };

  useImperativeHandle(ref, () => ({
    reset: () => setSelected("forest"),
    getSnapshot: () => snapshot,
    getState: () => ({ selected }),
  }));

  useEmitSnapshot(snapshot);

  return (
    <div className="space-y-4 panel p-5">
      <div className="flex flex-wrap gap-2">
        {models.map((mod) => (
          <button key={mod.id} type="button" onClick={() => setSelected(mod.id)} className={`focus-ring rounded-full px-3 py-1.5 text-sm capitalize ${selected === mod.id ? "bg-sky/20 text-sky" : "text-ink-muted"}`}>{mod.id}</button>
        ))}
      </div>
      <div className="space-y-2">
        {(["accuracy", "speed", "explain"] as const).map((k) => {
          const value =
            k === "accuracy" ? m.acc : k === "speed" ? m.speed : m.explain;
          return (
          <div key={k} className="flex items-center gap-3">
            <span className="w-20 text-xs capitalize text-ink-muted">{k}</span>
            <div className="h-2 flex-1 rounded-full bg-bg-deep"><div className="h-full rounded-full bg-violet" style={{ width: `${value * 100}%` }} /></div>
            <span className="font-mono text-xs">{(value * 100).toFixed(0)}</span>
          </div>
        );})}
      </div>
      <LiveHint message="No single winner — pick for accuracy, latency, or explainability." />
    </div>
  );
});

export const PipelinePreset: PresetComponent = forwardRef(function PipelinePreset(_props, ref) {
  const [order, setOrder] = useState(["impute", "scale", "model"]);
  const correct = order.join() === "impute,scale,model";
  const snapshot: SimSnapshot = {
    presetId: "pipeline-blocks",
    params: { order: order.join(",") },
    metrics: {},
    flags: { valid: correct, leaked: order.indexOf("model") < order.indexOf("scale") },
  };

  useImperativeHandle(ref, () => ({
    reset: () => setOrder(["impute", "scale", "model"]),
    getSnapshot: () => snapshot,
    getState: () => ({ order }),
  }));

  useEmitSnapshot(snapshot);

  const swap = (i: number) => {
    if (i >= order.length - 1) return;
    const next = [...order];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    setOrder(next);
  };

  return (
    <div className="space-y-4 panel p-5">
      <p className="text-sm text-ink-muted">Drag order — scale before model, or leak test statistics.</p>
      <div className="flex flex-wrap gap-2">
        {order.map((b, i) => (
          <button key={b} type="button" onClick={() => swap(i)} className="focus-ring rounded-xl bg-violet/20 px-4 py-3 text-sm font-medium text-violet capitalize">
            {b} {i < order.length - 1 ? "↔" : ""}
          </button>
        ))}
      </div>
      <LiveHint message={correct ? "Valid pipeline — each block sees only prior transforms." : "Wrong order — model saw raw scale stats from test. Leak!"} tone={correct ? "success" : "warning"} />
    </div>
  );
});

export const DeploymentPreset: PresetComponent = forwardRef(function DeploymentPreset(_props, ref) {
  const [drift, setDrift] = useState(0);
  const accuracy = Math.max(0.45, 0.88 - drift * 0.4);
  const snapshot: SimSnapshot = {
    presetId: "deployment-drift",
    params: { drift },
    metrics: { accuracy },
    flags: { decayed: drift > 0.5 },
  };

  useImperativeHandle(ref, () => ({
    reset: () => setDrift(0),
    getSnapshot: () => snapshot,
    getState: () => ({ drift }),
  }));

  useEmitSnapshot(snapshot);

  return (
    <div className="space-y-4 panel p-5">
      <InteractiveSlider label="Taste drift (weeks live)" value={drift} min={0} max={1} onChange={setDrift} accent="coral" />
      <div className="font-mono text-2xl text-sky">Live accuracy: {(accuracy * 100).toFixed(1)}%</div>
      <motion.div className="h-3 rounded-full bg-bg-deep" animate={{ opacity: drift > 0.5 ? [1, 0.5, 1] : 1 }} transition={{ repeat: drift > 0.5 ? Infinity : 0, duration: 1 }}>
        <div className="h-full rounded-full bg-gradient-to-r from-mint to-coral" style={{ width: `${accuracy * 100}%` }} />
      </motion.div>
      <button type="button" className="focus-ring rounded-full bg-mint/20 px-4 py-2 text-sm text-mint" onClick={() => setDrift(0)}>Retrain</button>
      <LiveHint message={drift > 0.5 ? "Maya's taste shifted — frozen model decayed. Monitor in production." : "Simulate traffic — accuracy holds until drift kicks in."} />
    </div>
  );
});

export const EthicsPreset: PresetComponent = forwardRef(function EthicsPreset(_props, ref) {
  const [engagement, setEngagement] = useState(0.5);
  const [diversity, setDiversity] = useState(0.7);
  const snapshot: SimSnapshot = {
    presetId: "ethics-bubble",
    params: { engagement, diversity },
    metrics: { engagement, diversity },
    flags: { fixed: diversity >= 0.5 && engagement < 0.85 },
  };

  useImperativeHandle(ref, () => ({
    reset: () => { setEngagement(0.5); setDiversity(0.7); },
    getSnapshot: () => snapshot,
    getState: () => ({ engagement, diversity }),
  }));

  useEmitSnapshot(snapshot);

  return (
    <div className="space-y-4 panel p-5">
      <InteractiveSlider label="Optimize engagement" value={engagement} min={0} max={1} onChange={setEngagement} accent="coral" />
      <InteractiveSlider label="Genre diversity constraint" value={diversity} min={0} max={1} onChange={setDiversity} accent="mint" />
      <div className="flex h-32 items-end justify-center gap-1">
        {Array.from({ length: 12 }).map((_, i) => {
          const h = engagement > 0.8 ? (i % 3 === 0 ? 90 : 20) : 40 + diversity * 30;
          return <motion.div key={i} className="w-4 rounded-t bg-violet/60" animate={{ height: h }} />;
        })}
      </div>
      <LiveHint message={engagement > 0.85 && diversity < 0.4 ? "Filter bubble — same niche, high clicks, shrinking horizons." : "Balance engagement with diversity — who gets hurt?"} tone={engagement > 0.85 ? "warning" : "neutral"} />
    </div>
  );
});
