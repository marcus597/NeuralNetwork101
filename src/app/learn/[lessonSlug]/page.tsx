import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllLessonSlugs, getLessonBySlug } from "@/lib/content/loader";
import { LessonEngine } from "@/engines/lesson/LessonEngine";
import { JsonLd } from "@/components/shell/JsonLd";

type Props = { params: Promise<{ lessonSlug: string }> };

export async function generateStaticParams() {
  return getAllLessonSlugs().map((lessonSlug) => ({ lessonSlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lessonSlug } = await params;
  const lesson = getLessonBySlug(lessonSlug);
  if (!lesson) return { title: "Lesson — Wonder" };
  return {
    title: lesson.seo.title,
    description: lesson.seo.description,
    openGraph: {
      title: lesson.seo.title,
      description: lesson.seo.description,
    },
  };
}

export default async function LessonPage({ params }: Props) {
  const { lessonSlug } = await params;
  const lesson = getLessonBySlug(lessonSlug);
  if (!lesson) notFound();
  return (
    <>
      <JsonLd lesson={lesson} />
      <LessonEngine lesson={lesson} />
    </>
  );
}
