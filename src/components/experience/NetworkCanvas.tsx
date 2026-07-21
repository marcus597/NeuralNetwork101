"use client";

import { motion } from "motion/react";
import {
  gradientColor,
  heatColor,
  layoutTinyNetwork,
  NODE_R_CONST,
  nodePosition,
  type GraphEdge,
  type GraphNode,
} from "@/lib/nn/graph-layout";
import type { TinyGradients, TinyNetwork } from "@/lib/nn/math";
import { cn } from "@/lib/cn";

type NetworkCanvasProps = {
  net: TinyNetwork;
  inputs: readonly number[];
  activations?: {
    hidden: number[];
    hiddenPre: number[];
    output: number;
    outputPre: number;
  };
  gradients?: TinyGradients;
  flowPhase?: number;
  mode?: "forward" | "backprop" | "weights" | "heat";
  className?: string;
  onNodeClick?: (nodeId: string) => void;
  highlightEdge?: string;
};

export function NetworkCanvas({
  net,
  inputs,
  activations,
  gradients,
  flowPhase,
  mode = "heat",
  className,
  onNodeClick,
  highlightEdge,
}: NetworkCanvasProps) {
  const graph = layoutTinyNetwork(net, inputs, activations, gradients, flowPhase);
  const maxGrad =
    gradients &&
    Math.max(
      ...graph.edges.map((e) => Math.abs(e.gradient ?? 0)),
      0.001,
    );
  const maxWeight = Math.max(...graph.edges.map((e) => Math.abs(e.weight)), 0.001);

  return (
    <svg
      viewBox={`0 0 ${graph.width} ${graph.height}`}
      className={cn("w-full touch-none select-none", className)}
      role="img"
      aria-label="Neural network graph"
    >
      <defs>
        <marker
          id="arrow"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="rgba(46,134,171,0.55)" />
        </marker>
      </defs>

      {graph.edges.map((edge) => (
        <EdgeLine
          key={edge.id}
          edge={edge}
          nodes={graph.nodes}
          mode={mode}
          maxGrad={maxGrad ?? 1}
          maxWeight={maxWeight}
          highlighted={highlightEdge === edge.id}
        />
      ))}

      {graph.nodes.map((node) => (
        <NodeCircle
          key={node.id}
          node={node}
          mode={mode}
          onClick={onNodeClick}
        />
      ))}
    </svg>
  );
}

function EdgeLine({
  edge,
  nodes,
  mode,
  maxGrad,
  maxWeight,
  highlighted,
}: {
  edge: GraphEdge;
  nodes: (GraphNode & { x?: number; y?: number })[];
  mode: NetworkCanvasProps["mode"];
  maxGrad: number;
  maxWeight: number;
  highlighted: boolean;
}) {
  const from = nodes.find((n) => n.id === edge.from);
  const to = nodes.find((n) => n.id === edge.to);
  if (!from || !to) return null;

  const p1 = nodePosition(from);
  const p2 = nodePosition(to);
  const thickness =
    mode === "weights"
      ? 1 + (Math.abs(edge.weight) / maxWeight) * 5
      : mode === "backprop" && edge.gradient !== undefined
        ? 1 + (Math.abs(edge.gradient) / maxGrad) * 6
        : 2;

  const stroke =
    mode === "backprop" && edge.gradient !== undefined
      ? gradientColor(edge.gradient, maxGrad)
      : mode === "weights"
        ? heatColor(edge.weight, maxWeight)
        : highlighted
          ? "rgba(31,168,150,0.85)"
          : "rgba(123,94,167,0.35)";

  const midX = (p1.x + p2.x) / 2;
  const midY = (p1.y + p2.y) / 2;

  return (
    <g>
      <line
        x1={p1.x + NODE_R_CONST}
        y1={p1.y}
        x2={p2.x - NODE_R_CONST}
        y2={p2.y}
        stroke={stroke}
        strokeWidth={thickness}
        strokeLinecap="round"
      />
      {edge.flow ? (
        <motion.circle
          r={5}
          fill="#1fa896"
          initial={{ cx: p1.x + NODE_R_CONST, cy: p1.y, opacity: 0 }}
          animate={{
            cx: [p1.x + NODE_R_CONST, p2.x - NODE_R_CONST],
            cy: [p1.y, p2.y],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: mode === "backprop" ? 0.8 : 0.6,
            repeat: Infinity,
            repeatDelay: 0.3,
            ease: "easeInOut",
          }}
        />
      ) : null}
      <text
        x={midX}
        y={midY - 6}
        textAnchor="middle"
        className="fill-ink-subtle text-[9px] font-mono"
      >
        {edge.weight.toFixed(2)}
      </text>
    </g>
  );
}

function NodeCircle({
  node,
  mode,
  onClick,
}: {
  node: GraphNode & { x?: number; y?: number };
  mode: NetworkCanvasProps["mode"];
  onClick?: (id: string) => void;
}) {
  const { x, y } = nodePosition(node);
  const heat = mode === "heat" ? Math.abs(node.value) : 0;
  const fill =
    mode === "heat"
      ? heatColor(node.value, 1)
      : node.frozen
        ? "rgba(156,149,144,0.35)"
        : "rgba(123,94,167,0.12)";
  const border = node.frozen ? "rgba(156,149,144,0.5)" : "rgba(123,94,167,0.45)";

  return (
    <g
      className={onClick ? "cursor-pointer" : undefined}
      onClick={() => onClick?.(node.id)}
    >
      <motion.circle
        cx={x}
        cy={y}
        r={NODE_R_CONST}
        fill={fill}
        stroke={border}
        strokeWidth={2}
        animate={
          heat > 0.5
            ? { scale: [1, 1.06, 1], filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"] }
            : { scale: 1 }
        }
        transition={{ duration: 0.8, repeat: heat > 0.5 ? Infinity : 0, repeatDelay: 0.5 }}
        style={{ transformOrigin: `${x}px ${y}px` }}
      />
      <text x={x} y={y - 4} textAnchor="middle" className="fill-ink-subtle text-[9px]">
        {node.label}
      </text>
      <text x={x} y={y + 8} textAnchor="middle" className="fill-ink text-[10px] font-mono font-semibold">
        {node.value.toFixed(2)}
      </text>
      {node.frozen && (
        <text x={x} y={y + NODE_R_CONST + 12} textAnchor="middle" className="fill-ink-faint text-[8px]">
          frozen
        </text>
      )}
    </g>
  );
}
