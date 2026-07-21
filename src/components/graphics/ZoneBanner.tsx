import { cn } from "@/lib/cn";
import { ZONE_ART } from "@/lib/content/game-art";
import { MODULE_DESCRIPTIONS, MODULE_TITLES, WING_EMOJI } from "@/lib/content/module-copy";

type ZoneBannerProps = {
  zoneId: string;
  className?: string;
};

/** Illustrated zone header for the game map. */
export function ZoneBanner({ zoneId, className }: ZoneBannerProps) {
  const art = ZONE_ART[zoneId] ?? ZONE_ART["meet-ai"];
  const emoji = WING_EMOJI[zoneId] ?? "🎮";
  const title = MODULE_TITLES[zoneId] ?? zoneId;
  const description = MODULE_DESCRIPTIONS[zoneId] ?? "";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border-[3px] border-border-subtle bg-gradient-to-r p-4 shadow-md",
        art.gradient,
        className,
      )}
    >
      <ZonePattern color={art.pattern} />
      <div className="relative flex items-center gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border-[3px] border-border-subtle bg-bg-surface text-3xl shadow-sm"
          aria-hidden
        >
          {emoji}
        </div>
        <div className="min-w-0">
          <h2 className="font-display text-lg uppercase tracking-wide text-ink sm:text-xl">
            {title}
          </h2>
          <p className="text-sm font-bold text-ink-muted">{description}</p>
        </div>
      </div>
    </div>
  );
}

function ZonePattern({ color }: { color: string }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
      aria-hidden
    >
      <defs>
        <pattern id="zone-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="2" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#zone-dots)" />
    </svg>
  );
}
