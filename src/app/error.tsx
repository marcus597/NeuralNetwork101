"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ErrorFallback } from "@/components/shell/ErrorFallback";

export default function GlobalError({
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
    <div className="page-container flex min-h-[60vh] flex-col items-center justify-center">
      <ErrorFallback
        title="Wonder stumbled"
        message="The page couldn't load properly. This is usually temporary — try again, or return to explore."
        onReset={reset}
      />
      <Link
        href="/"
        className="focus-ring mt-6 text-sm text-violet hover:text-violet/80"
      >
        Back to Explore
      </Link>
    </div>
  );
}
