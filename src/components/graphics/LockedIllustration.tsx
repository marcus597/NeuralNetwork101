"use client";

import { motion } from "motion/react";

/** Locked game screen illustration. */
export function LockedIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-xs" aria-hidden>
      <motion.svg
        viewBox="0 0 200 180"
        className="w-full drop-shadow-[4px_4px_0_#1a1a1a]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Chain */}
        <ellipse cx="100" cy="30" rx="28" ry="10" fill="none" stroke="#1a1a1a" strokeWidth="3" />
        <ellipse cx="100" cy="48" rx="28" ry="10" fill="none" stroke="#1a1a1a" strokeWidth="3" />

        {/* Padlock body */}
        <rect x="60" y="58" width="80" height="70" rx="8" fill="#ffe566" stroke="#1a1a1a" strokeWidth="4" />
        <rect x="78" y="48" width="44" height="36" rx="6" fill="none" stroke="#1a1a1a" strokeWidth="4" />

        {/* Keyhole */}
        <circle cx="100" cy="88" r="8" fill="#1a1a1a" />
        <rect x="96" y="88" width="8" height="16" rx="2" fill="#1a1a1a" />

        {/* Comic burst */}
        <polygon
          points="160,100 170,88 182,92 174,104 180,116 166,110 156,118 158,104"
          fill="#ff4757"
          stroke="#1a1a1a"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <text x="169" y="106" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="800" fontFamily="Impact">
          NOPE
        </text>
      </motion.svg>
    </div>
  );
}
