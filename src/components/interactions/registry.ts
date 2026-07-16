import { PRESET_REGISTRY, type PresetId } from "@/engines/presets/registry";

export const INTERACTION_REGISTRY = PRESET_REGISTRY;

export function getPlaygroundTabs(): { id: PresetId; label: string }[] {
  return [
    { id: "logistic-boundary", label: "Split" },
    { id: "neural-network", label: "Fire" },
    { id: "regression-training", label: "Chase" },
    { id: "overfit-dial", label: "Wiggle" },
  ];
}
