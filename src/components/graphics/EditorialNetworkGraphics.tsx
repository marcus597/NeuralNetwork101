/** Editorial neural-network illustrations — thin ink lines, nodes, museum-grade. */

type GraphicProps = {
  className?: string;
};

/** Wide deep network banner — fills top-center hero void. */
export function DeepNetworkBanner({ className = "" }: GraphicProps) {
  const layers = [
    { x: 48, nodes: [36, 56, 76, 96] },
    { x: 148, nodes: [44, 64, 84] },
    { x: 248, nodes: [48, 68] },
    { x: 348, nodes: [58] },
  ];

  return (
    <svg viewBox="0 0 400 120" className={className} aria-hidden fill="none">
      <rect width="400" height="120" fill="#e8e3d8" fillOpacity="0.55" />
      <g stroke="#111" strokeWidth="0.65" opacity="0.4">
        {layers.slice(0, -1).flatMap((layer, li) =>
          layer.nodes.flatMap((y1, ni) =>
            layers[li + 1].nodes.map((y2, nj) => (
              <line
                key={`${li}-${ni}-${nj}`}
                x1={layer.x + 6}
                y1={y1}
                x2={layers[li + 1].x - 6}
                y2={y2}
              />
            )),
          ),
        )}
      </g>
      {layers.map((layer, li) => (
        <g key={li}>
          {layer.nodes.map((y, ni) => (
            <circle
              key={ni}
              cx={layer.x}
              cy={y}
              r={li === 0 ? 4 : li === layers.length - 1 ? 6 : 5}
              fill="#111"
            />
          ))}
        </g>
      ))}
      <text x="28" y="112" fill="#6a6a6a" fontSize="7" fontFamily="system-ui, sans-serif" letterSpacing="1.2">
        INPUT
      </text>
      <text x="128" y="112" fill="#6a6a6a" fontSize="7" fontFamily="system-ui, sans-serif" letterSpacing="1.2">
        HIDDEN
      </text>
      <text x="228" y="112" fill="#6a6a6a" fontSize="7" fontFamily="system-ui, sans-serif" letterSpacing="1.2">
        HIDDEN
      </text>
      <text x="328" y="112" fill="#6a6a6a" fontSize="7" fontFamily="system-ui, sans-serif" letterSpacing="1.2">
        OUTPUT
      </text>
      <path
        d="M368 58 L388 58"
        stroke="#111"
        strokeWidth="0.8"
        opacity="0.5"
        markerEnd="url(#arrow)"
      />
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="#111" opacity="0.5" />
        </marker>
      </defs>
    </svg>
  );
}

/** Three-layer feedforward stack — input → hidden → output. */
export function MiniLayerStack({ className = "" }: GraphicProps) {
  return (
    <svg
      viewBox="0 0 200 240"
      className={className}
      aria-hidden
      fill="none"
    >
      <rect width="200" height="240" fill="#e8e3d8" fillOpacity="0.5" />
      <g stroke="#111" strokeWidth="0.75" opacity="0.5">
        {[
          [40, 50],
          [40, 80],
          [40, 110],
        ].map(([x, y], i) => (
          <g key={`in-${i}`}>
            <circle cx={x} cy={y} r="4" fill="#111" />
            {[120, 125, 130].map((hy, j) => (
              <line key={j} x1={x + 4} y1={y} x2={120} y2={hy} />
            ))}
          </g>
        ))}
        {[120, 125, 130].map((y, i) => (
          <circle key={`h-${i}`} cx={120} cy={y} r="5" fill="#111" />
        ))}
        {[120, 125, 130].map((y, i) => (
          <line key={`ho-${i}`} x1={125} y1={y} x2={168} y2={125} />
        ))}
        <circle cx={172} cy={125} r="7" fill="#111" />
      </g>
      <text
        x="12"
        y="228"
        fill="#6a6a6a"
        fontSize="7"
        fontFamily="system-ui, sans-serif"
        letterSpacing="1.5"
      >
        INPUT → HIDDEN → OUTPUT
      </text>
    </svg>
  );
}

