"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TimelineEngine } from "@/engines/interaction/TimelineEngine";
import type { TimelineState, TimelineStep } from "@/engines/interaction/types";

export function useTimeline<T = Record<string, unknown>>(
  steps: TimelineStep<T>[],
  onStep?: (step: TimelineStep<T>, index: number) => void,
) {
  const engineRef = useRef<TimelineEngine<T> | null>(null);
  const [state, setState] = useState<TimelineState>({
    steps: steps as TimelineStep[],
    currentIndex: 0,
    playing: false,
    speed: 1,
  });

  useEffect(() => {
    const engine = new TimelineEngine<T>(steps);
    engineRef.current = engine;
    if (onStep) {
      engine.onStepChange((step, index) => {
        onStep(step, index);
        setState(engine.getState());
      });
    }
    return () => engine.destroy();
  }, [steps, onStep]);

  const play = useCallback(() => {
    engineRef.current?.play();
    setState(engineRef.current?.getState() ?? state);
  }, [state]);

  const pause = useCallback(() => {
    engineRef.current?.pause();
    setState(engineRef.current?.getState() ?? state);
  }, [state]);

  const stepForward = useCallback(() => {
    engineRef.current?.stepForward();
    setState(engineRef.current?.getState() ?? state);
  }, [state]);

  const stepBack = useCallback(() => {
    engineRef.current?.stepBack();
    setState(engineRef.current?.getState() ?? state);
  }, [state]);

  const rewind = useCallback(() => {
    engineRef.current?.rewind();
    setState(engineRef.current?.getState() ?? state);
  }, [state]);

  const setSpeed = useCallback((speed: number) => {
    engineRef.current?.setSpeed(speed);
    setState(engineRef.current?.getState() ?? state);
  }, [state]);

  return {
    state,
    play,
    pause,
    stepForward,
    stepBack,
    rewind,
    setSpeed,
    engine: engineRef,
  };
}
