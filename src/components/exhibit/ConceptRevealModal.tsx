"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);
  /** Prevent the opening click from instantly closing the backdrop. */
  const [backdropArmed, setBackdropArmed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setBackdropArmed(false);
      return;
    }
    closeRef.current?.focus();
    const arm = window.setTimeout(() => setBackdropArmed(true), 180);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(arm);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && content && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
          <motion.button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (backdropArmed) onClose();
            }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="concept-reveal-modal relative z-10 max-h-[min(90vh,720px)] w-full max-w-lg overflow-y-auto overflow-x-hidden rounded-lg border-[3px] border-border-subtle bg-bg-surface shadow-float"
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
              <div className="border-b-[3px] border-border-subtle bg-bg-stage px-4 pb-3 pt-5 sm:px-6">
                <ConceptDiagram id={content.diagram} />
                {content.formula && (
                  <p className="mt-2 rounded-md border border-ink/10 bg-bg-surface/80 px-3 py-2 text-center font-mono text-[12px] font-semibold tracking-tight text-ink sm:text-[13px]">
                    {content.formula}
                  </p>
                )}
              </div>
            )}

            {!content.diagram && content.formula && (
              <div className="border-b-[3px] border-border-subtle bg-bg-stage px-4 py-4 sm:px-6">
                <p className="rounded-md border border-ink/10 bg-bg-surface/80 px-3 py-2 text-center font-mono text-[12px] font-semibold tracking-tight text-ink sm:text-[13px]">
                  {content.formula}
                </p>
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

              {content.terms && content.terms.length > 0 && (
                <div className="space-y-2 border-t border-ink/10 pt-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
                    Neural vocabulary
                  </p>
                  <ul className="space-y-2">
                    {content.terms.map((item) => (
                      <li
                        key={item.term}
                        className="rounded-md border border-ink/10 bg-bg-muted/60 px-3 py-2"
                      >
                        <span className="font-mono text-[12px] font-bold text-ink">
                          {item.term}
                        </span>
                        <span className="mt-0.5 block text-[12px] leading-snug text-ink-muted">
                          {item.definition}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

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
    </AnimatePresence>,
    document.body,
  );
}
