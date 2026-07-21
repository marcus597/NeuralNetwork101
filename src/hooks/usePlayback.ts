"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type PlaybackState = {
  index: number;
  playing: boolean;
  speed: number;
};

export function usePlayback(totalFrames: number, autoPlayMs = 400) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clamp = useCallback(
    (i: number) => Math.max(0, Math.min(totalFrames - 1, i)),
    [totalFrames],
  );

  useEffect(() => {
    if (!playing || totalFrames <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => {
        const next = i + 1;
        if (next >= totalFrames) {
          setPlaying(false);
          return totalFrames - 1;
        }
        return next;
      });
    }, autoPlayMs / speed);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, speed, totalFrames, autoPlayMs]);

  return {
    index,
    playing,
    speed,
    setIndex: (i: number) => setIndex(clamp(i)),
    play: () => setPlaying(true),
    pause: () => setPlaying(false),
    toggle: () => setPlaying((p) => !p),
    stepForward: () => setIndex((i) => clamp(i + 1)),
    stepBack: () => setIndex((i) => clamp(i - 1)),
    rewind: () => {
      setPlaying(false);
      setIndex(0);
    },
    setSpeed,
    atEnd: index >= totalFrames - 1,
    atStart: index <= 0,
  };
}
