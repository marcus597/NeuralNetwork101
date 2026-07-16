"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useProgressStore } from "@/stores/progress-store";

const TOTAL_LESSONS = 26;

export function ProgressOverview() {
  const lessons = useProgressStore((s) => s.lessons);

  const { mastered, visited } = useMemo(() => {
    const entries = Object.values(lessons);
    return {
      mastered: entries.filter((l) => l.mastered).length,
      visited: entries.filter((l) => l.visited).length,
    };
  }, [lessons]);

  if (visited === 0) {
    return (
      <div className="mb-8 rounded-[var(--radius-lg)] border border-dashed border-white/10 bg-bg-elevated/20 px-5 py-4 text-sm text-ink-muted">
        Hover a node to light the trail — progress saves automatically as you explore.
      </div>
    );
  }

  return (
    <div className="mb-8 max-w-md space-y-3">
      <ProgressBar
        value={mastered}
        max={TOTAL_LESSONS}
        label="Lessons mastered"
        tone="mint"
      />
      {mastered > 0 && mastered < TOTAL_LESSONS && (
        <p className="text-xs text-ink-muted">
          {mastered} down — keep experimenting on the path.
        </p>
      )}
      {mastered >= TOTAL_LESSONS && (
        <Link
          href="/playground"
          className="focus-ring inline-flex min-h-9 items-center rounded-full border border-white/12 bg-bg-elevated px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-white/5"
        >
          Celebrate in the playground
        </Link>
      )}
    </div>
  );
}
