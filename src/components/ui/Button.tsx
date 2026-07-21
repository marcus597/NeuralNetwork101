"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-accent text-on-accent border-[3px] border-border-subtle shadow-md hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-sm",
  secondary:
    "border-[3px] border-border-subtle bg-bg-surface text-ink shadow-md hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-sm",
  ghost:
    "text-ink-muted hover:text-ink hover:bg-bg-muted active:scale-[0.98]",
  destructive:
    "bg-nn-blame-soft text-nn-blame border-[3px] border-border-subtle shadow-md hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-sm",
  icon: "p-2.5 text-ink-muted hover:text-ink hover:bg-bg-muted active:scale-95",
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
          "focus-ring inline-flex items-center justify-center rounded-lg font-bold transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 disabled:hover:translate-x-0 disabled:hover:translate-y-0",
          variants[variant],
          variant !== "icon" && sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);
