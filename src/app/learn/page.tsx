import { SkillPath } from "@/components/interactions/SkillPath";
import { GameMapHero } from "@/components/graphics/GameMapHero";
import { getAllLessons } from "@/lib/content/loader";

export default function LearnPage() {
  const lessonMeta = Object.fromEntries(
    getAllLessons().map((lesson) => [
      lesson.slug,
      { title: lesson.title, kicker: lesson.kicker },
    ]),
  );

  return (
    <div className="page-container max-w-lg">
      <header className="mb-8 text-center">
        <GameMapHero />
        <h1 className="font-display mt-4 text-4xl uppercase tracking-wide text-ink">Game map</h1>
        <p className="mt-2 text-base font-bold text-ink-muted">
          10 games · one big idea each · earn stars
        </p>
      </header>

      <SkillPath lessonMeta={lessonMeta} />
    </div>
  );
}
