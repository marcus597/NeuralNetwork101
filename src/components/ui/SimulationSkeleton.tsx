import { cn } from "@/lib/cn";

type SimulationSkeletonProps = {
  className?: string;
  showControls?: boolean;
};

export function SimulationSkeleton({
  className,
  showControls = true,
}: SimulationSkeletonProps) {
  return (
    <div className={cn("space-y-4", className)} aria-hidden>
      <div className="panel overflow-hidden">
        <div className="skeleton h-56 w-full sm:h-72" />
        <div className="flex gap-2 p-4">
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-6 w-20 rounded-full" />
        </div>
      </div>
      {showControls && (
        <div className="space-y-3">
          <div className="skeleton h-10 w-full rounded-xl" />
          <div className="skeleton h-10 w-2/3 rounded-xl" />
        </div>
      )}
    </div>
  );
}
