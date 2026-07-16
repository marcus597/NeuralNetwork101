"use client";

import { useState } from "react";
import { X } from "lucide-react";

function shouldShowMobileBanner(): boolean {
  if (typeof window === "undefined") return false;
  if (localStorage.getItem("wonder-mobile-banner")) return false;
  return window.matchMedia("(max-width: 639px)").matches;
}

export function MobileBanner() {
  const [show, setShow] = useState(shouldShowMobileBanner);

  if (!show) return null;

  return (
    <div
      role="status"
      className="border-b border-white/5 bg-bg-elevated/80 px-4 py-2.5 text-center text-xs text-ink-muted backdrop-blur-sm"
    >
      <span>Wonder shines on a larger screen — lessons still work here.</span>
      <button
        type="button"
        onClick={() => {
          localStorage.setItem("wonder-mobile-banner", "1");
          setShow(false);
        }}
        className="focus-ring ml-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-ink hover:bg-white/5"
        aria-label="Dismiss"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
