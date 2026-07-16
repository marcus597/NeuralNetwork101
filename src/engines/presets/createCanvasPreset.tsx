"use client";

import { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Canvas2D } from "@/engines/visualization/Canvas2D";
import { useSimulationLoop, useResizeCanvas } from "@/engines/simulation/useSimulationLoop";
import type { InteractionHandle, SimSnapshot } from "@/engines/interaction/types";
import { usePresetContext } from "./PresetPlayground";
import type { PresetComponent } from "./PresetPlayground";

export type CanvasPresetOptions<TState> = {
  presetId: string;
  initialState: TState;
  draw: (canvas: Canvas2D, state: TState) => void;
  onPointer?: (
    state: TState,
    nx: number,
    ny: number,
    type: "down" | "move" | "up",
  ) => TState;
  getSnapshot: (state: TState) => SimSnapshot;
  getMetrics?: (state: TState) => Record<string, number>;
  getFlags?: (state: TState) => Record<string, boolean>;
  controls?: React.ReactNode;
  hint?: string;
};

export function createCanvasPreset<TState>(
  opts: CanvasPresetOptions<TState>,
): PresetComponent {
  const Preset = function Preset(
    _props: { config: Record<string, unknown> },
    ref: React.Ref<InteractionHandle>,
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvas2d = useRef<Canvas2D | null>(null);
    const dragging = useRef(false);
    const [state, setState] = useState<TState>(() => opts.initialState);
    const { onSnapshot, readOnly } = usePresetContext();

    const initCanvas = useCallback(() => {
      if (!canvasRef.current) return;
      canvas2d.current = new Canvas2D(canvasRef.current);
      canvas2d.current.resize();
    }, []);

    useResizeCanvas(canvasRef, initCanvas);

    const draw = useCallback(() => {
      const c = canvas2d.current;
      if (!c) return;
      c.resize();
      c.clear();
      opts.draw(c, state);
    }, [state]);

    useSimulationLoop(draw);

    useEffect(() => {
      onSnapshot(opts.getSnapshot(state));
    }, [state, onSnapshot]);

    useImperativeHandle(ref, () => ({
      reset: () => setState(opts.initialState),
      getSnapshot: () => opts.getSnapshot(state),
      getState: () => state,
    }));

    const handlePointer = (
      e: React.PointerEvent,
      type: "down" | "move" | "up",
    ) => {
      if (readOnly || !opts.onPointer || !canvas2d.current) return;
      const { x, y } = canvas2d.current.pointerToNorm(e.clientX, e.clientY);
      const yUp = 1 - y;
      if (type === "down") {
        dragging.current = true;
        canvasRef.current?.setPointerCapture(e.pointerId);
      }
      if (type === "up") {
        dragging.current = false;
      } else if (type === "move" && !dragging.current) {
        return;
      }
      const next = opts.onPointer(state, x, yUp, type);
      if (next !== undefined) setState(next);
    };

    return (
      <div className="space-y-4">
        <div className="panel glow-violet overflow-hidden">
          <canvas
            ref={canvasRef}
            className="h-56 w-full cursor-grab touch-none active:cursor-grabbing sm:h-72"
            aria-label={opts.hint ?? opts.presetId}
            onPointerDown={(e) => handlePointer(e, "down")}
            onPointerMove={(e) => handlePointer(e, "move")}
            onPointerUp={(e) => handlePointer(e, "up")}
          />
        </div>
        {opts.controls}
      </div>
    );
  };
  return Preset as PresetComponent;
}
