import { cn } from "@/lib/cn";

type PanelProps = React.HTMLAttributes<HTMLDivElement>;

export function Panel({ className, children, ...props }: PanelProps) {
  return (
    <div className={cn("panel p-4 sm:p-5", className)} {...props}>
      {children}
    </div>
  );
}
