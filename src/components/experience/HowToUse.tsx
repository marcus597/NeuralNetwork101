type HowToUseProps = {
  steps: string[];
};

export function HowToUse({ steps }: HowToUseProps) {
  return (
    <div className="rounded-2xl border-2 border-discover/30 bg-discover-soft p-5 sm:p-6">
      <p className="text-base font-semibold text-discover">How to use this page</p>
      <ol className="mt-4 space-y-3">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-3 text-base leading-relaxed text-ink">
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bg-surface text-sm font-bold text-discover ring-1 ring-discover/20"
              aria-hidden
            >
              {i + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Fallback when a lesson has no custom steps yet. */
export const DEFAULT_HOW_TO_STEPS = [
  "Scroll down this page.",
  "Read each numbered section.",
  "Touch the sliders and buttons in the toy below.",
  "Watch what changes when you move things!",
];
