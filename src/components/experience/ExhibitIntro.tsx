import type { LessonContent } from "@/lib/content/schema";
import { cn } from "@/lib/cn";

type ExhibitIntroProps = {
  lesson: LessonContent;
  phase?: "playground" | "miniChallenge" | "quiz";
  className?: string;
};

const PHASE_HELP = {
  playground: {
    label: "What to do",
    text: "Explore freely. Move sliders, press buttons, and watch what changes. There are no wrong answers here.",
  },
  miniChallenge: {
    label: "Your goal",
    text: "", // filled from lesson
  },
  quiz: {
    label: "Quick check",
    text: "Three short questions — guess, try, and explain. This isn't a test; it just confirms the idea clicked.",
  },
};

export function ExhibitIntro({ lesson, phase = "playground", className }: ExhibitIntroProps) {
  const concept = lesson.phases.intuition.blocks.find((b) => b.type === "concept");
  const instructions = lesson.phases.intuition.blocks.find(
    (b) => b.type === "text" || b.type === "metaphor",
  );
  const phaseHelp = PHASE_HELP[phase];
  const goalText =
    phase === "miniChallenge" ? lesson.phases.miniChallenge.goal : phaseHelp.text;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-2xl border border-border-subtle bg-bg-surface p-5 shadow-sm sm:p-6">
        <p className="text-lg font-medium leading-snug text-ink">
          {lesson.phases.hook.prompt}
        </p>
        {lesson.phases.hook.tease && (
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            {lesson.phases.hook.tease}
          </p>
        )}
      </div>

      {concept && concept.type === "concept" && (
        <div className="rounded-2xl border border-nn-input/15 bg-nn-input-soft/50 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-nn-input">
            In plain English — {concept.term}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink">{concept.definition}</p>
        </div>
      )}

      {phase === "playground" && instructions && "body" in instructions && instructions.body && (
        <div className="rounded-2xl border border-border-subtle bg-bg-stage px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
            Try this
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{instructions.body}</p>
        </div>
      )}

      {phase !== "playground" && (
        <div className="rounded-2xl border border-discover/15 bg-discover-soft/60 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-discover">
            {phaseHelp.label}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink">{goalText}</p>
        </div>
      )}

      {lesson.phases.realWorld.example && phase === "playground" && (
        <p className="text-xs leading-relaxed text-ink-subtle">
          <span className="font-medium text-ink-muted">Why it matters: </span>
          {lesson.phases.realWorld.example}
        </p>
      )}
    </div>
  );
}
