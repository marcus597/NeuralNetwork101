"use client";

import { useCallback, useEffect, useRef } from "react";
import { Canvas2D } from "@/engines/visualization/Canvas2D";
import {
  drawGrid,
  drawKnnNeighbors,
  drawModelOverlay,
  drawPoints,
  drawDecisionRegions,
} from "@/engines/visualization/draw";
import { usePlaygroundStore } from "@/stores/playground-store";
import { ALGORITHM_REGISTRY } from "@/lib/algorithms/registry";
import { distance } from "@/lib/viz/distance";
import type { LabeledPoint } from "@/engines/interaction/types";

export function PlaygroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Canvas2D | null>(null);
  const dragId = useRef<string | null>(null);
  const hoverId = useRef<string | null>(null);
  const rafRef = useRef<number>(0);

  const points = usePlaygroundStore((s) => s.points);
  const drawTool = usePlaygroundStore((s) => s.drawTool);
  const models = usePlaygroundStore((s) => s.models);
  const primaryAlgorithm = usePlaygroundStore((s) => s.primaryAlgorithm);
  const task = usePlaygroundStore((s) => s.task);
  const timelineIndex = usePlaygroundStore((s) => s.timelineIndex);
  const timelinePlaying = usePlaygroundStore((s) => s.timelinePlaying);
  const activeThinkAlgorithm = usePlaygroundStore((s) => s.activeThinkAlgorithm);
  const addPoint = usePlaygroundStore((s) => s.addPoint);
  const movePoint = usePlaygroundStore((s) => s.movePoint);
  const toggleLabel = usePlaygroundStore((s) => s.toggleLabel);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const engine = engineRef.current;
    if (!canvas || !engine) return;

    engine.resize();
    const { ctx, size } = engine;
    engine.clear();
    drawGrid(ctx, size);

    const primaryModel = models[primaryAlgorithm];
    const thinkModel =
      activeThinkAlgorithm && models[activeThinkAlgorithm]
        ? models[activeThinkAlgorithm]
        : primaryModel;

    if (thinkModel && task === "classification") {
      const algo = ALGORITHM_REGISTRY[thinkModel.algorithmId];
      drawDecisionRegions(ctx, size, (p) => algo.predictLabel(thinkModel, p));
    }

    if (thinkModel) {
      drawModelOverlay(ctx, size, thinkModel, timelineIndex, task);
    }

    let highlightIds: string[] = [];
    if (
      thinkModel?.algorithmId === "knn" &&
      thinkModel.steps[timelineIndex]?.overlay
    ) {
      const overlay = thinkModel.steps[timelineIndex].overlay as {
        queryId?: string;
        k?: number;
      };
      if (overlay.queryId) {
        const query = points.find((p) => p.id === overlay.queryId);
        if (query) {
          const train = (thinkModel.state.train as LabeledPoint[]) ?? points;
          const neighbors = [...train]
            .map((p) => ({ p, d: distance(query, p) }))
            .sort((a, b) => a.d - b.d)
            .slice(0, overlay.k ?? 3)
            .map((n) => n.p);
          highlightIds = neighbors.map((n) => n.id);
          drawKnnNeighbors(ctx, query, neighbors, size);
        }
      }
    }

    drawPoints(ctx, points, size, {
      selectedId: dragId.current ?? hoverId.current,
      highlightIds,
      showSplit: true,
    });
  }, [
    points,
    models,
    primaryAlgorithm,
    task,
    timelineIndex,
    activeThinkAlgorithm,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    engineRef.current = new Canvas2D(canvas);

    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [draw]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    if (!timelinePlaying) {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    const loop = () => {
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [timelinePlaying, draw]);

  const findHit = (x: number, y: number) => {
    const engine = engineRef.current;
    if (!engine) return null;
    const hitR = engine.hitRadiusNorm(14);
    return (
      points.find((p) => distance({ x, y }, p) < hitR)?.id ?? null
    );
  };

  return (
    <canvas
      ref={canvasRef}
      className="h-full min-h-[320px] w-full touch-none cursor-crosshair sm:min-h-[420px]"
      aria-label="Playground canvas. Draw, move, and label data points."
      onPointerDown={(e) => {
        const engine = engineRef.current;
        if (!engine) return;
        const { x, y } = engine.pointerToNorm(e.clientX, e.clientY);
        const hit = findHit(x, y);

        if (drawTool === "draw" && !hit) {
          addPoint(x, y);
          return;
        }
        if (drawTool === "label" && hit) {
          toggleLabel(hit);
          return;
        }
        if (hit) {
          dragId.current = hit;
          canvasRef.current?.setPointerCapture(e.pointerId);
        }
      }}
      onPointerMove={(e) => {
        const engine = engineRef.current;
        if (!engine) return;
        const { x, y } = engine.pointerToNorm(e.clientX, e.clientY);

        if (dragId.current) {
          movePoint(dragId.current, x, y);
        } else {
          hoverId.current = findHit(x, y);
        }
      }}
      onPointerUp={() => {
        dragId.current = null;
      }}
      onPointerLeave={() => {
        hoverId.current = null;
      }}
    />
  );
}
