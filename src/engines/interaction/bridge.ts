"use client";

import { useEffect, useRef } from "react";

export function useThrottledSync<T>(
  value: T,
  onSync: (value: T) => void,
  hz = 30,
): void {
  const last = useRef(0);
  const onSyncRef = useRef(onSync);

  useEffect(() => {
    onSyncRef.current = onSync;
  }, [onSync]);

  useEffect(() => {
    const now = performance.now();
    if (now - last.current >= 1000 / hz) {
      last.current = now;
      onSyncRef.current(value);
    }
  }, [value, hz]);
}

export type SimBridge = {
  getSnapshot: () => unknown;
  subscribe: (cb: (snapshot: unknown) => void) => () => void;
};

export function createSimBridge<T>(
  getSnapshot: () => T,
): SimBridge {
  const listeners = new Set<(snapshot: unknown) => void>();
  return {
    getSnapshot: () => getSnapshot(),
    subscribe: (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
  };
}
