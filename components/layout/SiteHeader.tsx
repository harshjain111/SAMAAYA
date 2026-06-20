import Link from "next/link";
import { buttonClasses } from "@/components/ui";

export interface SiteHeaderProps {
  announcement?: string | null;
}

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/track", label: "Track Order" },
  { href: "/contact", label: "Contact" },
];

/**
 * Site header — brand wordmark + nav. The cart drawer/badge is wired in
 * Prompt 2.1; for now "Cart" links to /cart.
 */
export function SiteHeader({ announcement }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40">
      {announcement && (
        <div className="bg-green-deep px-4 py-2 text-center text-xs font-medium text-cream">
          {announcement}
        </div>
      )}
      <div className="border-b border-charcoal/10 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="font-display text-xl font-semibold tracking-wide text-green-deep"
          >
            SAMAAYA
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-charcoal/80 sm:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="transition-colors hover:text-green-deep"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="text-sm font-medium text-charcoal/80 transition-colors hover:text-green-deep"
            >
              Cart
            </Link>
            <Link href="/shop" className={buttonClasses("primary", "sm")}>
              Shop
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
