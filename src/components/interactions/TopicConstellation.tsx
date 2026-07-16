"use client";

import { colors } from "@/lib/theme/colors";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { springSnappy } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

type Orb = {
  id: string;
  label: string;
  href: string;
  x: number;
  y: number;
  color: string;
  preview: string;
};

const ORBS: Orb[] = [
  {
    id: "classify",
    label: "Split",
    href: "/learn/classification",
    x: 0.22,
    y: 0.38,
    color: colors.mint,
    preview: "Drag a boundary between loves & skips",
  },
  {
    id: "neurons",
    label: "Fire",
    href: "/learn/neurons",
    x: 0.5,
    y: 0.22,
    color: colors.violet,
    preview: "Tune weights until the neuron fires",
  },
  {
    id: "train",
    label: "Chase",
    href: "/learn/training",
    x: 0.78,
    y: 0.4,
    color: colors.sky,
    preview: "Watch gradient descent chase the error",
  },
  {
    id: "overfit",
    label: "Wiggle",
    href: "/learn/overfitting",
    x: 0.35,
    y: 0.68,
    color: colors.coral,
    preview: "Crank complexity — feel overfitting",
  },
  {
    id: "play",
    label: "Sandbox",
    href: "/playground",
    x: 0.68,
    y: 0.72,
    color: colors.gold,
    preview: "Break all four toys at once",
  },
];

export function TopicConstellation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [orbs, setOrbs] = useState(ORBS);
  const [hovered, setHovered] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const dragId = useRef<string | null>(null);
  const dragMoved = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (touched || reducedMotion) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      setOrbs(
        ORBS.map((o, i) => ({
          ...o,
          x: o.x + Math.sin(t / 1.2 + i) * 0.008,
          y: o.y + Math.cos(t / 1.4 + i) * 0.008,
        })),
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [touched, reducedMotion]);

  const moveOrb = (id: string, clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(0.92, Math.max(0.08, (clientX - rect.left) / rect.width));
    const y = Math.min(0.88, Math.max(0.12, (clientY - rect.top) / rect.height));
    setOrbs((prev) => prev.map((o) => (o.id === id ? { ...o, x, y } : o)));
    setTouched(true);
  };

  return (
    <div
      ref={containerRef}
      className="panel relative mx-auto aspect-[4/3] w-full max-w-4xl overflow-hidden glow-violet touch-none"
      aria-label="Interactive topic map. Drag orbs to explore lessons."
    >
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        {orbs.map((a, i) =>
          orbs.slice(i + 1).map((b) => (
            <line
              key={`${a.id}-${b.id}`}
              x1={`${a.x * 100}%`}
              y1={`${a.y * 100}%`}
              x2={`${b.x * 100}%`}
              y2={`${b.y * 100}%`}
              stroke="rgba(139,124,255,0.1)"
              strokeWidth="1"
            />
          )),
        )}
      </svg>

      {orbs.map((orb) => (
        <div
          key={orb.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${orb.x * 100}%`, top: `${orb.y * 100}%` }}
        >
          <motion.div
            onPointerDown={(e) => {
              dragId.current = orb.id;
              dragMoved.current = false;
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (dragId.current !== orb.id) return;
              dragMoved.current = true;
              moveOrb(orb.id, e.clientX, e.clientY);
            }}
            onPointerUp={() => {
              dragId.current = null;
            }}
            onHoverStart={() => setHovered(orb.id)}
            onHoverEnd={() => setHovered(null)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.96 }}
            transition={springSnappy}
            className="cursor-grab active:cursor-grabbing"
          >
            <Link
              href={orb.href}
              className="focus-ring block"
              onClick={(e) => {
                if (dragMoved.current) e.preventDefault();
              }}
            >
              <motion.span
                className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full text-sm font-semibold text-bg-deep sm:h-20 sm:w-20"
                style={{ backgroundColor: orb.color }}
                animate={
                  hovered === orb.id
                    ? { boxShadow: `0 0 36px ${orb.color}66` }
                    : { boxShadow: `0 0 0px transparent` }
                }
              >
                {orb.label}
              </motion.span>
            </Link>
          </motion.div>

          {hovered === orb.id && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-none absolute left-1/2 top-full mt-2.5 max-w-[10rem] -translate-x-1/2 text-center text-xs leading-snug text-ink-muted"
            >
              {orb.preview}
            </motion.p>
          )}
        </div>
      ))}

      {!touched && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={reducedMotion ? { opacity: 0.7 } : { opacity: [0.45, 0.85, 0.45] }}
          transition={reducedMotion ? undefined : { repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
          className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-ink-muted"
        >
          drag an orb
        </motion.p>
      )}
    </div>
  );
}
