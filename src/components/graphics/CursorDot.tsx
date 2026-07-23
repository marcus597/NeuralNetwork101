"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

type CursorMode = "default" | "hover" | "text";

/**
 * Custom cursor: black center dot + lagging ring.
 * Expands into a frosted “View” orb on interactive targets.
 */
export function CursorDot() {
  const reduced = useReducedMotion();
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ring = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const mode = useRef<CursorMode>("default");
  const pressed = useRef(false);
  const visible = useRef(false);
  const raf = useRef<number>(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const canHover = window.matchMedia("(hover: hover)").matches;
    setEnabled(fine && canHover && !reduced);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      visible.current = true;

      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el?.closest("input, textarea, [contenteditable='true']")) {
        mode.current = "text";
      } else if (
        el?.closest("a, button, [role='button'], select, label, summary, .focus-ring")
      ) {
        mode.current = "hover";
      } else {
        mode.current = "default";
      }

      const dot = dotRef.current;
      if (dot) {
        const scale =
          mode.current === "hover" ? 0 : mode.current === "text" ? 0.2 : 1;
        dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(${scale})`;
        dot.style.opacity = visible.current ? "1" : "0";
      }
    };

    const onDown = () => {
      pressed.current = true;
    };

    const onUp = () => {
      pressed.current = false;
    };

    const onLeave = () => {
      visible.current = false;
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    const tick = () => {
      const ease = mode.current === "hover" ? 0.18 : 0.13;
      ring.current.x += (target.current.x - ring.current.x) * ease;
      ring.current.y += (target.current.y - ring.current.y) * ease;

      const node = ringRef.current;
      const label = labelRef.current;
      if (node) {
        let scale = mode.current === "hover" ? 1 : mode.current === "text" ? 0.35 : 0.42;
        if (pressed.current) scale *= 0.88;

        const isHover = mode.current === "hover";
        node.dataset.mode = mode.current;
        node.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%) scale(${scale})`;
        node.style.opacity = visible.current ? "1" : "0";
        node.style.width = isHover ? "5.5rem" : "2rem";
        node.style.height = isHover ? "5.5rem" : mode.current === "text" ? "1.1rem" : "2rem";
        node.style.borderRadius = mode.current === "text" ? "2px" : "9999px";
        node.style.background = isHover ? "rgb(255 255 255 / 55%)" : "transparent";
        node.style.backdropFilter = isHover ? "blur(12px)" : "none";
        node.style.setProperty("-webkit-backdrop-filter", isHover ? "blur(12px)" : "none");
        node.style.borderColor = "#111111";
        node.style.borderWidth = isHover ? "1.5px" : "1.5px";
        node.style.boxShadow = isHover
          ? "0 8px 28px rgb(17 17 17 / 12%)"
          : "none";
      }

      if (label) {
        label.style.opacity = mode.current === "hover" && visible.current ? "1" : "0";
      }

      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    raf.current = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[300]" aria-hidden>
      <div
        ref={ringRef}
        data-mode="default"
        className="absolute left-0 top-0 flex items-center justify-center border-[1.5px] border-ink transition-[opacity,width,height,background,border-radius,box-shadow] duration-200"
        style={{
          opacity: 0,
          width: "2rem",
          height: "2rem",
          borderRadius: "9999px",
          willChange: "transform",
        }}
      >
        <span
          ref={labelRef}
          className="px-2 text-center text-[9px] font-semibold uppercase leading-tight tracking-[0.12em] text-ink opacity-0 transition-opacity duration-200"
        >
          View
        </span>
      </div>
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-2 w-2 rounded-full bg-ink transition-[opacity] duration-150"
        style={{ opacity: 0, willChange: "transform" }}
      />
    </div>
  );
}
