"use client";

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  forwardRef,
} from "react";
import { Canvas2D } from "@/engines/visualization/Canvas2D";
import { useSimulationLoop } from "@/engines/simulation/useSimulationLoop";
import type {
  InteractionHandle,
  PointerEventNorm,
  SimSnapshot,
} from "@/engines/interaction/types";

export type SimulationHostProps<TState> = {
  state: TState;
  onStateChange?: (state: TState) => void;
  draw: (canvas: Canvas2D, state: TState) => void;
  onPointer?: (
    state: TState,
    event: PointerEventNorm,
    phase: "down" | "move" | "up",
  ) => TState | void;
  getSnapshot?: (state: TState) => SimSnapshot;
  className?: string;
  ariaLabel?: string;
  continuous?: boolean;
};

const EMPTY_SNAPSHOT: SimSnapshot = {
  presetId: "unknown",
  params: {},
  metrics: {},
  flags: {},
};

function SimulationHostInner<TState>(
  {
    state,
    onStateChange,
    draw,
    onPointer,
    getSnapshot,
    className = "h-64 w-full touch-none sm:h-80",
    ariaLabel = "Interactive simulation canvas",
    continuous = false,
  }: SimulationHostProps<TState>,
  ref: React.Ref<InteractionHandle>,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas2dRef = useRef<Canvas2D | null>(null);
  const stateRef = useRef(state);
  const dragging = useRef(false);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const render = useCallback(() => {
    const el = canvasRef.current;
    if (!el) return;
    if (!canvas2dRef.current) canvas2dRef.current = new Canvas2D(el);
    canvas2dRef.current.resize();
    draw(canvas2dRef.current, stateRef.current);
  }, [draw]);

  useSimulationLoop(render, continuous);

  useEffect(() => {
    render();
  }, [render, state]);

  useEffect(() => {
    const ro = new ResizeObserver(() => render());
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, [render]);

  useImperativeHandle(ref, () => ({
    reset: () => render(),
    getSnapshot: () =>
      getSnapshot ? getSnapshot(stateRef.current) : EMPTY_SNAPSHOT,
    getState: () => stateRef.current,
  }));

  const applyPointer = (e: React.PointerEvent, phase: "down" | "move" | "up") => {
    if (!onPointer || !canvas2dRef.current) return;
    const norm = canvas2dRef.current.pointerToNorm(e.clientX, e.clientY);
    const event: PointerEventNorm = { x: norm.x, y: norm.y, type: phase };
    const next = onPointer(stateRef.current, event, phase);
    if (next !== undefined) {
      onStateChange?.(next);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className={`cursor-grab active:cursor-grabbing ${className}`}
      aria-label={ariaLabel}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
        applyPointer(e, "down");
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        applyPointer(e, "move");
      }}
      onPointerUp={(e) => {
        dragging.current = false;
        applyPointer(e, "up");
      }}
    />
  );
}

export const SimulationHost = forwardRef(SimulationHostInner) as <TState>(
  props: SimulationHostProps<TState> & { ref?: React.Ref<InteractionHandle> },
) => React.ReactElement;
