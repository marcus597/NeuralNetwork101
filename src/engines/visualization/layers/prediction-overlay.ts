import type { Canvas2D } from "@/engines/visualization/Canvas2D";
import type { LabeledPoint, NormPoint } from "@/engines/interaction/types";
import { vizColors, withAlpha } from "@/engines/visualization/colors";

export type KnnOverlayOptions = {
  query: NormPoint;
  neighbors: (LabeledPoint & { dist: number })[];
  k: number;
};

export function drawKnnOverlay(canvas: Canvas2D, opts: KnnOverlayOptions): void {
  const { ctx } = canvas;
  const { query, neighbors, k } = opts;
  const { px: qx, py: qy } = canvas.toScreen(query.x, query.y);

  ctx.strokeStyle = withAlpha(vizColors.gold, 0.6);
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  for (const n of neighbors.slice(0, k)) {
    const { px, py } = canvas.toScreen(n.x, n.y);
    ctx.beginPath();
    ctx.moveTo(qx, qy);
    ctx.lineTo(px, py);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  if (neighbors[k - 1]) {
    const radius =
      neighbors[k - 1].dist * Math.min(canvas.size.w, canvas.size.h);
    ctx.strokeStyle = withAlpha(vizColors.gold, 0.35);
    ctx.beginPath();
    ctx.arc(qx, qy, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = vizColors.gold;
  ctx.beginPath();
  ctx.arc(qx, qy, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = vizColors.white;
  ctx.lineWidth = 2;
  ctx.stroke();
}

export type MarginBandOptions = {
  angle: number;
  offset: number;
  margin: number;
};

export function drawMarginBand(
  canvas: Canvas2D,
  opts: MarginBandOptions,
): void {
  const { ctx } = canvas;
  const { angle, offset, margin } = opts;
  const { w, h } = canvas.size;
  const nx = Math.cos(angle);
  const ny = Math.sin(angle);
  const cx = w / 2;
  const cy = h / 2;
  const len = Math.max(w, h);

  ctx.strokeStyle = withAlpha(vizColors.sky, 0.25);
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(cx - nx * len, cy - ny * len);
  ctx.lineTo(cx + nx * len, cy + ny * len);
  ctx.stroke();

  ctx.fillStyle = withAlpha(vizColors.sky, 0.08);
  ctx.save();
  ctx.translate(cx + nx * offset * w * 0.35, cy + ny * offset * w * 0.35);
  ctx.rotate(angle);
  ctx.fillRect(-len, -margin * h * 0.5, len * 2, margin * h);
  ctx.restore();
}
