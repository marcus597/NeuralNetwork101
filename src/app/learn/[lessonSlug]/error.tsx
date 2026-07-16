"use client";

import { ErrorFallback } from "@/components/shell/ErrorFallback";

export default function LessonError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorFallback
      title="Lesson failed to load"
      message={error.message || "This lesson could not be loaded."}
      onReset={reset}
    />
  );
}
