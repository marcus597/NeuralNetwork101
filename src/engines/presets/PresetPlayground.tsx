"use client";

import {
  createContext,
  useCallback,
  useContext,
  forwardRef,
} from "react";
import type { InteractionHandle, SimSnapshot } from "@/engines/interaction/types";
import { PRESET_REGISTRY, type PresetId } from "./registry";

type PresetContextValue = {
  onSnapshot: (s: SimSnapshot) => void;
  mode: "lesson" | "experiment" | "quiz";
  readOnly: boolean;
};

const PresetContext = createContext<PresetContextValue>({
  onSnapshot: () => {},
  mode: "lesson",
  readOnly: false,
});

export function usePresetContext() {
  return useContext(PresetContext);
}

export type PresetPlaygroundProps = {
  presetId: PresetId;
  config?: Record<string, unknown>;
  mode?: "lesson" | "experiment" | "quiz";
  readOnly?: boolean;
  onSnapshot?: (s: SimSnapshot) => void;
  className?: string;
};

export const PresetPlayground = forwardRef<InteractionHandle, PresetPlaygroundProps>(
  function PresetPlayground(
    { presetId, config = {}, mode = "lesson", readOnly = false, onSnapshot },
    ref,
  ) {
    const entry = PRESET_REGISTRY[presetId];
    const Component = entry?.component;

    const handleSnapshot = useCallback(
      (s: SimSnapshot) => onSnapshot?.(s),
      [onSnapshot],
    );

    if (!Component) {
      return (
        <div className="panel p-8 text-center text-ink-muted">
          Preset &quot;{presetId}&quot; not found.
        </div>
      );
    }

    return (
      <PresetContext.Provider
        value={{ onSnapshot: handleSnapshot, mode, readOnly }}
      >
        <Component ref={ref} config={config} />
      </PresetContext.Provider>
    );
  },
);

export type PresetComponentProps = {
  config: Record<string, unknown>;
};

export type PresetComponent = React.ForwardRefExoticComponent<
  PresetComponentProps & React.RefAttributes<InteractionHandle>
>;
