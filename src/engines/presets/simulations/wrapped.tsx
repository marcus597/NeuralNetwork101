"use client";

import { forwardRef } from "react";
import { DecisionBoundary } from "@/components/interactions/DecisionBoundary";
import { TrainingLoop } from "@/components/interactions/TrainingLoop";
import { OverfitDial } from "@/components/interactions/OverfitDial";
import { NeuronStack } from "@/components/interactions/NeuronStack";
import type { PresetComponent } from "../PresetPlayground";
import { usePresetContext } from "../PresetPlayground";

export const ClassificationPreset = forwardRef(function ClassificationPreset(
  { config }: { config: Record<string, unknown> },
  _ref,
) {
  const { onSnapshot } = usePresetContext();
  const reveal = Boolean(config.revealHiddenDefault);
  return <DecisionBoundary revealHiddenDefault={reveal} onSnapshot={onSnapshot} />;
}) as PresetComponent;

function WrapWithSnapshot(
  Component: React.ComponentType<{ compact?: boolean; onSnapshot?: (s: import("@/engines/interaction/types").SimSnapshot) => void }>,
): PresetComponent {
  return forwardRef(function Wrapped() {
    const { onSnapshot } = usePresetContext();
    return <Component onSnapshot={onSnapshot} />;
  }) as PresetComponent;
}

export const RegressionPreset = WrapWithSnapshot(TrainingLoop);
export const OverfitPreset = WrapWithSnapshot(OverfitDial);
export const NeuronPreset = WrapWithSnapshot(NeuronStack);
