/** Loss functions for interactive labs. */

export function mseLoss(pred: number, target: number): number {
  return (pred - target) ** 2;
}

export function mseLossDerivative(pred: number, target: number): number {
  return 2 * (pred - target);
}

/** Binary cross-entropy for p in (0,1) */
export function bceLoss(pred: number, target: number): number {
  const p = Math.max(1e-7, Math.min(1 - 1e-7, pred));
  return -(target * Math.log(p) + (1 - target) * Math.log(1 - p));
}

export function bceLossDerivative(pred: number, target: number): number {
  const p = Math.max(1e-7, Math.min(1 - 1e-7, pred));
  return (p - target) / (p * (1 - p));
}

export function sampleLossCurve(
  fn: "mse" | "bce",
  target: number,
  steps = 80,
): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const p = i / steps;
    const y = fn === "mse" ? mseLoss(p, target) : bceLoss(p, target);
    pts.push({ x: p, y: Math.min(y, 4) });
  }
  return pts;
}
