"use client";

import { ConceptRevealModal } from "@/components/exhibit/ConceptRevealModal";
import { PIZZA_CONCEPT_REVEAL } from "@/lib/content/game-concept-reveals";

type DeepNetworkRevealProps = {
  open: boolean;
  onClose: () => void;
};

export function DeepNetworkReveal({ open, onClose }: DeepNetworkRevealProps) {
  return (
    <ConceptRevealModal
      open={open}
      content={open ? PIZZA_CONCEPT_REVEAL : null}
      onClose={onClose}
    />
  );
}
