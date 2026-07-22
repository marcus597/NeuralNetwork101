import { SkillPath } from "@/components/interactions/SkillPath";
import { getAllLessons } from "@/lib/content/loader";

export default function LearnPage() {
  const lessonMeta = Object.fromEntries(
    getAllLessons().map((lesson) => [
      lesson.slug,
      { title: lesson.title, kicker: lesson.kicker },
    ]),
  );

  return (
    <div className="page-container max-w-3xl">
      <header className="mb-10 grid gap-6 border-b border-border-hairline pb-8 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="editorial-kicker mb-3">Contents · Roadmap</p>
          <h1 className="font-display text-4xl uppercase leading-none tracking-[-0.03em] text-ink sm:text-5xl">
            Game map
          </h1>
          <p className="mt-3 max-w-md text-sm font-medium uppercase tracking-[0.08em] text-ink-subtle">
            10 games · one big idea each · earn stars
          </p>
        </div>
        <p className="text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
          // follow the path
        </p>
      </header>

      <SkillPath lessonMeta={lessonMeta} />
    </div>
  );
}
