"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

type ErrorFallbackProps = {
  title?: string;
  message?: string;
  onReset?: () => void;
};

export function ErrorFallback({
  title = "This lab hit a snag",
  message = "Something unexpected happened while running the simulation. Your progress is safe — try resetting or head back to explore.",
  onReset,
}: ErrorFallbackProps) {
  return (
    <div className="panel flex flex-col items-center gap-4 px-6 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/15">
        <AlertCircle className="h-5 w-5 text-danger" strokeWidth={1.75} />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
          {message}
        </p>
      </div>
      {onReset && (
        <Button variant="secondary" size="sm" onClick={onReset}>
          <RotateCcw className="mr-2 h-4 w-4" aria-hidden />
          Try again
        </Button>
      )}
    </div>
  );
}
