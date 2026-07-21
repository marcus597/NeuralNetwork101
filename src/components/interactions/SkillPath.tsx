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
    <div className="space-y-10">
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
                    "relative flex items-center gap-4 rounded-lg border-[3px] bg-bg-surface p-4 shadow-sm transition-all",
                    unlocked
                      ? "border-border-subtle hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-md"
                      : "border-border-subtle opacity-55",
                    active === game.slug && unlocked && "bg-discover-soft shadow-md",
                    done && "ring-2 ring-gold/40",
                  )}
                >
                  {/* Game number ribbon */}
                  <span
                    className="absolute -left-1 -top-2 rounded-md border-2 border-border-subtle px-1.5 py-0.5 text-[10px] font-bold shadow-sm"
                    style={{ background: art.bg, color: art.accent }}
                    aria-hidden
                  >
                    #{game.number}
                  </span>

                  {unlocked ? (
                    <GameThumbnail slug={game.slug} size={52} />
                  ) : (
                    <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-md border-[3px] border-border-subtle bg-bg-inset shadow-sm">
                      <Lock className="h-5 w-5 text-ink-subtle" aria-hidden />
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="font-bold leading-snug text-ink">{game.title}</p>
                    {done && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs font-bold text-nn-activation">
                        <ComicStar size={14} /> Mastered
                      </p>
                    )}
                  </div>

                  {done ? (
                    <ComicStar size={28} />
                  ) : unlocked ? (
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-2 border-border-subtle text-sm font-bold shadow-sm"
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
