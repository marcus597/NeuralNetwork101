/** 2D surfaces for gradient descent visualizations. */

export type Point2 = { x: number; y: number };

export function bowlLoss(p: Point2): number {
  return p.x * p.x + p.y * p.y;
}

export function bowlGrad(p: Point2): Point2 {
  return { x: 2 * p.x, y: 2 * p.y };
}

export function rosenbrockLoss(p: Point2): number {
  return (1 - p.x) ** 2 + 100 * (p.y - p.x * p.x) ** 2;
}

export function rosenbrockGrad(p: Point2): Point2 {
  return {
    x: -2 * (1 - p.x) - 400 * p.x * (p.y - p.x * p.x),
    y: 200 * (p.y - p.x * p.x),
  };
}

export function saddleLoss(p: Point2): number {
  return p.x * p.x - p.y * p.y + 0.5;
}

export function saddleGrad(p: Point2): Point2 {
  return { x: 2 * p.x, y: -2 * p.y };
}

export type SurfaceId = "bowl" | "rosenbrock" | "saddle";

const SURFACES: Record<
  SurfaceId,
  { loss: (p: Point2) => number; grad: (p: Point2) => Point2; label: string }
> = {
  bowl: { loss: bowlLoss, grad: bowlGrad, label: "Simple bowl" },
  rosenbrock: { loss: rosenbrockLoss, grad: rosenbrockGrad, label: "Rosenbrock valley" },
  saddle: { loss: saddleLoss, grad: saddleGrad, label: "Saddle" },
};

export function getSurface(id: SurfaceId) {
  return SURFACES[id];
}

export function sgdStep(p: Point2, grad: Point2, lr: number): Point2 {
  return { x: p.x - lr * grad.x, y: p.y - lr * grad.y };
}

export function sampleContour(
  id: SurfaceId,
  grid = 20,
  range = 2,
): { x: number; y: number; z: number }[] {
  const { loss } = getSurface(id);
  const pts: { x: number; y: number; z: number }[] = [];
  for (let i = 0; i <= grid; i++) {
    for (let j = 0; j <= grid; j++) {
      const x = -range + (2 * range * i) / grid;
      const y = -range + (2 * range * j) / grid;
      pts.push({ x, y, z: loss({ x, y }) });
    }
  }
  return pts;
}
