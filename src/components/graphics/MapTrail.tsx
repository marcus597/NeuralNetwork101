import { cn } from "@/lib/cn";

type MapTrailProps = {
  className?: string;
  variant?: "dot" | "dashed";
};

/** Vertical dotted path connecting game map nodes. */
export function MapTrail({ className, variant = "dot" }: MapTrailProps) {
  return (
    <div className={cn("flex justify-center py-1", className)} aria-hidden>
      <svg width="12" height="20" viewBox="0 0 12 20">
        {variant === "dot" ? (
          <>
            <circle cx="6" cy="4" r="3" fill="#ffe566" stroke="#1a1a1a" strokeWidth="1.5" />
            <circle cx="6" cy="10" r="3" fill="#ffe566" stroke="#1a1a1a" strokeWidth="1.5" />
            <circle cx="6" cy="16" r="3" fill="#ffe566" stroke="#1a1a1a" strokeWidth="1.5" />
          </>
        ) : (
          <line
            x1="6"
            y1="2"
            x2="6"
            y2="18"
            stroke="#1a1a1a"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        )}
      </svg>
    </div>
  );
}
