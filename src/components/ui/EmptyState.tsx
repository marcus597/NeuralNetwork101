"use client";

import type { ReactNode } from "react";
import { Compass, FlaskConical, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

type EmptyStateProps = {
  icon?: "compass" | "flask" | "sparkles";
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

const icons = {
  compass: Compass,
  flask: FlaskConical,
  sparkles: Sparkles,
};

export function EmptyState({
  icon = "compass",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const Icon = icons[icon];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-white/10 bg-bg-elevated/30 px-6 py-12 text-center",
        className,
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet/10">
        <Icon className="h-5 w-5 text-violet" strokeWidth={1.75} aria-hidden />
      </div>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
