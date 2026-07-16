"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { useProgressStore } from "@/stores/progress-store";

const modules = [
  {
    id: "fit",
    title: "Start here",
    lessons: [
      { slug: "training", title: "Training", x: 15, y: 50 },
      { slug: "overfitting", title: "Overfitting", x: 38, y: 32 },
      { slug: "neural-networks", title: "Neurons", x: 62, y: 52 },
      { slug: "logistic-regression", title: "Split", x: 85, y: 35 },
    ],
  },
];

export function SkillPath() {
  const [active, setActive] = useState<string | null>(null);
  const lessons = useProgressStore((s) => s.lessons);
  const markVisited = useProgressStore((s) => s.markVisited);
  const nodes = modules.flatMap((m) => m.lessons);

  return (
    <div className="panel relative mx-auto aspect-[2/1] w-full max-w-4xl overflow-hidden">
      <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full" aria-hidden>
        <motion.path
          d="M 15 50 C 22 42, 28 36, 38 32 S 52 48, 62 52 S 74 42, 85 35"
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
                    active === node.slug ? `0 0 28px ${color}66` : "0 0 0px transparent",
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
  );
}
