"use client";

import { useEffect, useRef, useState } from "react";

export function useSimulationLoop(
  draw: () => void,
  active = true,
): void {
  const drawRef = useRef(draw);

  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  useEffect(() => {
    if (!active) return;
    let id = 0;
    const loop = () => {
      drawRef.current();
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [active]);
}

export function useThrottledMetric<T>(value: T, hz = 30): T {
  const [display, setDisplay] = useState(value);
  const last = useRef(0);

  useEffect(() => {
    const now = performance.now();
    if (now - last.current >= 1000 / hz) {
      last.current = now;
      setDisplay(value);
    }
  }, [value, hz]);

  return display;
}

export function useResizeCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onResize: () => void,
): void {
  const onResizeRef = useRef(onResize);

  useEffect(() => {
    onResizeRef.current = onResize;
  }, [onResize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => onResizeRef.current());
    ro.observe(canvas);
    onResizeRef.current();
    return () => ro.disconnect();
  }, [canvasRef]);
}
