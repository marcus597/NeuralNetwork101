"use client";

import { PlaygroundCanvas } from "@/components/playground/PlaygroundCanvas";
import { DatasetPanel } from "@/components/playground/DatasetPanel";
import { AlgorithmPanel } from "@/components/playground/AlgorithmPanel";
import { ComparisonPanel } from "@/components/playground/ComparisonPanel";
import { TimelineControls } from "@/components/playground/TimelineControls";
import { ExperimentBar } from "@/components/playground/ExperimentBar";
import { PageHeader } from "@/components/shell/PageHeader";
import { Panel } from "@/components/ui/Panel";

export function PlaygroundShell() {
  return (
    <div className="page-container max-w-7xl">
      <PageHeader
        kicker="Ultimate playground"
        title="Train, compare, break things."
        description="Generate or draw Maya's rating data, tune eight algorithms, watch them think step by step, and share experiments — no instructions required."
      />

      <ExperimentBar />

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,320px)]">
        <div className="flex min-h-0 flex-col gap-4">
          <Panel glow="violet" className="flex-1 overflow-hidden p-2 sm:p-3">
            <PlaygroundCanvas />
          </Panel>
          <TimelineControls />
        </div>

        <aside className="flex flex-col gap-4">
          <DatasetPanel />
          <AlgorithmPanel />
          <ComparisonPanel />
        </aside>
      </div>
    </div>
  );
}
