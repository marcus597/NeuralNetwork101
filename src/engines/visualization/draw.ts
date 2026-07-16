import type { LabeledPoint, NormPoint } from "@/engines/interaction/types";
import type { AlgorithmModel } from "@/lib/algorithms/types";
import { vizColors, labelColor, withAlpha } from "@/engines/visualization/colors";
import { distance } from "@/lib/viz/distance";

type Size = { w: number; h: number };

function toScreen(x: number, y: number, size: Size) {
  return { px: x * size.w, py: (1 - y) * size.h };
}

export function drawGrid(ctx: CanvasRenderingContext2D, size: Size) {
  ctx.strokeStyle = withAlpha(vizColors.inkMuted, 0.08);
  ctx.lineWidth = 1;
  for (let i = 1; i < 4; i++) {
    const x = (i / 4) * size.w;
    const y = (i / 4) * size.h;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size.h);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size.w, y);
    ctx.stroke();
  }
}

export function drawPoints(
  ctx: CanvasRenderingContext2D,
  points: LabeledPoint[],
  size: Size,
  opts: {
    selectedId?: string | null;
    highlightIds?: string[];
    showSplit?: boolean;
  } = {},
) {
  points.forEach((p) => {
    const { px, py } = toScreen(p.x, p.y, size);
    const isSelected = p.id === opts.selectedId;
    const isHighlight = opts.highlightIds?.includes(p.id);

    if (isHighlight) {
      ctx.beginPath();
      ctx.arc(px, py, 18, 0, Math.PI * 2);
      ctx.fillStyle = withAlpha(vizColors.gold, 0.25);
      ctx.fill();
    }

    if (opts.showSplit && p.split === "test") {
      ctx.setLineDash([3, 3]);
    } else {
      ctx.setLineDash([]);
    }

    ctx.beginPath();
    ctx.arc(px, py, isSelected ? 10 : 7, 0, Math.PI * 2);
    ctx.fillStyle = labelColor(p.label);
    ctx.fill();
    ctx.strokeStyle = isSelected ? vizColors.white : withAlpha(vizColors.white, 0.6);
    ctx.lineWidth = isSelected ? 2.5 : 1.5;
    ctx.stroke();
    ctx.setLineDash([]);
  });
}

export function drawDecisionRegions(
  ctx: CanvasRenderingContext2D,
  size: Size,
  predict: (p: NormPoint) => number,
  resolution = 40,
) {
  const cellW = size.w / resolution;
  const cellH = size.h / resolution;
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      const x = (i + 0.5) / resolution;
      const y = 1 - (j + 0.5) / resolution;
      const pred = predict({ x, y });
      ctx.fillStyle = withAlpha(pred >= 0.5 ? vizColors.labelB : vizColors.labelA, 0.07);
      ctx.fillRect(i * cellW, j * cellH, cellW + 1, cellH + 1);
    }
  }
}

