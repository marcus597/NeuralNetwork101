import type { LabeledPoint } from "@/engines/interaction/types";

export class DatasetManager {
  private points: LabeledPoint[];

  constructor(points: LabeledPoint[]) {
    this.points = points;
  }

  all(): LabeledPoint[] {
    return this.points;
  }

  bySplit(split: LabeledPoint["split"]): LabeledPoint[] {
    return this.points.filter((p) => p.split === split);
  }

  visible(revealHidden: boolean): LabeledPoint[] {
    if (revealHidden) return this.points;
    return this.points.filter((p) => p.split !== "hidden");
  }

  train(): LabeledPoint[] {
    return this.bySplit("train");
  }

  test(): LabeledPoint[] {
    return this.bySplit("test");
  }

  hidden(): LabeledPoint[] {
    return this.bySplit("hidden");
  }

  val(): LabeledPoint[] {
    return this.bySplit("val");
  }

  updatePoint(id: string, patch: Partial<LabeledPoint>): void {
    this.points = this.points.map((p) =>
      p.id === id ? { ...p, ...patch } : p,
    );
  }

  replace(points: LabeledPoint[]): void {
    this.points = points;
  }
}
