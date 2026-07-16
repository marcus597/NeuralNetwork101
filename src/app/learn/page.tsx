import { SkillPath } from "@/components/interactions/SkillPath";
import { PageHeader } from "@/components/shell/PageHeader";
import { ProgressOverview } from "@/components/shell/ProgressOverview";

export default function LearnPage() {
  return (
    <div className="page-container max-w-5xl">
      <PageHeader
        title="Learning path"
        description="Four labs, one story — each stop lets you break something on purpose so Maya's recommender gets smarter."
      />
      <ProgressOverview />
      <SkillPath />
    </div>
  );
}
