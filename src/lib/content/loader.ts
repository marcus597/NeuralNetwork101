import fs from "fs";
import path from "path";
import {
  lessonContentSchema,
  manifestSchema,
  type LessonContent,
  type CurriculumManifest,
} from "./schema";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const LESSONS_DIR = path.join(CONTENT_ROOT, "lessons");

export function getManifest(): CurriculumManifest {
  const raw = fs.readFileSync(
    path.join(CONTENT_ROOT, "curriculum", "manifest.json"),
    "utf-8",
  );
  return manifestSchema.parse(JSON.parse(raw));
}

export function getAllLessonSlugs(): string[] {
  return getManifest().modules.flatMap((m) => m.lessons);
}

export function getLessonBySlug(slug: string): LessonContent | null {
  const filePath = path.join(LESSONS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return lessonContentSchema.parse(JSON.parse(raw));
}

export function getAllLessons(): LessonContent[] {
  return getAllLessonSlugs()
    .map((slug) => getLessonBySlug(slug))
    .filter((l): l is LessonContent => l !== null);
}
