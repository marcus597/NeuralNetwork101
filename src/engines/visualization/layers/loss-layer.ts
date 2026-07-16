import type { Canvas2D } from "@/engines/visualization/Canvas2D";
import { vizColors } from "@/engines/visualization/colors";

export type LossLayerOptions = {
  history: number[];
  current: number;
  maxPoints?: number;
  heightFraction?: number;
};

export function drawLossLayer(canvas: Canvas2D, opts: LossLayerOptions): void {
  const { ctx } = canvas;
  const { history, current, maxPoints = 40, heightFraction = 0.25 } = opts;
  const { w, h } = canvas.size;

  if (history.length < 2) {
    ctx.fillStyle = vizColors.gold;
    ctx.font = "11px monospace";
    ctx.fillText(`loss ${current.toFixed(4)}`, 16, h - 8);
    return;
  }

  const slice = history.slice(-maxPoints);
  const maxL = Math.max(...slice, 0.01);
  ctx.strokeStyle = "rgba(255, 209, 102, 0.8)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  slice.forEach((l, i) => {
    const x = 16 + (i / maxPoints) * (w - 32);
    const y = h - 24 - (l / maxL) * (h * heightFraction);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.fillStyle = vizColors.gold;
  ctx.font = "11px monospace";
  ctx.fillText(`loss ${current.toFixed(4)}`, 16, h - 8);
}
