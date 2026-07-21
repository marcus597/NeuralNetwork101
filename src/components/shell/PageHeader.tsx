import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type PageHeaderProps = {
  title: string;
  description?: string;
  kicker?: string;
  className?: string;
  children?: ReactNode;
};

export function PageHeader({
  title,
  description,
  kicker,
  className,
  children,
}: PageHeaderProps) {
  return (
    <header className={cn("mb-10 sm:mb-14", className)}>
      {kicker && <p className="museum-label mb-3">{kicker}</p>}
      <h1 className="display-title max-w-3xl">{title}</h1>
      {description && (
        <p className="body-lg mt-4 max-w-2xl">{description}</p>
      )}
      {children}
    </header>
  );
}
