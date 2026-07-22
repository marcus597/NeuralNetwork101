"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ErrorFallback } from "@/components/shell/ErrorFallback";

export default function LearnError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-12">
      <ErrorFallback
        title="This lesson didn't load"
        message="The lab hit a snag — usually a missing file or a simulation glitch. Try again, or pick another lesson on the path."
        onReset={reset}
      />
      <Link
        href="/learn"
        className="focus-ring mt-6 text-sm text-violet hover:text-violet/80"
      >
        Back to learning path
      </Link>
    </div>
  );
}
