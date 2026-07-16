import type { Canvas2D } from "@/engines/visualization/Canvas2D";
import type { LabeledPoint, NormPoint } from "@/engines/interaction/types";
import { labelColor, vizColors, withAlpha } from "@/engines/visualization/colors";

export type ClusterLayerOptions = {
  points: LabeledPoint[];
  centroids: NormPoint[];
  assignments?: number[];
  showVoronoi?: boolean;
};

export function drawClusterLayer(
  canvas: Canvas2D,
  opts: ClusterLayerOptions,
): void {
  const { ctx } = canvas;
  const { points, centroids, assignments, showVoronoi = false } = opts;
  const { w, h } = canvas.size;

  if (showVoronoi && centroids.length > 0) {
    const step = 8;
    for (let py = 0; py < h; py += step) {
      for (let px = 0; px < w; px += step) {
        const nx = px / w;
        const ny = 1 - py / h;
        let best = 0;
        let bestD = Infinity;
        centroids.forEach((c, i) => {
          const d = Math.hypot(c.x - nx, c.y - ny);
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        });
        ctx.fillStyle = withAlpha(labelColor(best % 2), 0.04);
        ctx.fillRect(px, py, step, step);
      }
    }
  }

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const color =
      assignments && assignments[i] !== undefined
        ? labelColor(assignments[i] % 2)
        : labelColor(p.label);
    const { px, py } = canvas.toScreen(p.x, p.y);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(px, py, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const c of centroids) {
    const { px, py } = canvas.toScreen(c.x, c.y);
    ctx.strokeStyle = vizColors.gold;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(px, py, 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = withAlpha(vizColors.gold, 0.3);
    ctx.fill();
  }
}
