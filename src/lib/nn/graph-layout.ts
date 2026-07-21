import type { TinyGradients, TinyNetwork } from "@/lib/nn/math";

export type GraphNode = {
  id: string;
  layer: number;
  index: number;
  label: string;
  value: number;
  preActivation?: number;
  frozen?: boolean;
};

export type GraphEdge = {
  id: string;
  from: string;
  to: string;
  weight: number;
  gradient?: number;
  flow?: number;
  pulse?: number;
};

export type NetworkGraph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  width: number;
  height: number;
};

const LAYER_X = [80, 220, 360, 500];
const NODE_R = 26;

export function layoutTinyNetwork(
  net: TinyNetwork,
  inputs: readonly number[],
  activations?: { hidden: number[]; hiddenPre: number[]; output: number; outputPre: number },
  gradients?: TinyGradients,
  flowPhase?: number,
): NetworkGraph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const hiddenCount = net.w1.length;
  const layerCount = hiddenCount > 0 ? 3 : 2;

  inputs.forEach((v, i) => {
    nodes.push({
      id: `in-${i}`,
      layer: 0,
      index: i,
      label: `x${i + 1}`,
      value: v,
    });
  });

  if (hiddenCount > 0) {
    const hiddenVals = activations?.hidden ?? net.b1.map(() => 0);
    const hiddenPre = activations?.hiddenPre ?? hiddenVals;
    for (let h = 0; h < hiddenCount; h++) {
      nodes.push({
        id: `hid-${h}`,
        layer: 1,
        index: h,
        label: `h${h + 1}`,
        value: hiddenVals[h] ?? 0,
        preActivation: hiddenPre[h],
        frozen: net.frozenHidden,
      });
    }
  }

  nodes.push({
    id: "out",
    layer: hiddenCount > 0 ? 2 : 1,
    index: 0,
    label: "ŷ",
    value: activations?.output ?? 0,
    preActivation: activations?.outputPre,
    frozen: net.frozenOutput,
  });

  if (net.w1.length > 0) {
    net.w1.forEach((row, h) => {
      row.forEach((w, i) => {
        edges.push({
          id: `w1-${h}-${i}`,
          from: `in-${i}`,
          to: `hid-${h}`,
          weight: w,
          gradient: gradients?.w1[h]?.[i],
          flow: flowPhase !== undefined && flowPhase >= 1 ? 1 : 0,
          pulse: flowPhase === 1 ? i / inputs.length : undefined,
        });
      });
    });
    net.w2.forEach((w, h) => {
      edges.push({
        id: `w2-${h}`,
        from: `hid-${h}`,
        to: "out",
        weight: w,
        gradient: gradients?.w2[h],
        flow: flowPhase !== undefined && flowPhase >= 2 ? 1 : 0,
        pulse: flowPhase === 2 ? h / hiddenCount : undefined,
      });
    });
  } else {
    inputs.forEach((_, i) => {
      edges.push({
        id: `direct-${i}`,
        from: `in-${i}`,
        to: "out",
        weight: net.w2[i] ?? 0,
        gradient: gradients?.w2[i],
        flow: flowPhase !== undefined ? 1 : 0,
      });
    });
  }

  const layerCounts =
    hiddenCount > 0 ? [inputs.length, hiddenCount, 1] : [inputs.length, 1];
  const maxNodes = Math.max(...layerCounts, 2);
  const height = maxNodes * 72 + 40;
  const layerX = hiddenCount > 0 ? LAYER_X : [100, 420];

  nodes.forEach((n) => {
    const count = layerCounts[n.layer] ?? 1;
    const yStep = height / (count + 1);
    (n as GraphNode & { x: number; y: number }).x = layerX[n.layer] ?? 80;
    (n as GraphNode & { x: number; y: number }).y = yStep * (n.index + 1);
  });

  return {
    nodes,
    edges,
    width: 580,
    height,
  };
}

export function nodePosition(node: GraphNode & { x?: number; y?: number }) {
  return { x: node.x ?? 0, y: node.y ?? 0 };
}

export function heatColor(value: number, max = 1): string {
  const t = Math.min(1, Math.abs(value) / max);
  if (value >= 0) {
    const r = Math.round(243 + t * (46 - 243));
    const g = Math.round(238 + t * (134 - 238));
    const b = Math.round(249 + t * (171 - 249));
    return `rgb(${r},${g},${b})`;
  }
  const r = Math.round(252 + t * (214 - 252));
  const g = Math.round(234 + t * (69 - 234));
  const b = Math.round(234 + t * (69 - 234));
  return `rgb(${r},${g},${b})`;
}

export function gradientColor(g: number, max = 1): string {
  const t = Math.min(1, Math.abs(g) / max);
  if (g > 0) return `rgba(214, 69, 69, ${0.25 + t * 0.65})`;
  if (g < 0) return `rgba(45, 155, 106, ${0.25 + t * 0.65})`;
  return "rgba(26, 22, 20, 0.12)";
}

export const NODE_R_CONST = NODE_R;
