import Link from "next/link";
import { buttonClasses } from "@/components/ui";
import { CartButton } from "@/components/cart/CartButton";
import { AnnouncementBar } from "./AnnouncementBar";
import { MobileNav } from "./MobileNav";

export interface SiteHeaderProps {
  announcement?: string | null;
}

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/track", label: "Track Order" },
  { href: "/account", label: "Account" },
];

/** Site header — brand wordmark + responsive nav + cart. */
export function SiteHeader({ announcement }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40">
      {announcement && <AnnouncementBar text={announcement} />}
      <div className="relative border-b border-charcoal/10 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <MobileNav links={NAV} />
            <Link
              href="/"
              className="font-display text-xl font-semibold tracking-wide text-green-deep"
            >
              SAMAAYA
            </Link>
          </div>

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

          <div className="flex items-center gap-4">
            <CartButton />
            <Link
              href="/shop"
              className={buttonClasses("primary", "sm", "hidden sm:inline-flex")}
            >
              Shop
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
