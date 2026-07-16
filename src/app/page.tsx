import dynamic from "next/dynamic";
import { PageHeader } from "@/components/shell/PageHeader";
import { SimulationSkeleton } from "@/components/ui/SimulationSkeleton";

const TopicConstellation = dynamic(
  () =>
    import("@/components/interactions/TopicConstellation").then(
      (m) => m.TopicConstellation,
    ),
  { loading: () => <SimulationSkeleton showControls={false} /> },
);

const DecisionBoundary = dynamic(
  () =>
    import("@/components/interactions/DecisionBoundary").then(
      (m) => m.DecisionBoundary,
    ),
  { loading: () => <SimulationSkeleton /> },
);

export default function HomePage() {
  return (
    <div className="page-container max-w-5xl">
      <PageHeader
        title="Touch machine learning."
        description="Maya's taste engine at Reel starts empty. Drag the map, split some dots, and see what the model guesses before anyone lectures you."
      />

      <TopicConstellation />

      <section className="section-gap" aria-labelledby="try-now-heading">
        <h2
          id="try-now-heading"
          className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted"
        >
          Try it now
        </h2>
        <DecisionBoundary compact revealHiddenDefault={false} />
      </section>
    </div>
  );
}
