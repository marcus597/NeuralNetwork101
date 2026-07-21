"use client";

import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { TimelineControls } from "@/components/ui/TimelineControls";

type FrameScrubberProps = {
  index: number;
  total: number;
  playing: boolean;
  speed: number;
  label?: string;
  onIndexChange: (index: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onRewind: () => void;
  onSpeedChange: (speed: number) => void;
};

export function FrameScrubber({
  index,
  total,
  playing,
  speed,
  label = "Frame",
  onIndexChange,
  onPlay,
  onPause,
  onStepForward,
  onStepBack,
  onRewind,
  onSpeedChange,
}: FrameScrubberProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-border-subtle bg-bg-surface p-4 shadow-sm">
      <InteractiveSlider
        label={`${label} ${index + 1} / ${Math.max(total, 1)}`}
        value={index}
        min={0}
        max={Math.max(total - 1, 0)}
        step={1}
        format={(v) => String(v + 1)}
        accent="sky"
        onChange={onIndexChange}
      />
      <TimelineControls
        playing={playing}
        currentIndex={index}
        totalSteps={Math.max(total, 1)}
        speed={speed}
        onPlay={onPlay}
        onPause={onPause}
        onStepForward={onStepForward}
        onStepBack={onStepBack}
        onRewind={onRewind}
        onSpeedChange={onSpeedChange}
        compact
      />
    </div>
  );
}
