"use client";

import { useEffect } from "react";
import { usePlaygroundStore } from "@/stores/playground-store";
import { Button } from "@/components/ui/Button";

export function TimelineControls() {
  const activeThinkAlgorithm = usePlaygroundStore((s) => s.activeThinkAlgorithm);
  const models = usePlaygroundStore((s) => s.models);
  const timelineIndex = usePlaygroundStore((s) => s.timelineIndex);
  const timelinePlaying = usePlaygroundStore((s) => s.timelinePlaying);
  const timelineSpeed = usePlaygroundStore((s) => s.timelineSpeed);
  const setTimelinePlaying = usePlaygroundStore((s) => s.setTimelinePlaying);
  const setTimelineSpeed = usePlaygroundStore((s) => s.setTimelineSpeed);
  const stepTimeline = usePlaygroundStore((s) => s.stepTimeline);
  const setTimelineIndex = usePlaygroundStore((s) => s.setTimelineIndex);

  const model = activeThinkAlgorithm ? models[activeThinkAlgorithm] : null;
  const steps = model?.steps ?? [];
  const step = steps[timelineIndex];

  useEffect(() => {
    if (!timelinePlaying || steps.length === 0) return;
    const ms = 800 / timelineSpeed;
    const id = setInterval(() => {
      const idx = usePlaygroundStore.getState().timelineIndex;
      if (idx >= steps.length - 1) {
        setTimelinePlaying(false);
        return;
      }
      stepTimeline(1);
    }, ms);
    return () => clearInterval(id);
  }, [timelinePlaying, timelineSpeed, steps.length, stepTimeline, setTimelinePlaying]);

  if (!model || steps.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/8 bg-bg-elevated/60 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-ink-muted">
          Watch it think · step {timelineIndex + 1}/{steps.length}
        </p>
        <span className="font-mono text-xs text-gold">{timelineSpeed}x</span>
      </div>
      {step && (
        <p className="mb-3 text-sm text-ink">{step.label}</p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="secondary" onClick={() => setTimelineIndex(0)}>
          ⏮
        </Button>
        <Button size="sm" variant="secondary" onClick={() => stepTimeline(-1)}>
          ◀
        </Button>
        <Button
          size="sm"
          variant="primary"
          onClick={() => setTimelinePlaying(!timelinePlaying)}
        >
          {timelinePlaying ? "Pause" : "Play"}
        </Button>
        <Button size="sm" variant="secondary" onClick={() => stepTimeline(1)}>
          ▶
        </Button>
        <input
          type="range"
          min={0.5}
          max={3}
          step={0.5}
          value={timelineSpeed}
          onChange={(e) => setTimelineSpeed(Number(e.target.value))}
          className="wonder-range accent-violet ml-2 w-20"
          aria-label="Playback speed"
        />
      </div>
    </div>
  );
}
