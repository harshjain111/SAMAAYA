"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { SignOutButton } from "@/components/auth/SignOutButton";

const LINKS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="flex shrink-0 flex-col border-charcoal/10 bg-white md:h-screen md:w-60 md:border-r">
      <div className="flex items-center justify-between border-b border-charcoal/10 px-5 py-4">
        <Link href="/admin" className="font-display text-lg font-semibold text-green-deep">
          SAMAAYA
        </Link>
        <span className="rounded-full bg-green-deep/10 px-2 py-0.5 text-xs font-semibold text-green-deep">
          Admin
        </span>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 py-3 md:flex-col md:overflow-visible">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive(l.href, l.exact)
                ? "bg-green-deep text-white"
                : "text-charcoal/70 hover:bg-cream",
            )}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto hidden border-t border-charcoal/10 px-5 py-4 md:block">
        <Link
          href="/"
          className="block text-sm text-charcoal/60 hover:text-green-deep"
        >
          ← View store
        </Link>
        <div className="mt-2">
          <SignOutButton />
        </div>
      </div>
    </aside>
  );
}
