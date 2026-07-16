import type { LabeledPoint, NormPoint } from "@/engines/interaction/types";

export function accuracy(
  points: LabeledPoint[],
  predict: (p: NormPoint) => number,
): number {
  if (points.length === 0) return 0;
  const correct = points.filter((p) => predict(p) === p.label).length;
  return correct / points.length;
}

export function mae(
  points: LabeledPoint[],
  predict: (p: NormPoint) => number,
  target: (p: LabeledPoint) => number = (p) => p.label,
): number {
  if (points.length === 0) return 0;
  return (
    points.reduce((s, p) => s + Math.abs(predict(p) - target(p)), 0) /
    points.length
  );
}

export function splitTrainTest(
  points: LabeledPoint[],
  ratio: number,
): { train: LabeledPoint[]; test: LabeledPoint[] } {
  const train: LabeledPoint[] = [];
  const test: LabeledPoint[] = [];
  points.forEach((p, i) => {
    const split = p.split ?? (i / points.length < ratio ? "train" : "test");
    if (split === "test") test.push(p);
    else train.push({ ...p, split: "train" });
  });
  if (test.length === 0 && train.length > 2) {
    const moved = train.pop()!;
    test.push({ ...moved, split: "test" });
  }
  return { train, test };
}
