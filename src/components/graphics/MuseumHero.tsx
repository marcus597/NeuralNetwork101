"use client";

import { motion } from "motion/react";

/** Homepage hero — comic museum with floating neurons. */
export function MuseumHero() {
  return (
    <div className="relative mx-auto w-full max-w-sm" aria-hidden>
      <motion.svg
        viewBox="0 0 360 240"
        className="w-full drop-shadow-[4px_4px_0_#1a1a1a]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Ground */}
        <rect x="0" y="200" width="360" height="40" fill="#ffe566" stroke="#1a1a1a" strokeWidth="3" />
        <ellipse cx="180" cy="210" rx="140" ry="8" fill="rgb(26 26 26 / 8%)" />

        {/* Museum building */}
        <rect x="70" y="80" width="220" height="120" fill="#fff" stroke="#1a1a1a" strokeWidth="4" />
        <polygon points="60,80 180,30 300,80" fill="#ff4757" stroke="#1a1a1a" strokeWidth="4" strokeLinejoin="round" />

        {/* Columns */}
        {[110, 160, 210, 260].map((x) => (
          <rect key={x} x={x} y="95" width="14" height="90" fill="#fff3c4" stroke="#1a1a1a" strokeWidth="2.5" />
        ))}

        {/* Door */}
        <rect x="155" y="140" width="50" height="60" rx="4" fill="#0984e3" stroke="#1a1a1a" strokeWidth="3" />
        <circle cx="195" cy="172" r="4" fill="#fdcb6e" stroke="#1a1a1a" strokeWidth="1.5" />

        {/* Sign */}
        <rect x="115" y="108" width="130" height="28" rx="4" fill="#ffeaa7" stroke="#1a1a1a" strokeWidth="2.5" />
        <text
          x="180"
          y="127"
          textAnchor="middle"
          fill="#1a1a1a"
          fontSize="11"
          fontWeight="700"
          fontFamily="Impact, sans-serif"
        >
          NEURAL MUSEUM
        </text>

        {/* Windows with neuron dots */}
        {[
          [95, 118],
          [245, 118],
          [95, 158],
          [245, 158],
        ].map(([x, y], i) => (
          <g key={i}>
            <rect x={x} y={y} width="36" height="28" rx="3" fill="#dfe6ff" stroke="#1a1a1a" strokeWidth="2" />
            <circle cx={x + 18} cy={y + 14} r="6" fill="#6c5ce7" stroke="#1a1a1a" strokeWidth="1.5" />
          </g>
        ))}

        {/* Flag */}
        <line x1="180" y1="30" x2="180" y2="12" stroke="#1a1a1a" strokeWidth="2.5" />
        <path d="M180 12h28l-8 8 8 8h-28z" fill="#00b894" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round" />
      </motion.svg>

      {/* Floating neurons */}
      <motion.div
        className="absolute -left-2 top-8"
        animate={{ y: [0, -6, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <FloatingNeuron color="#0984e3" size={44} />
      </motion.div>
      <motion.div
        className="absolute -right-1 top-16"
        animate={{ y: [0, 8, 0], rotate: [3, -3, 3] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <FloatingNeuron color="#6c5ce7" size={36} />
      </motion.div>
      <motion.div
        className="absolute right-6 top-2"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <ComicBurst label="ZAP!" />
      </motion.div>
    </div>
  );
}

function FloatingNeuron({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <circle cx="24" cy="24" r="18" fill={color} stroke="#1a1a1a" strokeWidth="3" />
      <circle cx="18" cy="20" r="3" fill="#fff" stroke="#1a1a1a" strokeWidth="1.5" />
      <circle cx="30" cy="20" r="3" fill="#fff" stroke="#1a1a1a" strokeWidth="1.5" />
      <path d="M18 30 Q24 36 30 30" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 24 + Math.cos(rad) * 18;
        const y1 = 24 + Math.sin(rad) * 18;
        const x2 = 24 + Math.cos(rad) * 26;
        const y2 = 24 + Math.sin(rad) * 26;
        return (
          <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
        );
      })}
    </svg>
  );
}

function ComicBurst({ label }: { label: string }) {
  return (
    <svg width="72" height="56" viewBox="0 0 72 56" aria-hidden>
      <polygon
        points="36,4 42,18 58,16 46,28 52,42 36,34 20,42 26,28 14,16 30,18"
        fill="#fdcb6e"
        stroke="#1a1a1a"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <text
        x="36"
        y="30"
        textAnchor="middle"
        fill="#1a1a1a"
        fontSize="10"
        fontWeight="800"
        fontFamily="Impact, sans-serif"
      >
        {label}
      </text>
    </svg>
  );
}
