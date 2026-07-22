"use client";

import { useCallback, useRef, useState } from "react";
import { ConceptRevealModal } from "@/components/exhibit/ConceptRevealModal";
import {
  getGameConceptRevealOrFallback,
  type ConceptRevealContent,
} from "@/lib/content/game-concept-reveals";
import type { PresetId } from "@/engines/presets/registry";

/**
 * After each correct answer, show a teach popup (diagram + formula + vocab)
 * before continuing. Progress callbacks run only after the student dismisses.
 */
export function useGameConceptReveal(presetId: PresetId) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<ConceptRevealContent | null>(null);
  const afterClose = useRef<(() => void) | null>(null);

  const revealAfterCorrect = useCallback(
    (stepId: string, then?: () => void) => {
      const reveal = getGameConceptRevealOrFallback(presetId, stepId);
      afterClose.current = then ?? null;
      setContent(reveal);
      // Defer open so the check-button click cannot land on the new backdrop.
      window.setTimeout(() => setOpen(true), 0);
    },
    [presetId],
  );

  const dismiss = useCallback(() => {
    setOpen(false);
    const next = afterClose.current;
    afterClose.current = null;
    next?.();
  }, []);

  const modal = (
    <ConceptRevealModal open={open} content={content} onClose={dismiss} />
  );

  return { revealAfterCorrect, modal };
}
