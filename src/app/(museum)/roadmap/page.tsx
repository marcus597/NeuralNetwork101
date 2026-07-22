import type { Metadata } from "next";
import { RoadmapExperience } from "@/components/roadmap/RoadmapExperience";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "A year of classical machine learning — supervised basics through neural networks — as a scrollable learning path.",
};

export default function RoadmapPage() {
  return <RoadmapExperience />;
}
