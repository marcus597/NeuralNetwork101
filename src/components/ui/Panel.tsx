import { cn } from "@/lib/cn";

type PanelProps = React.HTMLAttributes<HTMLDivElement> & {
  glow?: "violet" | "mint" | "coral" | "none";
};

export function Panel({ glow = "none", className, children, ...props }: PanelProps) {
  return (
    <div
      className={cn(
        "panel p-4 sm:p-5",
        glow === "violet" && "glow-violet",
        glow === "mint" && "glow-mint",
        glow === "coral" && "glow-coral",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
