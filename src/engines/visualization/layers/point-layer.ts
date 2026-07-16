import type { Canvas2D } from "@/engines/visualization/Canvas2D";
import type { LabeledPoint } from "@/engines/interaction/types";
import { labelColor, vizColors, withAlpha } from "@/engines/visualization/colors";

export type PointLayerOptions = {
  points: LabeledPoint[];
  radius?: number;
  draggable?: boolean;
  dragIndex?: number | null;
  pulseWrong?: number;
  predict?: (p: LabeledPoint) => number;
  showPrediction?: boolean;
};

export function drawPointLayer(
  canvas: Canvas2D,
  opts: PointLayerOptions,
): void {
  const { ctx } = canvas;
  const {
    points,
    radius = 9,
    dragIndex = null,
    pulseWrong = 0,
    predict,
    showPrediction = false,
  } = opts;

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const { px, py } = canvas.toScreen(p.x, p.y);
    const isHidden = p.split === "hidden";
    const isDragging = dragIndex === i;
    const pred = predict?.(p);
    const correct =
      showPrediction && predict ? pred === p.label : true;

    if (showPrediction && predict && !correct) {
      ctx.beginPath();
      ctx.arc(px, py, radius + 8 + pulseWrong * 2, 0, Math.PI * 2);
      ctx.fillStyle = withAlpha(vizColors.danger, 0.15);
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(px, py, isDragging ? radius + 2 : isHidden ? radius - 2 : radius, 0, Math.PI * 2);
    ctx.fillStyle = isHidden
      ? withAlpha(vizColors.inkMuted, 0.35)
      : labelColor(p.label);
    ctx.fill();
    ctx.strokeStyle = showPrediction && !correct ? vizColors.danger : vizColors.white;
    ctx.lineWidth = showPrediction && !correct ? 2.5 : 1.5;
    ctx.stroke();
  }
}

export function hitTestPointNorm(
  points: { x: number; y: number }[],
  nx: number,
  yUp: number,
  hitRadiusNorm = 0.06,
): number {
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i];
    if (Math.hypot(p.x - nx, p.y - yUp) < hitRadiusNorm) return i;
  }
  return -1;
}
