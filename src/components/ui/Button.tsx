"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-violet text-white shadow-[0_0_20px_rgb(139_124_255/20%)] hover:bg-violet/90 hover:shadow-[0_0_28px_rgb(139_124_255/28%)] active:scale-[0.98]",
  secondary:
    "border border-white/12 bg-bg-elevated text-ink hover:border-white/18 hover:bg-white/5 active:scale-[0.98]",
  ghost:
    "text-ink-muted hover:text-ink hover:bg-white/5 active:scale-[0.98]",
  destructive:
    "bg-danger/15 text-danger hover:bg-danger/25 active:scale-[0.98]",
  icon: "p-2.5 text-ink-muted hover:text-ink hover:bg-white/5 active:scale-95",
} as const;

const sizes = {
  sm: "h-9 min-h-9 px-3.5 text-sm",
  md: "min-h-11 px-5 py-2.5 text-sm",
  lg: "min-h-12 px-6 py-3 text-base",
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
          "focus-ring inline-flex items-center justify-center rounded-full font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100",
          variants[variant],
          variant !== "icon" && sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);
