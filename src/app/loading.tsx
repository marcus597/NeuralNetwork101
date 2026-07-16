import { SimulationSkeleton } from "@/components/ui/SimulationSkeleton";

export default function RootLoading() {
  return (
    <div className="page-container">
      <div className="mb-8 space-y-3">
        <div className="skeleton h-4 w-24 rounded" />
        <div className="skeleton h-10 w-80 max-w-full rounded-lg" />
        <div className="skeleton h-5 w-96 max-w-full rounded" />
      </div>
      <SimulationSkeleton />
    </div>
  );
}
