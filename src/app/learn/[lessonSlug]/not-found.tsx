import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";

export default function LearnNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <EmptyState
        title="Lesson not found"
        description="This lesson doesn't exist yet. Pick another stop on the Path."
        action={
          <Link
            href="/learn"
            className="focus-ring inline-flex min-h-11 items-center rounded-full border border-border-subtle bg-bg-elevated px-5 text-sm font-semibold text-ink hover:bg-bg-muted"
          >
            Back to Path
          </Link>
        }
      />
    </div>
  );
}
