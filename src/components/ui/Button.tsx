"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-ink text-ink-inverse border border-ink hover:opacity-90 active:opacity-100",
  secondary:
    "border border-ink bg-bg-surface text-ink hover:bg-ink hover:text-ink-inverse",
  ghost:
    "text-ink-muted hover:text-ink hover:bg-bg-muted active:scale-[0.98]",
  destructive:
    "bg-nn-blame-soft text-nn-blame border border-nn-blame/30 hover:border-nn-blame",
  icon: "p-2.5 text-ink-muted hover:text-ink hover:bg-bg-muted active:scale-95",
} as const;

const sizes = {
  sm: "h-9 min-h-9 px-3.5 text-[11px]",
  md: "min-h-11 px-5 py-2.5 text-[11px]",
  lg: "min-h-12 px-6 py-3 text-xs",
} as const;

export type ButtonVariant = keyof typeof variants;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: keyof typeof sizes;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "primary", size = "md", type = "button", ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "focus-ring inline-flex items-center justify-center font-semibold uppercase tracking-[0.1em] transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-40",
          variant === "primary" || variant === "secondary"
            ? "rounded-full"
            : "rounded-md",
          variants[variant],
          variant !== "icon" && sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);
