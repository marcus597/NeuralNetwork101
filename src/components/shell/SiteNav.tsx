"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Compass, Map, FlaskConical } from "lucide-react";
import { cn } from "@/lib/cn";
import { springSnappy } from "@/lib/motion/tokens";

const links = [
  { href: "/", label: "Explore", icon: Compass },
  { href: "/learn", label: "Path", icon: Map },
  { href: "/playground", label: "Playground", icon: FlaskConical },
] as const;

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/6 bg-bg-deep/85 backdrop-blur-xl supports-[backdrop-filter]:bg-bg-deep/70">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-[3.75rem] sm:px-6">
        <Link
          href="/"
          className="focus-ring group flex min-h-11 items-center gap-2.5 rounded-lg px-1 py-1"
          aria-label="Wonder home"
        >
          <motion.span
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-violet/15 text-sm font-bold text-violet ring-1 ring-violet/25"
            whileHover={{ rotate: 8, scale: 1.04 }}
            transition={springSnappy}
          >
            W
          </motion.span>
          <span className="font-semibold tracking-tight text-ink transition-colors group-hover:text-white">
            Wonder
          </span>
        </Link>

        <nav aria-label="Main" className="flex items-center gap-0.5 sm:gap-1">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "focus-ring relative flex min-h-11 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors sm:px-3.5",
                  active ? "text-white" : "text-ink-muted hover:text-ink",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/8 ring-1 ring-white/6"
                    transition={springSnappy}
                  />
                )}
                <Icon
                  className="relative h-4 w-4 shrink-0 opacity-80"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <span className="relative">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
