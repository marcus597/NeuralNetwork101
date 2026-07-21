"use client";

import { useCallback, useRef, useState } from "react";
import { ConceptRevealModal } from "@/components/exhibit/ConceptRevealModal";
import {
  getGameConceptReveal,
  type ConceptRevealContent,
} from "@/lib/content/game-concept-reveals";
import type { PresetId } from "@/engines/presets/registry";

export function useGameConceptReveal(presetId: PresetId) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<ConceptRevealContent | null>(null);
  const afterClose = useRef<(() => void) | null>(null);

  const revealAfterCorrect = useCallback(
    (stepId: string, then?: () => void) => {
      const reveal = getGameConceptReveal(presetId, stepId);
      if (!reveal) {
        then?.();
        return;
      }
      afterClose.current = then ?? null;
      setContent(reveal);
      setOpen(true);
    },
    [presetId],
  );

  const dismiss = useCallback(() => {
    setOpen(false);
    setContent(null);
    const next = afterClose.current;
    afterClose.current = null;
    next?.();
  }, []);

  const modal = (
    <ConceptRevealModal open={open} content={content} onClose={dismiss} />
  );

  return { revealAfterCorrect, modal };
}
