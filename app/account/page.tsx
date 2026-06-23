import type { Metadata } from "next";
import Link from "next/link";
import { getServerUser } from "@/lib/auth";
import { getStoreSettings } from "@/lib/data/settings";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { EmailPasswordForm } from "@/components/auth/EmailPasswordForm";
import { SignOutButton } from "@/components/auth/SignOutButton";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false },
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const [{ next }, user, settings] = await Promise.all([
    searchParams,
    getServerUser(),
    getStoreSettings(),
  ]);
  const dest = next && next.startsWith("/") ? next : "/account";

  return (
    <>
      <SiteHeader announcement={settings.announcement_bar} />
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="text-3xl">Account</h1>

        {user ? (
          <div className="mt-6 space-y-4">
            <p className="text-charcoal/70">
              Signed in as{" "}
              <span className="font-medium text-charcoal">{user.email}</span>
            </p>
            <Link
              href="/account/orders"
              className="inline-block font-semibold text-amber hover:text-amber-light"
            >
              View your orders →
            </Link>
            <div className="pt-2">
              <SignOutButton />
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            <p className="text-charcoal/70">
              Sign in or create an account to see your order history. You never
              need an account to buy — guest checkout is always available.
            </p>
            <GoogleSignInButton next={dest === "/account" ? "/account/orders" : dest} />

            <div className="flex items-center gap-3 text-xs text-charcoal/40">
              <span className="h-px flex-1 bg-charcoal/10" /> or use email{" "}
              <span className="h-px flex-1 bg-charcoal/10" />
            </div>
            <EmailPasswordForm next={dest === "/account" ? "/account/orders" : dest} />

            <p className="text-sm text-charcoal/50">
              Just want to track an order?{" "}
              <Link href="/track" className="font-medium text-green-deep underline">
                Track by order number
              </Link>
            </p>
          </div>
        )}
      </main>
      <SiteFooter storeName={settings.store_name} />
    </>
  );
}
