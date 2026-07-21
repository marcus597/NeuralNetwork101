"use client";

import { useEffect } from "react";
import type { SimSnapshot } from "@/engines/interaction/types";
import { usePresetContext } from "@/engines/presets/PresetPlayground";

export function useLabSnapshot(snapshot: SimSnapshot) {
  const { onSnapshot } = usePresetContext();
  useEffect(() => {
    onSnapshot(snapshot);
  }, [snapshot, onSnapshot]);
}
