import type { TreeNode } from "@/engines/interaction/types";
import { Canvas2D } from "@/engines/visualization/Canvas2D";
import { drawTreeLayer } from "@/engines/visualization/layers/tree-layer";
import type { SimSnapshot } from "@/engines/interaction/types";

export type TreeSimState = {
  root: TreeNode;
  activeNodeId?: string;
};

export function sampleTree(): TreeNode {
  return {
    id: "root",
    feature: "energy",
    threshold: 0.5,
    left: {
      id: "l",
      feature: "runtime",
      threshold: 0.4,
      left: { id: "ll", isLeaf: true, prediction: 0 },
      right: { id: "lr", isLeaf: true, prediction: 0 },
    },
    right: {
      id: "r",
      isLeaf: true,
      prediction: 1,
    },
  };
}

export function createTreeState(): TreeSimState {
  return { root: sampleTree(), activeNodeId: "root" };
}

export function drawTreeSim(canvas: Canvas2D, state: TreeSimState): void {
  canvas.clear();
  drawTreeLayer(canvas, {
    root: state.root,
    activeNodeId: state.activeNodeId,
    splitHighlight: true,
  });
}

export function treeSnapshot(state: TreeSimState): SimSnapshot {
  return {
    presetId: "decision-tree",
    params: {},
    metrics: {},
    flags: { activeNode: !!state.activeNodeId },
  };
}
