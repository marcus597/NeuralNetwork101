"use client";

import { cn } from "@/lib/cn";

export function normalizeAnswer(s: string): string {
  return s.trim().toLowerCase().replace(/[^\w\s]/g, "");
}

export function matchesAnswer(input: string, accepted: readonly string[]): boolean {
  const n = normalizeAnswer(input);
  if (!n) return false;
  return accepted.some((a) => {
    const t = normalizeAnswer(a);
    return n === t || n.includes(t) || t.includes(n);
  });
}

type GameTextFieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "number";
  hint?: string;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
};

export function GameTextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  hint,
  className,
  onKeyDown,
}: GameTextFieldProps) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="focus-ring w-full rounded-xl border-2 border-border-subtle bg-bg-surface px-4 py-3.5 text-lg font-medium text-ink placeholder:text-ink-faint focus:border-discover"
      />
      {hint && <span className="mt-1.5 block text-xs text-ink-muted">{hint}</span>}
    </label>
  );
}

export function GameFeedback({
  tone,
  message,
}: {
  tone: "success" | "error" | "neutral";
  message: string;
}) {
  const styles = {
    success: "bg-nn-signal-soft text-nn-activation ring-nn-activation/20",
    error: "bg-nn-blame-soft text-nn-blame ring-nn-blame/20",
    neutral: "bg-bg-muted text-ink-muted ring-border-subtle",
  };
  return (
    <p
      className={cn(
        "rounded-xl px-4 py-3 text-center text-sm font-medium ring-1",
        styles[tone],
      )}
      role="status"
    >
      {message}
    </p>
  );
}

export function GameCheckButton({
  onClick,
  disabled,
  children = "Check my answer ✓",
}: {
  onClick: () => void;
  disabled?: boolean;
  children?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="focus-ring min-h-14 w-full rounded-2xl bg-discover px-6 text-lg font-bold text-on-accent shadow-md transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function GameNumberBox({
  label,
  value,
  onChange,
  min = 0,
  max = 9,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <label className="flex flex-col items-center gap-1">
      <span className="text-xs font-semibold text-ink-muted">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
        }}
        className="focus-ring w-16 rounded-xl border-2 border-nn-input/30 bg-bg-surface py-3 text-center text-2xl font-bold text-ink"
      />
    </label>
  );
}

export function GameSumDisplay({ parts, total }: { parts: number[]; total: number }) {
  return (
    <div className="rounded-xl bg-bg-stage px-4 py-3 text-center ring-2 ring-border-subtle">
      <p className="text-sm text-ink-muted">Running total</p>
      <p className="mt-1 font-mono text-lg text-ink">
        {parts.join(" + ")} = <span className="font-bold text-discover">{total}</span>
      </p>
    </div>
  );
}
