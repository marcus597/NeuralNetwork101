"use client";

import { useMemo } from "react";
import manifest from "../../../content/curriculum/manifest.json";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useProgressStore } from "@/stores/progress-store";

export function ProgressOverview() {
  const lessons = useProgressStore((s) => s.lessons);

  const { mastered, total } = useMemo(() => {
    const slugs = manifest.modules.flatMap((m) => m.lessons);
    const masteredCount = slugs.filter((slug) => lessons[slug]?.mastered).length;
    return { mastered: masteredCount, total: slugs.length };
  }, [lessons]);

  if (mastered === 0) return null;

  return (
    <div className="mb-8 max-w-md">
      <ProgressBar
        value={mastered}
        max={total}
        label="Path progress"
        tone="mint"
      />
    </div>
  );
}
