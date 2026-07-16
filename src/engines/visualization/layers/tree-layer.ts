import type { Canvas2D } from "@/engines/visualization/Canvas2D";
import type { TreeNode } from "@/engines/interaction/types";
import { vizColors, withAlpha } from "@/engines/visualization/colors";

type LayoutNode = {
  node: TreeNode;
  x: number;
  y: number;
  depth: number;
};

function layoutTree(root: TreeNode, depth = 0, x = 0.5, spread = 0.4): LayoutNode[] {
  const result: LayoutNode[] = [{ node: root, x, y: 0.1 + depth * 0.22, depth }];
  if (root.left) {
    result.push(...layoutTree(root.left, depth + 1, x - spread / (depth + 1), spread));
  }
  if (root.right) {
    result.push(...layoutTree(root.right, depth + 1, x + spread / (depth + 1), spread));
  }
  return result;
}

export type TreeLayerOptions = {
  root: TreeNode;
  activeNodeId?: string;
  splitHighlight?: boolean;
};

export function drawTreeLayer(canvas: Canvas2D, opts: TreeLayerOptions): void {
  const { ctx } = canvas;
  const { root, activeNodeId, splitHighlight = false } = opts;
  const layout = layoutTree(root);
  const byId = new Map(layout.map((l) => [l.node.id, l]));

  for (const item of layout) {
    const n = item.node;
    if (n.left) {
      const child = byId.get(n.left.id);
      if (child) drawEdge(canvas, item, child);
    }
    if (n.right) {
      const child = byId.get(n.right.id);
      if (child) drawEdge(canvas, item, child);
    }
  }

  for (const item of layout) {
    const { px, py } = canvas.toScreen(item.x, 1 - item.y);
    const active = item.node.id === activeNodeId;
    ctx.fillStyle = item.node.isLeaf
      ? withAlpha(vizColors.mint, 0.85)
      : active && splitHighlight
        ? vizColors.gold
        : withAlpha(vizColors.violet, 0.75);
    ctx.beginPath();
    ctx.arc(px, py, active ? 16 : 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = vizColors.white;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const label = item.node.isLeaf
      ? `→ ${item.node.prediction ?? "?"}`
      : `${item.node.feature ?? "?"} ≤ ${item.node.threshold?.toFixed(2) ?? "?"}`;
    ctx.fillStyle = vizColors.white;
    ctx.font = "9px monospace";
    ctx.textAlign = "center";
    ctx.fillText(label, px, py + 3);
  }
}

function drawEdge(
  canvas: Canvas2D,
  a: LayoutNode,
  b: LayoutNode,
): void {
  const { ctx } = canvas;
  const pa = canvas.toScreen(a.x, 1 - a.y);
  const pb = canvas.toScreen(b.x, 1 - b.y);
  ctx.strokeStyle = withAlpha(vizColors.inkMuted, 0.5);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(pa.px, pa.py);
  ctx.lineTo(pb.px, pb.py);
  ctx.stroke();
}
