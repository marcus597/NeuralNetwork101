import type { LessonContent } from "@/lib/content/schema";

export function JsonLd({ lesson }: { lesson: LessonContent }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: lesson.title,
    description: lesson.seo.description,
    learningResourceType: "Interactive exercise",
    educationalLevel: "Beginner",
    inLanguage: "en",
    isAccessibleForFree: true,
    provider: { "@type": "Organization", name: "Wonder" },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
