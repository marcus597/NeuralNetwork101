import type { NormPoint } from "@/engines/interaction/types";

export type DistanceMetric = "euclidean" | "manhattan";

export function distance(
  a: NormPoint,
  b: NormPoint,
  metric: DistanceMetric = "euclidean",
): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  if (metric === "manhattan") return Math.abs(dx) + Math.abs(dy);
  return Math.hypot(dx, dy);
}

export function knnPredict(
  query: NormPoint,
  points: (NormPoint & { label: number })[],
  k: number,
  metric: DistanceMetric = "euclidean",
): number {
  const sorted = [...points]
    .map((p) => ({ label: p.label, d: distance(query, p, metric) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, Math.max(1, k));

  const votes = sorted.reduce(
    (acc, { label }) => {
      acc[label] = (acc[label] ?? 0) + 1;
      return acc;
    },
    {} as Record<number, number>,
  );

  return Number(
    Object.entries(votes).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 0,
  );
}
