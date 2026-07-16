import type { SimSnapshot } from "@/engines/interaction/types";
import { evalPoly, mse, polyFit } from "@/lib/ml-math";
import { Canvas2D } from "@/engines/visualization/Canvas2D";
import {
  drawCurveLayer,
  drawValErrorBars,
} from "@/engines/visualization/layers/curve-layer";
import { drawPointLayer } from "@/engines/visualization/layers/point-layer";
import { vizColors } from "@/engines/visualization/colors";

const TRAIN_X = [0.05, 0.15, 0.3, 0.45, 0.55, 0.7, 0.82, 0.92];
const TRAIN_Y = [0.35, 0.42, 0.5, 0.58, 0.62, 0.68, 0.74, 0.8];
const VAL_X = [0.22, 0.38, 0.62, 0.78];
const VAL_Y = [0.46, 0.54, 0.66, 0.72];

export type OverfitSimState = {
  degree: number;
};

export function createOverfitState(degree = 2): OverfitSimState {
  return { degree };
}

export function drawOverfitSim(canvas: Canvas2D, state: OverfitSimState): void {
  canvas.clear();
  const coeffs = polyFit(TRAIN_X, TRAIN_Y, state.degree);
  const trainMse = mse(TRAIN_X, TRAIN_Y, coeffs);
  const valMse = mse(VAL_X, VAL_Y, coeffs);
  const overfit = state.degree >= 6 && valMse > trainMse * 2.5;

  drawCurveLayer(canvas, {
    fn: (x) => evalPoly(coeffs, x),
    color: overfit ? vizColors.danger : vizColors.violet,
  });

  drawPointLayer(canvas, {
    points: TRAIN_X.map((x, i) => ({
      id: `t-${i}`,
      x,
      y: TRAIN_Y[i],
      label: 0,
      split: "train",
    })),
    radius: 7,
  });

  drawValErrorBars(canvas, {
    xs: VAL_X,
    ys: VAL_Y,
    preds: VAL_X.map((x) => evalPoly(coeffs, x)),
  });

  const { ctx } = canvas;
  ctx.font = "11px monospace";
  ctx.fillStyle = vizColors.mint;
  ctx.fillText(`train ${trainMse.toFixed(4)}`, 12, 20);
  ctx.fillStyle = overfit ? vizColors.danger : "#94a3b8";
  ctx.fillText(`val ${valMse.toFixed(4)}`, 12, 36);
}

export function overfitSnapshot(state: OverfitSimState): SimSnapshot {
  const coeffs = polyFit(TRAIN_X, TRAIN_Y, state.degree);
  const trainMse = mse(TRAIN_X, TRAIN_Y, coeffs);
  const valMse = mse(VAL_X, VAL_Y, coeffs);
  return {
    presetId: "overfit",
    params: { degree: state.degree },
    metrics: { trainMse, valMse },
    flags: { overfit: state.degree >= 6 && valMse > trainMse * 2.5 },
  };
}

export { TRAIN_X, TRAIN_Y, VAL_X, VAL_Y };
