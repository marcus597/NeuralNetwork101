import type { Canvas2D } from "@/engines/visualization/Canvas2D";
import type { GraphEdge, GraphNode } from "@/engines/interaction/types";
import { vizColors, withAlpha } from "@/engines/visualization/colors";

export type GraphLayerOptions = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  highlightNodeIds?: string[];
};

export function drawGraphLayer(canvas: Canvas2D, opts: GraphLayerOptions): void {
  const { ctx } = canvas;
  const { nodes, edges, highlightNodeIds = [] } = opts;
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  for (const edge of edges) {
    const a = nodeMap.get(edge.from);
    const b = nodeMap.get(edge.to);
    if (!a || !b) continue;
    const pa = canvas.toScreen(a.x, a.y);
    const pb = canvas.toScreen(b.x, b.y);
    ctx.strokeStyle = withAlpha(vizColors.violet, 0.35);
    ctx.lineWidth = edge.weight ? 1 + edge.weight * 2 : 1.5;
    ctx.beginPath();
    ctx.moveTo(pa.px, pa.py);
    ctx.lineTo(pb.px, pb.py);
    ctx.stroke();
  }

  for (const node of nodes) {
    const { px, py } = canvas.toScreen(node.x, node.y);
    const highlighted = highlightNodeIds.includes(node.id);
    const r = node.active || highlighted ? 14 : 10;
    ctx.fillStyle = highlighted ? vizColors.mint : withAlpha(vizColors.sky, 0.8);
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = vizColors.white;
    ctx.lineWidth = 2;
    ctx.stroke();
    if (node.label) {
      ctx.fillStyle = vizColors.white;
      ctx.font = "10px system-ui,sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(node.label, px, py - r - 4);
    }
  }
}
