"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Lock } from "lucide-react";
import manifest from "../../../content/curriculum/manifest.json";
import { isLessonUnlocked } from "@/lib/content/curriculum-order";
import { getGameArt } from "@/lib/content/game-art";
import { GameThumbnail } from "@/components/graphics/GameThumbnail";
import { MapTrail } from "@/components/graphics/MapTrail";
import { ZoneBanner } from "@/components/graphics/ZoneBanner";
import { StarMeter } from "@/components/ui/StarMeter";
import { ComicStar } from "@/components/graphics/ComicStar";
import { useProgressStore } from "@/stores/progress-store";
import { cn } from "@/lib/cn";

type LessonMeta = { title: string; kicker?: string };

type SkillPathProps = {
  lessonMeta: Record<string, LessonMeta>;
};

export function SkillPath({ lessonMeta }: SkillPathProps) {
  const [active, setActive] = useState<string | null>(null);
  const lessons = useProgressStore((s) => s.lessons);

  const wings = useMemo(
    () =>
      manifest.modules.map((mod) => ({
        ...mod,
        games: mod.lessons.map((slug) => ({
          slug,
          title: lessonMeta[slug]?.title ?? slug,
          number: lessonMeta[slug]?.kicker ?? "?",
        })),
      })),
    [lessonMeta],
  );

  const stars = wings.reduce(
    (n, w) => n + w.games.filter((g) => lessons[g.slug]?.mastered).length,
    0,
  );
  const total = wings.reduce((n, w) => n + w.games.length, 0);

  return (
    <div className="space-y-12">
      <StarMeter collected={stars} total={total} />

      {wings.map((wing, wingIdx) => (
        <section key={wing.id}>
          <ZoneBanner zoneId={wing.id} className="mb-5" />

          <div>
            {wing.games.map((game, gameIdx) => {
              const prog = lessons[game.slug];
              const unlocked = isLessonUnlocked(game.slug, lessons);
              const done = prog?.mastered;
              const art = getGameArt(game.slug);
              const isLastInWing = gameIdx === wing.games.length - 1;
              const isLastWing = wingIdx === wings.length - 1;

              const card = (
                <div
                  className={cn(
                    "relative flex items-center gap-4 border bg-bg-surface p-4 transition-colors",
                    unlocked
                      ? "border-border-hairline hover:border-ink"
                      : "border-border-hairline opacity-50",
                    active === game.slug && unlocked && "border-ink bg-bg-muted",
                    done && "bg-bg-stage",
                  )}
                >
                  <span
                    className="absolute -left-px -top-2 border border-ink bg-bg-canvas px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-ink"
                    aria-hidden
                  >
                    #{game.number}
                  </span>

                  {unlocked ? (
                    <GameThumbnail slug={game.slug} size={52} />
                  ) : (
                    <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center border border-border-hairline bg-bg-inset">
                      <Lock className="h-4 w-4 text-ink-subtle" aria-hidden />
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold uppercase tracking-[0.04em] leading-snug text-ink">
                      {game.title}
                    </p>
                    {done && (
                      <p className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-nn-activation">
                        <ComicStar size={12} /> Mastered
                      </p>
                    )}
                  </div>

                  {done ? (
                    <ComicStar size={24} />
                  ) : unlocked ? (
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center border border-ink text-xs font-semibold"
                      style={{ background: art.bg, color: art.accent }}
                      aria-hidden
                    >
                      →
                    </span>
                  ) : null}
                </div>
              );

              return (
                <div key={game.slug}>
                  {unlocked ? (
                    <Link
                      href={`/learn/${game.slug}`}
                      className="focus-ring block"
                      onMouseEnter={() => setActive(game.slug)}
                      onMouseLeave={() => setActive(null)}
                    >
                      {card}
                    </Link>
                  ) : (
                    <div title="Play the previous game first">{card}</div>
                  )}
                  {!isLastInWing && <MapTrail />}
                  {isLastInWing && !isLastWing && <MapTrail variant="dashed" className="py-3" />}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
