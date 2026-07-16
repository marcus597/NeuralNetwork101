"use client";

import { useEffect } from "react";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { useUiStore } from "@/stores/ui-store";

export function Providers({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const setReducedMotion = useUiStore((s) => s.setReducedMotion);

  useEffect(() => {
    setReducedMotion(reduced);
  }, [reduced, setReducedMotion]);

  return children;
}
