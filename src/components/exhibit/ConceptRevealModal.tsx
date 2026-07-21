"use client";

import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { ConceptDiagram } from "@/components/exhibit/ConceptDiagram";
import type { ConceptRevealContent } from "@/lib/content/game-concept-reveals";
import { springSoft } from "@/lib/motion/tokens";

type ConceptRevealModalProps = {
  open: boolean;
  content: ConceptRevealContent | null;
  onClose: () => void;
};

export function ConceptRevealModal({ open, content, onClose }: ConceptRevealModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && content && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-ink/20 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="concept-reveal-modal relative z-10 w-full max-w-lg overflow-hidden rounded-lg border-[3px] border-border-subtle bg-bg-surface shadow-float"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={springSoft}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="focus-ring absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-md border-2 border-border-subtle bg-bg-muted text-ink-muted shadow-sm"
              aria-label="Close explanation"
            >
              <X className="h-4 w-4" />
            </button>

            {content.diagram && (
              <div className="border-b-[3px] border-border-subtle bg-bg-stage px-4 pb-2 pt-5 sm:px-6">
                <ConceptDiagram id={content.diagram} />
              </div>
            )}

            <div className="space-y-3 px-5 py-5 sm:px-6">
              <p className="text-2xl" aria-hidden>
                {content.emoji}
              </p>
              <h2 id={titleId} className="font-display text-xl uppercase text-ink">
                {content.title}
              </h2>
              {content.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-sm font-bold leading-relaxed text-ink-muted">
                  {paragraph}
                </p>
              ))}

              <button
                type="button"
                onClick={onClose}
                className="comic-btn focus-ring mt-2 min-h-12 w-full bg-discover px-6 text-sm text-on-accent"
              >
                {content.buttonLabel ?? "Got it — keep playing!"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
