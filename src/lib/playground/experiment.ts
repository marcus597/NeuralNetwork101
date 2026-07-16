import type { LabeledPoint } from "@/engines/interaction/types";
import type { AlgorithmId } from "@/lib/algorithms/types";

export const EXPERIMENT_SCHEMA_VERSION = 1;
export const MAX_SHARE_POINTS = 500;

export type PlaygroundExperiment = {
  v: number;
  name: string;
  seed: number;
  task: "classification" | "regression" | "clustering";
  points: LabeledPoint[];
  trainRatio: number;
  primaryAlgorithm: AlgorithmId;
  compareAlgorithms: AlgorithmId[];
  hyperparams: Partial<Record<AlgorithmId, Record<string, number>>>;
  createdAt: string;
};

export type SavedExperimentMeta = {
  id: string;
  name: string;
  createdAt: string;
};

const STORAGE_KEY = "wonder-experiments";
const INDEX_KEY = "wonder-experiments-index";

function trimPoints(points: LabeledPoint[]): LabeledPoint[] {
  if (points.length <= MAX_SHARE_POINTS) return points;
  return points.slice(0, MAX_SHARE_POINTS);
}

export function serializeExperiment(exp: PlaygroundExperiment): string {
  const payload = {
    ...exp,
    points: trimPoints(exp.points).map(({ id, x, y, label, split, meta }) => ({
      id,
      x: Math.round(x * 1000) / 1000,
      y: Math.round(y * 1000) / 1000,
      label,
      split,
      meta,
    })),
  };
  return JSON.stringify(payload);
}

export function encodeShareUrl(exp: PlaygroundExperiment): string {
  const json = serializeExperiment(exp);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  const b64 = btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return `#e=${b64}`;
}

export function decodeShareHash(hash: string): PlaygroundExperiment | null {
  try {
    const match = hash.match(/#e=([A-Za-z0-9_-]+)/);
    if (!match) return null;
    let b64 = match[1].replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const binary = atob(b64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json) as PlaygroundExperiment;
    if (parsed.v !== EXPERIMENT_SCHEMA_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveExperimentLocal(
  id: string,
  exp: PlaygroundExperiment,
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${STORAGE_KEY}-${id}`, serializeExperiment(exp));
  const index = loadExperimentIndex();
  const meta: SavedExperimentMeta = {
    id,
    name: exp.name,
    createdAt: exp.createdAt,
  };
  const next = [meta, ...index.filter((m) => m.id !== id)].slice(0, 20);
  localStorage.setItem(INDEX_KEY, JSON.stringify(next));
}

export function loadExperimentLocal(id: string): PlaygroundExperiment | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(`${STORAGE_KEY}-${id}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PlaygroundExperiment;
  } catch {
    return null;
  }
}

export function loadExperimentIndex(): SavedExperimentMeta[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(INDEX_KEY) ?? "[]") as SavedExperimentMeta[];
  } catch {
    return [];
  }
}

export function deleteExperimentLocal(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${STORAGE_KEY}-${id}`);
  const next = loadExperimentIndex().filter((m) => m.id !== id);
  localStorage.setItem(INDEX_KEY, JSON.stringify(next));
}

export function createExperimentId(): string {
  return `exp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
