"use client";

type DeepNetworkDiagramProps = {
  className?: string;
};

const INPUT_NODES = 5;
const HIDDEN_LAYERS = 3;
const HIDDEN_NODES = 5;
const OUTPUT_NODES = 3;

const COLORS = {
  input: "#2563eb",
  hidden: "#14b8a6",
  output: "#60a5fa",
  line: "#93c5fd",
} as const;

function nodeY(index: number, total: number, top: number, height: number) {
  if (total <= 1) return top + height / 2;
  return top + (index / (total - 1)) * height;
}

export function DeepNetworkDiagram({ className }: DeepNetworkDiagramProps) {
  const top = 52;
  const height = 148;
  const layers = [
    { count: INPUT_NODES, x: 44, color: COLORS.input, label: "Input layer" },
    ...Array.from({ length: HIDDEN_LAYERS }, (_, i) => ({
      count: HIDDEN_NODES,
      x: 118 + i * 74,
      color: COLORS.hidden,
      label: i === 1 ? "Multiple hidden layer" : "",
    })),
    { count: OUTPUT_NODES, x: 356, color: COLORS.output, label: "Output layer" },
  ];

  return (
    <svg
      viewBox="0 0 400 230"
      className={className}
      role="img"
      aria-label="Diagram of a deep neural network with input layer, hidden layers, and output layer"
    >
      <defs>
        <marker
          id="deep-net-arrow"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill={COLORS.line} />
        </marker>
      </defs>

      <text x="16" y="24" className="fill-ink text-[15px] font-semibold">
        Deep neural network
      </text>

      {layers.map((layer, li) => {
        if (!layer.label) return null;
        const anchor = li === 0 ? "start" : li === layers.length - 1 ? "end" : "middle";
        const x =
          li === 0
            ? layer.x - 14
            : li === layers.length - 1
              ? layer.x + 14
              : layer.x;
        return (
          <text
            key={`label-${li}`}
            x={x}
            y={38}
            textAnchor={anchor}
            className="fill-ink-muted text-[10px] font-medium"
          >
            {layer.label}
          </text>
        );
      })}

      {layers.slice(0, -1).flatMap((layer, li) => {
        const next = layers[li + 1]!;
        return Array.from({ length: layer.count }, (_, fi) =>
          Array.from({ length: next.count }, (_, ti) => {
            const y1 = nodeY(fi, layer.count, top, height);
            const y2 = nodeY(ti, next.count, top, height);
            return (
              <line
                key={`${li}-${fi}-${ti}`}
                x1={layer.x + 10}
                y1={y1}
                x2={next.x - 10}
                y2={y2}
                stroke={COLORS.line}
                strokeWidth={0.8}
                strokeOpacity={0.45}
                markerEnd="url(#deep-net-arrow)"
              />
            );
          }),
        );
      })}

      {layers.map((layer, li) =>
        Array.from({ length: layer.count }, (_, i) => {
          const y = nodeY(i, layer.count, top, height);
          return (
            <circle
              key={`node-${li}-${i}`}
              cx={layer.x}
              cy={y}
              r={9}
              fill={layer.color}
            />
          );
        }),
      )}
    </svg>
  );
}
