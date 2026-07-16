import { SimulationSkeleton } from "@/components/ui/SimulationSkeleton";

export default function LessonLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-2 h-3 w-24 animate-pulse rounded bg-white/5" />
      <div className="mb-8 h-9 w-2/3 animate-pulse rounded bg-white/5" />
      <SimulationSkeleton />
    </div>
  );
}
