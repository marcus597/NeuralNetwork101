/** Left-rail visual: editorial abstract network / architecture field. */
export function EditorialRail() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-bg-rail-soft/40 via-transparent to-black/50" />

      <svg
        className="absolute inset-0 h-full w-full opacity-[0.35]"
        viewBox="0 0 400 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="rail-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0H0V28" fill="none" stroke="white" strokeWidth="0.4" opacity="0.25" />
          </pattern>
        </defs>
        <rect width="400" height="900" fill="url(#rail-grid)" />

        {/* Architectural / network silhouette */}
        <g stroke="white" strokeWidth="1.2" fill="none" opacity="0.55">
          <path d="M60 180 L140 120 L220 180 L220 320 L60 320 Z" />
          <path d="M160 220 L280 160 L340 220 L340 380 L160 380 Z" />
          <line x1="100" y1="320" x2="100" y2="520" />
          <line x1="200" y1="320" x2="200" y2="560" />
          <line x1="280" y1="380" x2="280" y2="640" />
          <circle cx="100" cy="540" r="10" />
          <circle cx="200" cy="580" r="14" />
          <circle cx="280" cy="660" r="12" />
          <path d="M100 540 L200 580 L280 660" />
          <path d="M80 700 H320" />
          <path d="M120 740 H280" />
        </g>

        <g fill="white" opacity="0.2">
          <circle cx="320" cy="240" r="3" />
          <circle cx="90" cy="420" r="2.5" />
          <circle cx="250" cy="500" r="2" />
        </g>
      </svg>

      <div className="absolute -right-8 top-1/3 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
    </div>
  );
}