/** Horizontal forward-pass signal strip. */
export function ForwardPassStrip({ className = "" }: GraphicProps) {
  return (
    <svg viewBox="0 0 320 72" className={className} aria-hidden fill="none">
      <g stroke="#111" strokeWidth="0.8" opacity="0.55">
        <circle cx="24" cy="36" r="6" fill="#111" />
        <line x1="30" y1="36" x2="80" y2="36" strokeDasharray="3 2" />
        <rect x="80" y="22" width="48" height="28" strokeWidth="1" />
        <text x="88" y="40" fill="#111" fontSize="8" fontFamily="system-ui, sans-serif">
          σ(x)
        </text>
        <line x1="128" y1="36" x2="178" y2="36" />
        <circle cx="184" cy="36" r="8" fill="#111" />
        <line x1="192" y1="36" x2="242" y2="36" strokeDasharray="3 2" />
        <rect x="242" y="22" width="48" height="28" strokeWidth="1" />
        <text x="252" y="40" fill="#111" fontSize="8" fontFamily="system-ui, sans-serif">
          ŷ
        </text>
        <polygon points="292,36 284,32 284,40" fill="#111" stroke="none" />
        <circle cx="304" cy="36" r="5" fill="#111" />
      </g>
      <text
        x="0"
        y="68"
        fill="#9a9a9a"
        fontSize="7"
        fontFamily="system-ui, sans-serif"
        letterSpacing="1.2"
      >
        FORWARD PASS
      </text>
    </svg>
  );
}

/** Weight matrix grid — synaptic connections as dot field. */
export function WeightMatrixGrid({ className = "" }: GraphicProps) {
  const cols = 8;
  const rows = 6;
  const spacing = 14;
  const startX = 20;
  const startY = 16;

  return (
    <svg viewBox="0 0 140 110" className={className} aria-hidden>
      <rect width="140" height="110" fill="#e8e3d8" fillOpacity="0.45" />
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const opacity = 0.15 + ((r * cols + c) % 5) * 0.12;
          return (
            <circle
              key={`${r}-${c}`}
              cx={startX + c * spacing}
              cy={startY + r * spacing}
              r={2.2}
              fill="#111"
              opacity={opacity}
            />
          );
        }),
      )}
      <text
        x="12"
        y="102"
        fill="#6a6a6a"
        fontSize="7"
        fontFamily="system-ui, sans-serif"
        letterSpacing="1.2"
      >
        WEIGHTS
      </text>
    </svg>
  );
}

/** Attention fan — query attends to key tokens. */
export function AttentionFan({ className = "" }: GraphicProps) {
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden fill="none">
      <rect width="200" height="160" fill="#e8e3d8" fillOpacity="0.4" />
      <circle cx="100" cy="48" r="10" fill="#111" />
      <g stroke="#111" strokeWidth="0.7" opacity="0.45">
        {[24, 52, 80, 120, 148, 176].map((x, i) => (
          <g key={i}>
            <line x1="100" y1="58" x2={x} y2="120" />
            <circle cx={x} cy={120} r="4" fill="#111" />
          </g>
        ))}
      </g>
      <text
        x="12"
        y="150"
        fill="#6a6a6a"
        fontSize="7"
        fontFamily="system-ui, sans-serif"
        letterSpacing="1.2"
      >
        ATTENTION
      </text>
    </svg>
  );
}

/** Loss landscape contour — training curve abstract. */
export function LossContour({ className = "" }: GraphicProps) {
  return (
    <svg viewBox="0 0 180 120" className={className} aria-hidden fill="none">
      <rect width="180" height="120" fill="#e8e3d8" fillOpacity="0.35" />
      <g stroke="#111" strokeWidth="0.6" opacity="0.35">
        <ellipse cx="90" cy="60" rx="70" ry="40" />
        <ellipse cx="90" cy="60" rx="48" ry="28" />
        <ellipse cx="90" cy="60" rx="26" ry="16" />
      </g>
      <circle cx="90" cy="60" r="4" fill="#111" />
      <path
        d="M30 90 Q60 75 90 60 T150 30"
        stroke="#111"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
        strokeDasharray="4 3"
      />
      <circle cx="150" cy="30" r="3" fill="#111" />
      <text
        x="12"
        y="112"
        fill="#6a6a6a"
        fontSize="7"
        fontFamily="system-ui, sans-serif"
        letterSpacing="1.2"
      >
        GRADIENT DESCENT
      </text>
    </svg>
  );
}

