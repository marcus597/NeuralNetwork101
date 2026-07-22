import { cn } from "@/lib/cn";
import { ZONE_ART } from "@/lib/content/game-art";
import { MODULE_DESCRIPTIONS, MODULE_TITLES, WING_EMOJI } from "@/lib/content/module-copy";

type ZoneBannerProps = {
  zoneId: string;
  className?: string;
};

/** Editorial zone header for the game map. */
export function ZoneBanner({ zoneId, className }: ZoneBannerProps) {
  const art = ZONE_ART[zoneId] ?? ZONE_ART["meet-ai"];
  const emoji = WING_EMOJI[zoneId] ?? "🎮";
  const title = MODULE_TITLES[zoneId] ?? zoneId;
  const description = MODULE_DESCRIPTIONS[zoneId] ?? "";

  return (
    <div
      className={cn(
        "relative overflow-hidden border border-border-hairline bg-bg-surface p-4",
        className,
      )}
    >
      <div
        className="absolute inset-y-0 left-0 w-1"
        style={{ background: art.pattern }}
        aria-hidden
      />
      <div className="relative flex items-center gap-4 pl-2">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center border border-border-hairline bg-bg-muted text-2xl"
          aria-hidden
        >
          {emoji}
        </div>
        <div className="min-w-0">
          <h2 className="font-display text-lg uppercase tracking-[-0.02em] text-ink sm:text-xl">
            {title}
          </h2>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-ink-subtle">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
