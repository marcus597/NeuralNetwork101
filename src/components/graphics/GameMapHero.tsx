"use client";

import { motion } from "motion/react";

/** Game map header — winding path through three zones. */
export function GameMapHero() {
  return (
    <div className="relative mx-auto w-full max-w-xs" aria-hidden>
      <motion.svg
        viewBox="0 0 280 120"
        className="w-full drop-shadow-[3px_3px_0_#1a1a1a]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Winding path */}
        <path
          d="M30 90 C60 90, 70 40, 100 40 C130 40, 140 80, 170 80 C200 80, 210 30, 250 30"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="8 6"
        />

        {/* Zone nodes */}
        {[
          { cx: 30, cy: 90, fill: "#dfe6ff", emoji: "🧠" },
          { cx: 100, cy: 40, fill: "#ffe0ed", emoji: "👁️" },
          { cx: 170, cy: 80, fill: "#dffff8", emoji: "💬" },
          { cx: 250, cy: 30, fill: "#fff3c4", emoji: "⭐" },
        ].map(({ cx, cy, fill }, i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="18" fill={fill} stroke="#1a1a1a" strokeWidth="3" />
            <text x={cx} y={cy + 5} textAnchor="middle" fontSize="14">
              {["🧠", "👁️", "💬", "⭐"][i]}
            </text>
          </g>
        ))}

        {/* YOU ARE HERE marker */}
        <g transform="translate(8, 58)">
          <polygon
            points="0,0 28,0 14,12"
            fill="#ff4757"
            stroke="#1a1a1a"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <text x="14" y="8" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="800" fontFamily="Impact">
            START
          </text>
        </g>
      </motion.svg>
    </div>
  );
}
