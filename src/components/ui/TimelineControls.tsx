"use client";

import {
  Pause,
  Play,
  Rewind,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";

type TimelineControlsProps = {
  playing: boolean;
  currentIndex: number;
  totalSteps: number;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onRewind: () => void;
  onSpeedChange: (speed: number) => void;
  compact?: boolean;
};

export function TimelineControls({
  playing,
  currentIndex,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onStepForward,
  onStepBack,
  onRewind,
  onSpeedChange,
  compact = false,
}: TimelineControlsProps) {
  return (
    <div className={`flex flex-wrap items-end gap-2 ${compact ? "" : "mt-2"}`}>
      <Button
        variant="secondary"
        size="sm"
        onClick={playing ? onPause : onPlay}
        className="min-w-[5.5rem] flex-1 bg-sky/15 text-sky ring-1 ring-sky/20 hover:bg-sky/25"
      >
        {playing ? (
          <Pause className="mr-1.5 h-4 w-4" aria-hidden />
        ) : (
          <Play className="mr-1.5 h-4 w-4" aria-hidden />
        )}
        {playing ? "Pause" : "Play"}
      </Button>
      <Button
        variant="icon"
        size="sm"
        onClick={onStepBack}
        disabled={currentIndex <= 0}
        aria-label="Step back"
      >
        <SkipBack className="h-4 w-4" />
      </Button>
      <Button
        variant="icon"
        size="sm"
        onClick={onStepForward}
        disabled={currentIndex >= totalSteps - 1}
        aria-label="Step forward"
      >
        <SkipForward className="h-4 w-4" />
      </Button>
      <Button
        variant="icon"
        size="sm"
        onClick={onRewind}
        aria-label="Rewind"
      >
        <Rewind className="h-4 w-4" />
      </Button>
      <div className="w-full sm:w-44">
        <InteractiveSlider
          label="Speed"
          value={speed}
          min={0.25}
          max={4}
          step={0.25}
          accent="sky"
          format={(v) => `${v.toFixed(2)}×`}
          onChange={onSpeedChange}
        />
      </div>
      <span className="w-full font-mono text-xs text-ink-muted sm:w-auto">
        step {currentIndex + 1}/{totalSteps}
      </span>
    </div>
  );
}
