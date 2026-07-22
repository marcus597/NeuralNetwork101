import { SimulationSkeleton } from "@/components/ui/SimulationSkeleton";

export default function LearnLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="skeleton mb-2 h-3 w-28 rounded" />
      <div className="skeleton mb-8 h-9 w-72 max-w-full rounded-lg" />
      <SimulationSkeleton />
    </div>
  );
}
