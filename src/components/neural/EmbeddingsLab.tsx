"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { DEFAULT_EMBEDDINGS, cosineSimilarity, type Embedding2D } from "@/lib/nn/sequence";
import { useLabSnapshot } from "@/lib/nn/useLabSnapshot";
import type { SimSnapshot } from "@/engines/interaction/types";
import type { PresetComponent } from "@/engines/presets/PresetPlayground";
import { ExperienceHint, MetricChip } from "@/components/experience/ExperienceChrome";

export const EmbeddingsLab: PresetComponent = forwardRef(function EmbeddingsLab(_props, ref) {
  const [embeddings, setEmbeddings] = useState<Embedding2D[]>(DEFAULT_EMBEDDINGS);
  const [selected, setSelected] = useState(0);
  const [dragging, setDragging] = useState<number | null>(null);

  const sel = embeddings[selected];
  const sims = embeddings.map((e, i) => (i === selected ? 1 : cosineSimilarity(sel, e))).sort((a, b) => b - a);
  const topSim = sims[1] ?? 0;

  const snapshot: SimSnapshot = useMemo(
    () => ({
      presetId: "nn-embeddings",
      params: { selected },
      metrics: { topSimilarity: topSim },
      flags: { exploredSpace: topSim > 0.7 },
    }),
    [selected, topSim],
  );

  useImperativeHandle(ref, () => ({
    reset: () => { setEmbeddings(DEFAULT_EMBEDDINGS); setSelected(0); },
    getSnapshot: () => snapshot,
    getState: () => ({ selected }),
  }));
  useLabSnapshot(snapshot);

  const toSvg = (e: Embedding2D) => ({ cx: 160 + e.x * 80, cy: 100 - e.y * 80 });

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-bg-deep/70 p-4">
        <svg viewBox="0 0 320 200" className="w-full touch-none"
          onPointerUp={() => setDragging(null)}
          onPointerMove={(e) => {
            if (dragging === null) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 320;
            const y = ((e.clientY - rect.top) / rect.height) * 200;
            setEmbeddings((embs) => embs.map((emb, i) => i === dragging ? { ...emb, x: (x - 160) / 80, y: (100 - y) / 80 } : emb));
          }}>
          {embeddings.map((a, i) => embeddings.slice(i + 1).map((b) => {
            const s = cosineSimilarity(a, b);
            if (s < 0.5) return null;
            const p1 = toSvg(a); const p2 = toSvg(b);
            return <line key={`${a.word}-${b.word}`} x1={p1.cx} y1={p1.cy} x2={p2.cx} y2={p2.cy} stroke={`rgba(61,255,181,${s * 0.4})`} strokeWidth={1} />;
          }))}
          {embeddings.map((emb, i) => {
            const { cx, cy } = toSvg(emb);
            return (
              <g key={emb.word} onPointerDown={() => { setSelected(i); setDragging(i); }}>
                <circle cx={cx} cy={cy} r={selected === i ? 10 : 7} fill={selected === i ? "#3dffb5" : "#8b7cff"} stroke="white" strokeWidth={selected === i ? 2 : 1} className="cursor-grab" />
                <text x={cx} y={cy - 14} textAnchor="middle" className="fill-white/80 text-[10px]">{emb.word}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <MetricChip label={`similar to "${sel.word}"`} value={embeddings.filter((_, i) => i !== selected).sort((a, b) => cosineSimilarity(sel, b) - cosineSimilarity(sel, a))[0]?.word ?? "—"} tone="mint" />
      <ExperienceHint>Drag words in embedding space — nearby words have similar meaning. Distance is cosine similarity.</ExperienceHint>
    </div>
  );
});
