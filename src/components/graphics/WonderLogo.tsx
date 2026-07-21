import { cn } from "@/lib/cn";

type WonderLogoProps = {
  className?: string;
  size?: number;
};

/** Comic brain + spark mark for nav and branding. */
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
      <rect x="2" y="2" width="44" height="44" rx="8" fill="#ffeaa7" stroke="#1a1a1a" strokeWidth="3" />
      <path
        d="M24 10c-6 0-10 4-10 9 0 3 1.5 5.5 4 7-1 2.5-0.5 5 2 6.5 2 1.2 4.5 0.8 6-1 1.5 1.8 4 2.2 6 1 2.5-1.5 3-4 2-6.5 2.5-1.5 4-4 4-7 0-5-4-9-10-9z"
        fill="#ff4757"
        stroke="#1a1a1a"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M18 18c1.5-1 3.5-0.5 4.5 1M30 18c-1.5-1-3.5-0.5-4.5 1"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="20" cy="22" r="2" fill="#1a1a1a" />
      <circle cx="28" cy="22" r="2" fill="#1a1a1a" />
      <path
        d="M32 6l3-2 1 3.5 3.5 1-2.5 2.5 0.8 3.5-3.3-1.8-3.3 1.8 0.8-3.5z"
        fill="#fdcb6e"
        stroke="#1a1a1a"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
