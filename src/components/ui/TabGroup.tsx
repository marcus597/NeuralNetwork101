"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { springSnappy } from "@/lib/motion/tokens";

type Tab = { id: string; label: string };

type TabGroupProps = {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  ariaLabel?: string;
  className?: string;
};

export function TabGroup({
  tabs,
  active,
  onChange,
  ariaLabel = "Tabs",
  className,
}: TabGroupProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn("flex flex-wrap gap-2", className)}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "focus-ring relative min-h-11 rounded-full px-4 py-2.5 text-sm font-medium transition-colors active:scale-[0.98]",
              isActive ? "text-white" : "text-ink-muted hover:text-ink",
            )}
          >
            {isActive && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-full bg-white/10"
                transition={springSnappy}
              />
            )}
            <span className="relative">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
