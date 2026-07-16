export type RegressionPoint = { id: string; x: number; y: number };

export function regressionLoss(
  points: RegressionPoint[],
  slope: number,
  intercept: number,
): number {
  if (points.length === 0) return 0;
  return (
    points.reduce((sum, p) => {
      const pred = slope * p.x + intercept;
      return sum + (pred - p.y) ** 2;
    }, 0) / points.length
  );
}

export function gradientDescentStep(
  points: RegressionPoint[],
  slope: number,
  intercept: number,
  lr: number,
): { slope: number; intercept: number; loss: number } {
  let ds = 0;
  let di = 0;
  for (const p of points) {
    const err = slope * p.x + intercept - p.y;
    ds += 2 * err * p.x;
    di += 2 * err;
  }
  ds = (ds / points.length) * lr;
  di = (di / points.length) * lr;
  const newSlope = slope - ds;
  const newIntercept = intercept - di;
  return {
    slope: newSlope,
    intercept: newIntercept,
    loss: regressionLoss(points, newSlope, newIntercept),
  };
}

export function buildTrainingTimeline(
  points: RegressionPoint[],
  initialSlope: number,
  initialIntercept: number,
  lr: number,
  steps: number,
): Array<{ slope: number; intercept: number; loss: number; step: number }> {
  const timeline: Array<{ slope: number; intercept: number; loss: number; step: number }> = [];
  let slope = initialSlope;
  let intercept = initialIntercept;
  for (let i = 0; i < steps; i++) {
    const next = gradientDescentStep(points, slope, intercept, lr);
    slope = next.slope;
    intercept = next.intercept;
    timeline.push({ ...next, step: i + 1 });
  }
  return timeline;
}
