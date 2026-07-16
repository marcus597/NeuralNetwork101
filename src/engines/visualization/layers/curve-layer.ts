import type { Canvas2D } from "@/engines/visualization/Canvas2D";
import { vizColors, withAlpha } from "@/engines/visualization/colors";

export type CurveLayerOptions = {
  /** Evaluate y in normalized [0,1] for x in [0,1] */
  fn: (x: number) => number;
  color?: string;
  lineWidth?: number;
  dashed?: boolean;
  samples?: number;
};

export function drawCurveLayer(canvas: Canvas2D, opts: CurveLayerOptions): void {
  const { ctx } = canvas;
  const {
    fn,
    color = vizColors.violet,
    lineWidth = 2.5,
    dashed = false,
    samples = 100,
  } = opts;

  ctx.beginPath();
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const y = fn(t);
    const { px, py } = canvas.toScreen(t, y);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  if (dashed) ctx.setLineDash([6, 6]);
  ctx.stroke();
  ctx.setLineDash([]);
}

export type RegressionLineOptions = {
  slope: number;
  intercept: number;
  unstable?: boolean;
};

export function drawRegressionLine(
  canvas: Canvas2D,
  opts: RegressionLineOptions,
): void {
  const { slope, intercept, unstable = false } = opts;
  drawCurveLayer(canvas, {
    fn: (x) => slope * x + intercept,
    color: unstable ? vizColors.danger : vizColors.sky,
    lineWidth: unstable ? 3 : 2.5,
    dashed: unstable,
  });
}

export type ValErrorBarsOptions = {
  xs: number[];
  ys: number[];
  preds: number[];
};

export function drawValErrorBars(
  canvas: Canvas2D,
  opts: ValErrorBarsOptions,
): void {
  const { ctx } = canvas;
  const { xs, ys, preds } = opts;
  for (let i = 0; i < xs.length; i++) {
    const { px, py: pyTrue } = canvas.toScreen(xs[i], ys[i]);
    const { py: pyPred } = canvas.toScreen(xs[i], preds[i]);
    const err = Math.abs(preds[i] - ys[i]);
    ctx.fillStyle = err > 0.08 ? vizColors.danger : withAlpha(vizColors.inkMuted, 0.5);
    ctx.beginPath();
    ctx.arc(px, pyTrue, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = withAlpha(vizColors.inkMuted, 0.4);
    ctx.beginPath();
    ctx.moveTo(px, pyTrue);
    ctx.lineTo(px, pyPred);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}
