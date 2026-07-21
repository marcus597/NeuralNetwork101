"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Home, Map, Network } from "lucide-react";
import { WonderLogo } from "@/components/graphics/WonderLogo";
import { cn } from "@/lib/cn";
import { springSnappy } from "@/lib/motion/tokens";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/learn", label: "Games", icon: Map },
  { href: "/network", label: "Network", icon: Network },
] as const;

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 sm:px-6">
      <div className="mx-auto flex h-[3.25rem] max-w-lg items-center justify-between gap-2 rounded-xl border-[3px] border-border-subtle bg-bg-surface px-2 shadow-md sm:h-14 sm:gap-4 sm:px-4">
        <Link
          href="/"
          className="focus-ring flex min-h-10 items-center gap-2 rounded-lg px-2 py-1"
          aria-label="Neural Network Museum home"
        >
          <WonderLogo size={32} />
          <span className="font-display hidden text-lg tracking-wide text-ink sm:inline">
            Wonder
          </span>
        </Link>

        <nav aria-label="Main" className="flex items-center gap-0.5">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : link.href === "/learn"
                  ? pathname.startsWith("/learn")
                  : pathname.startsWith(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "focus-ring relative flex min-h-10 items-center gap-1 rounded-lg px-2 py-2 text-xs font-bold transition-colors sm:gap-1.5 sm:px-3 sm:text-sm",
                  active ? "text-ink" : "text-ink-muted hover:text-ink",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg border-2 border-border-subtle bg-bg-muted shadow-sm"
                    transition={springSnappy}
                  />
                )}
                <Icon className="relative h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                <span className="relative">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
