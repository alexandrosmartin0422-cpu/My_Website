"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { initials, nav, site } from "@/lib/site";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-rock-800/80 bg-rock-950/80 backdrop-blur">
      <nav className="container-content flex h-16 items-center justify-between">
        {/* Left margin clears the fixed StatsBadge in the top-left corner. */}
        <Link
          href="/"
          className="flex items-center gap-2 pl-[130px] font-mono text-sm sm:pl-[150px]"
        >
          <span className="grid h-8 w-8 place-items-center rounded-md bg-ore-500 font-bold text-rock-950">
            {initials}
          </span>
          <span className="hidden font-semibold tracking-tight sm:inline">
            {site.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm transition ${
                  isActive(item.href)
                    ? "text-ore-400"
                    : "text-rock-300 hover:text-rock-50"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-rock-200"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <ul className="container-content flex flex-col gap-1 pb-4 md:hidden">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block rounded-md px-3 py-2 text-sm transition ${
                  isActive(item.href)
                    ? "bg-rock-800 text-ore-400"
                    : "text-rock-300 hover:bg-rock-900"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
