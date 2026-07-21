import type { MetadataRoute } from "next";
import { getAllLessonSlugs } from "@/lib/content/loader";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wonder.ml";

export default function sitemap(): MetadataRoute.Sitemap {
  const lessons = getAllLessonSlugs();

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/learn`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    ...lessons.map((slug) => ({
      url: `${BASE}/learn/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
