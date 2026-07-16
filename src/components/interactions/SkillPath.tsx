"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import manifest from "../../../content/curriculum/manifest.json";
import { useProgressStore } from "@/stores/progress-store";

/** One anchor lesson per module for the visual path */
const ANCHOR_SLUGS = [
  "prediction-game",
  "training",
  "underfitting",
  "knn",
  "svm",
  "gradient-descent",
  "model-selection",
];

const TITLE_BY_SLUG: Record<string, string> = {
  "prediction-game": "Start",
  training: "Training",
  underfitting: "Underfit",
  knn: "KNN",
  svm: "SVM",
  "gradient-descent": "Gradients",
  "model-selection": "Select",
};

export function SkillPath() {
  const [active, setActive] = useState<string | null>(null);
  const lessons = useProgressStore((s) => s.lessons);
  const markVisited = useProgressStore((s) => s.markVisited);

  const nodes = useMemo(() => {
    const slugs = ANCHOR_SLUGS.filter((slug) =>
      manifest.modules.some((m) => m.lessons.includes(slug)),
    );
    const count = slugs.length;
    return slugs.map((slug, index) => ({
      slug,
      title: TITLE_BY_SLUG[slug] ?? slug,
      x: 8 + (84 / Math.max(1, count - 1)) * index,
      y: index % 2 === 0 ? 50 : 30,
    }));
  }, []);

  return (
    <div className="space-y-6">
      <div className="panel relative mx-auto aspect-[2/1] w-full max-w-4xl overflow-hidden">
        <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full" aria-hidden>
          <motion.path
            d="M 8 50 C 18 42, 22 36, 28 35 S 40 48, 50 50 S 62 38, 72 35 S 82 42, 92 30"
            fill="none"
            stroke="rgba(139,124,255,0.25)"
            strokeWidth="0.6"
            strokeDasharray="2 2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>

        {nodes.map((node, index) => {
          const prog = lessons[node.slug];
          const lit = prog?.visited || prog?.mastered || active === node.slug;
          const mastered = prog?.mastered;
          const color = mastered ? "#3dffb5" : lit ? "#8b7cff" : "#94a3b8";

          return (
            <div
              key={node.slug}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <Link
                href={`/learn/${node.slug}`}
                className="focus-ring group block"
                aria-label={`${node.title} — ${node.slug}`}
                onMouseEnter={() => {
                  setActive(node.slug);
                  markVisited(node.slug);
                }}
                onMouseLeave={() => setActive(null)}
              >
                <motion.div
                  animate={{
                    scale: active === node.slug ? 1.12 : 1,
                    boxShadow:
                      active === node.slug
                        ? `0 0 28px ${color}66`
                        : "0 0 0px transparent",
                  }}
                  className="flex h-14 w-14 items-center justify-center rounded-full border-2 text-xs font-bold sm:h-16 sm:w-16"
                  style={{
                    borderColor: lit ? color : "rgba(255,255,255,0.15)",
                    backgroundColor: lit ? `${color}22` : "rgba(255,255,255,0.04)",
                    color: lit ? color : "#94a3b8",
                  }}
                >
                  {index + 1}
                </motion.div>
                <p className="mt-2 max-w-[5rem] text-center text-xs text-ink-muted group-hover:text-ink">
                  {node.title}
                </p>
              </Link>
            </div>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {manifest.modules.map((mod) => (
          <div key={mod.id} className="rounded-xl border border-white/8 bg-bg-panel/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-violet">
              {mod.title}
            </p>
            <ul className="mt-2 space-y-1">
              {mod.lessons.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/learn/${slug}`}
                    className="focus-ring text-sm text-ink-muted hover:text-ink"
                  >
                    {slug.replace(/-/g, " ")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
