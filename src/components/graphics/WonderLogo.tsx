import { cn } from "@/lib/cn";

type WonderLogoProps = {
  className?: string;
  size?: number;
};

/** Minimal editorial mark for nav and branding. */
export function WonderLogo({ className, size = 32 }: WonderLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <rect x="2" y="2" width="44" height="44" fill="#111111" />
      <path
        d="M14 30 L24 12 L34 30"
        stroke="#f2efe8"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="24" cy="34" r="3" fill="#f2efe8" />
      <path
        d="M34 10l2.2-1.4 0.7 2.5 2.5 0.7-1.8 1.8 0.6 2.5-2.4-1.3-2.4 1.3 0.6-2.5z"
        fill="#f2efe8"
      />
    </svg>
  );
}