export function drawBoundaryLine(
  ctx: CanvasRenderingContext2D,
  size: Size,
  angle: number,
  offset: number,
  color: string = vizColors.violet,
) {
  const nx = Math.cos(angle);
  const ny = Math.sin(angle);
  const len = Math.max(size.w, size.h);
  const cx = size.w / 2;
  const cy = size.h / 2;
  const x1 = cx - nx * len;
  const y1 = cy - ny * len;
  const x2 = cx + nx * len;
  const y2 = cy + ny * len;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export function drawRegressionLine(
  ctx: CanvasRenderingContext2D,
  size: Size,
  slope: number,
  intercept: number,
  color = vizColors.sky,
) {
  const y0 = intercept;
  const y1 = slope * 1 + intercept;
  const p0 = toScreen(0, y0, size);
  const p1 = toScreen(1, y1, size);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(p0.px, p0.py);
  ctx.lineTo(p1.px, p1.py);
  ctx.stroke();
}

export function drawTreeSplit(
  ctx: CanvasRenderingContext2D,
  size: Size,
  feature: "x" | "y",
  threshold: number,
) {
  ctx.strokeStyle = withAlpha(vizColors.gold, 0.85);
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  if (feature === "x") {
    const { px } = toScreen(threshold, 0, size);
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, size.h);
    ctx.stroke();
  } else {
    const { py } = toScreen(0, threshold, size);
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(size.w, py);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

export function drawCentroids(
  ctx: CanvasRenderingContext2D,
  size: Size,
  centroids: NormPoint[],
) {
  centroids.forEach((c, i) => {
    const { px, py } = toScreen(c.x, c.y, size);
    ctx.beginPath();
    ctx.arc(px, py, 12, 0, Math.PI * 2);
    ctx.fillStyle = withAlpha(vizColors.violet, 0.3);
    ctx.fill();
    ctx.strokeStyle = vizColors.violet;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = "11px monospace";
    ctx.fillStyle = vizColors.white;
    ctx.fillText(String(i), px - 3, py + 4);
  });
}

export function drawKnnNeighbors(
  ctx: CanvasRenderingContext2D,
  query: LabeledPoint,
  neighbors: LabeledPoint[],
  size: Size,
) {
  const q = toScreen(query.x, query.y, size);
  neighbors.forEach((n) => {
    const p = toScreen(n.x, n.y, size);
    ctx.strokeStyle = withAlpha(vizColors.gold, 0.7);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(q.px, q.py);
    ctx.lineTo(p.px, p.py);
    ctx.stroke();
  });
}

export function drawModelOverlay(
  ctx: CanvasRenderingContext2D,
  size: Size,
  model: AlgorithmModel,
  stepIndex: number,
  task: "classification" | "regression" | "clustering",
) {
  const algo = model.algorithmId;
  const step = model.steps[Math.min(stepIndex, model.steps.length - 1)];
  const overlay = step?.overlay ?? {};
  const state = { ...model.state, ...overlay };

  if (task === "regression" && algo === "linear-regression") {
    const { slope, intercept } = state as { slope: number; intercept: number };
    drawRegressionLine(ctx, size, slope, intercept);
    return;
  }

  if (algo === "kmeans") {
    const { centroids } = state as { centroids: NormPoint[] };
    if (centroids) drawCentroids(ctx, size, centroids);
    return;
  }

  if (algo === "decision-tree" || algo === "random-forest") {
    const feature = overlay.feature as "x" | "y" | undefined;
    const threshold = overlay.threshold as number | undefined;
    if (feature && threshold !== undefined) {
      drawTreeSplit(ctx, size, feature, threshold);
    }
    if (algo === "random-forest" && overlay.treeIndex !== undefined) {
      ctx.font = "12px monospace";
      ctx.fillStyle = vizColors.gold;
      ctx.fillText(`Tree ${(overlay.treeIndex as number) + 1} voting`, 12, 20);
    }
    return;
  }

  if (algo === "svm" || algo === "logistic-regression") {
    if (algo === "svm") {
      const { angle, offset, margin } = state as {
        angle: number;
        offset: number;
        margin?: number;
      };
      drawBoundaryLine(ctx, size, angle, offset, vizColors.violet);
      if (margin && margin > 0) {
        drawBoundaryLine(ctx, size, angle, offset + margin * 0.15, withAlpha(vizColors.violet, 0.4));
        drawBoundaryLine(ctx, size, angle, offset - margin * 0.15, withAlpha(vizColors.violet, 0.4));
      }
    } else {
      const { w1, w2, b } = state as { w1: number; w2: number; b: number };
      const angle = Math.atan2(w2, w1) + Math.PI / 2;
      const offset = -b / Math.hypot(w1, w2 || 1e-6);
      drawBoundaryLine(ctx, size, angle, offset * 0.3, vizColors.sky);
    }
    return;
  }

  if (algo === "naive-bayes") {
    const { stats } = state as {
      stats?: Record<number, { mx: number; my: number; vx: number; vy: number }>;
    };
    if (stats) {
      Object.entries(stats).forEach(([label, s]) => {
        const { px, py } = toScreen(s.mx, s.my, size);
        ctx.beginPath();
        ctx.ellipse(px, py, Math.sqrt(s.vx) * size.w * 0.5, Math.sqrt(s.vy) * size.h * 0.5, 0, 0, Math.PI * 2);
        ctx.strokeStyle = labelColor(Number(label));
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    }
  }
}

export function drawPredictionCursor(
  ctx: CanvasRenderingContext2D,
  point: NormPoint,
  prediction: number,
  size: Size,
) {
  const { px, py } = toScreen(point.x, point.y, size);
  ctx.font = "11px monospace";
  ctx.fillStyle = vizColors.white;
  ctx.fillText(`→ ${prediction}`, px + 10, py - 10);
}

export { toScreen, distance };