/** Wide bottom band — full curriculum path neuron to transformer. */
export function CurriculumPathBand({ className = "" }: GraphicProps) {
  const stages = [
    { x: 40, label: "NEURON" },
    { x: 140, label: "LAYER" },
    { x: 260, label: "TRAIN" },
    { x: 380, label: "CONV" },
    { x: 500, label: "ATTN" },
    { x: 620, label: "TRANSFORM" },
  ];

  return (
    <svg viewBox="0 0 680 80" className={className} aria-hidden fill="none">
      <line x1="40" y1="32" x2="640" y2="32" stroke="#111" strokeWidth="0.75" opacity="0.25" />
      {stages.map((s, i) => (
        <g key={s.label}>
          <circle cx={s.x} cy={32} r={i === 0 || i === stages.length - 1 ? 6 : 4.5} fill="#111" />
          {i < stages.length - 1 && (
            <line
              x1={s.x + 8}
              y1={32}
              x2={stages[i + 1].x - 8}
              y2={32}
              stroke="#111"
              strokeWidth="0.6"
              opacity="0.4"
            />
          )}
          <text
            x={s.x}
            y="58"
            fill="#6a6a6a"
            fontSize="7"
            fontFamily="system-ui, sans-serif"
            letterSpacing="1"
            textAnchor="middle"
          >
            {s.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/** Ambient floating nodes for background decoration. */
export function FloatingNetworkNodes({ className = "" }: GraphicProps) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      aria-hidden
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <g stroke="#111" strokeWidth="0.6" opacity="0.18">
        <circle cx="60" cy="80" r="3" fill="#111" />
        <circle cx="120" cy="140" r="4" fill="#111" />
        <circle cx="200" cy="90" r="2.5" fill="#111" />
        <circle cx="280" cy="160" r="3.5" fill="#111" />
        <circle cx="340" cy="100" r="3" fill="#111" />
        <circle cx="80" cy="220" r="2.5" fill="#111" />
        <circle cx="180" cy="250" r="4" fill="#111" />
        <circle cx="320" cy="230" r="3" fill="#111" />
        <line x1="60" y1="80" x2="120" y2="140" />
        <line x1="120" y1="140" x2="200" y2="90" />
        <line x1="200" y1="90" x2="280" y2="160" />
        <line x1="280" y1="160" x2="340" y2="100" />
        <line x1="120" y1="140" x2="80" y2="220" />
        <line x1="80" y1="220" x2="180" y2="250" />
        <line x1="180" y1="250" x2="320" y2="230" />
        <line x1="280" y1="160" x2="320" y2="230" />
      </g>
    </svg>
  );
}

/** Pizza classifier mini diagram — exhibit teaser. */
export function PizzaClassifierMini({ className = "" }: GraphicProps) {
  return (
    <svg viewBox="0 0 160 100" className={className} aria-hidden fill="none">
      <rect x="8" y="20" width="36" height="36" stroke="#111" strokeWidth="0.8" opacity="0.5" />
      <text x="16" y="44" fontSize="18" aria-hidden>
        🍕
      </text>
      <line x1="44" y1="38" x2="72" y2="38" stroke="#111" strokeWidth="0.7" opacity="0.45" />
      <circle cx="88" cy="38" r="8" stroke="#111" strokeWidth="0.8" />
      <circle cx="88" cy="38" r="3" fill="#111" />
      <line x1="96" y1="38" x2="120" y2="38" stroke="#111" strokeWidth="0.7" opacity="0.45" />
      <rect x="120" y="28" width="32" height="20" stroke="#111" strokeWidth="0.8" />
      <text x="126" y="42" fill="#111" fontSize="8" fontFamily="system-ui, sans-serif">
        YES
      </text>
      <text
        x="8"
        y="92"
        fill="#6a6a6a"
        fontSize="7"
        fontFamily="system-ui, sans-serif"
        letterSpacing="1"
      >
        PIZZA BRAIN
      </text>
    </svg>
  );
}
