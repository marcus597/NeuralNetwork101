"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/cn";

const homeLinks = [
  { href: "/roadmap", label: "Roadmap" },
  { href: "/learn", label: "Games" },
  { href: "/network", label: "Exhibit" },
] as const;

const pageLinks = [
  { href: "/roadmap", label: "Roadmap" },
  { href: "/learn", label: "Games" },
  { href: "/network", label: "Exhibit" },
] as const;

export function SiteNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return (
      <header className="pointer-events-none absolute inset-x-0 top-0 z-50">
        <div className="mx-auto grid max-w-[1400px] grid-cols-[1fr_auto_1fr] items-start gap-4 px-5 py-5 sm:px-8 lg:grid-cols-3 lg:px-8 lg:py-6">
          <div className="pointer-events-auto justify-self-start">
            <Link
              href="/learn"
              className="focus-ring inline-flex items-center gap-2.5 bg-ink px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-inverse transition-opacity hover:opacity-90"
            >
              <Menu className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              Menu
            </Link>
          </div>

          <Link
            href="/"
            className="pointer-events-auto justify-self-center font-display text-2xl tracking-[-0.04em] text-ink sm:text-3xl"
            aria-label="Neural Museum home"
          >
            10
          </Link>

          <nav
            aria-label="Main"
            className="pointer-events-auto flex flex-wrap items-center justify-end gap-x-5 gap-y-1 justify-self-end pt-1"
          >
            {homeLinks.map((link) => (
              <NavLink key={link.label} href={link.href} pathname={pathname}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-bg-canvas/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="focus-ring shrink-0 bg-ink px-3 py-2 text-ink-inverse transition-opacity hover:opacity-90"
          aria-label="Neural Museum home"
        >
          <span className="font-brand text-sm font-bold tracking-tight sm:text-base">
            Neural Museum.
          </span>
        </Link>

        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <nav aria-label="Main" className="hidden items-center gap-5 md:flex">
            {pageLinks.map((link) => (
              <NavLink key={link.label} href={link.href} pathname={pathname}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <nav aria-label="Mobile" className="flex items-center gap-3 md:hidden">
            {pageLinks.slice(0, 3).map((link) => (
              <NavLink key={link.label} href={link.href} pathname={pathname}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <Link
            href="/learn/what-is-a-neuron"
            className="focus-ring shrink-0 bg-ink px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-inverse transition-opacity hover:opacity-85"
          >
            Play now
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  pathname,
  children,
}: {
  href: string;
  pathname: string;
  children: React.ReactNode;
}) {
  const active =
    href === "/"
      ? pathname === "/"
      : href === "/learn"
        ? pathname.startsWith("/learn")
        : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "focus-ring text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors",
        active ? "text-ink" : "text-ink-subtle hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}
