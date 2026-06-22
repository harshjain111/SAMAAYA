"use client";

import { useState } from "react";
import Link from "next/link";

export interface MobileNavProps {
  links: { href: string; label: string }[];
}

/** Hamburger menu for small screens. */
export function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-green-deep hover:bg-green-soft/15"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 top-0 z-30 bg-black/20" onClick={() => setOpen(false)} aria-hidden="true" />
          <nav className="absolute left-0 right-0 top-full z-40 border-b border-charcoal/10 bg-cream shadow-soft">
            <ul className="px-5 py-3">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-2 py-3 text-base font-medium text-charcoal/80 hover:bg-green-soft/10 hover:text-green-deep"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
