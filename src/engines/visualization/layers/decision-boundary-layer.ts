import type { Canvas2D } from "@/engines/visualization/Canvas2D";
import type { DecisionBoundaryState } from "@/engines/interaction/types";
import { vizColors, withAlpha } from "@/engines/visualization/colors";

export type DecisionBoundaryLayerOptions = DecisionBoundaryState & {
  showHandle?: boolean;
  showRegions?: boolean;
};

export function drawDecisionBoundaryLayer(
  canvas: Canvas2D,
  opts: DecisionBoundaryLayerOptions,
): void {
  const { ctx } = canvas;
  const { w, h } = canvas.size;
  const { angle, offset, showHandle = true, showRegions = true } = opts;
  const nx = Math.cos(angle);
  const ny = Math.sin(angle);

  if (showRegions) {
    ctx.fillStyle = withAlpha(vizColors.coral, 0.06);
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.clip();
    for (let y = 0; y < h; y += 4) {
      const x = ((-offset - ny * (y / h)) / (nx || 1e-6)) * w;
      ctx.fillStyle = withAlpha(vizColors.mint, 0.05);
      ctx.fillRect(x, y, w, 4);
    }
    ctx.restore();
  }

  const cx = w / 2;
  const cy = h / 2;
  const len = Math.max(w, h);
  ctx.strokeStyle = withAlpha(vizColors.violet, 0.9);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - nx * len, cy - ny * len);
  ctx.lineTo(cx + nx * len, cy + ny * len);
  ctx.stroke();

  if (showHandle) {
    const hx = cx + nx * offset * w * 0.35;
    const hy = cy + ny * offset * w * 0.35;
    ctx.fillStyle = vizColors.violet;
    ctx.beginPath();
    ctx.arc(hx, hy, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = vizColors.white;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

export function boundaryFromPointer(
  nx: number,
  ny: number,
): DecisionBoundaryState {
  return {
    angle: Math.atan2(ny - 0.5, nx - 0.5) + Math.PI / 2,
    offset: (Math.hypot(nx - 0.5, ny - 0.5) - 0.25) * 1.8,
  };
}

export function predictLinearBoundary(
  x: number,
  y: number,
  boundary: DecisionBoundaryState,
): 0 | 1 {
  const nx = Math.cos(boundary.angle);
  const ny = Math.sin(boundary.angle);
  return nx * x + ny * y + boundary.offset >= 0 ? 1 : 0;
}
