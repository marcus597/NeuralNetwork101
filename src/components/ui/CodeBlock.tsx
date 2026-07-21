import { cn } from "@/lib/cn";

type CodeBlockProps = {
  code: string;
  language?: string;
  className?: string;
};

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  return (
    <pre
      className={cn(
        "overflow-x-auto rounded-xl border border-border-subtle bg-bg-inset p-4 font-mono text-sm text-ink-muted",
        className,
      )}
    >
      <code>{language && <span className="sr-only">{language}</span>}{code}</code>
    </pre>
  );
}
