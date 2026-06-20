import type { Metadata } from "next";
import Link from "next/link";
import { getServerUser } from "@/lib/auth";
import { getStoreSettings } from "@/lib/data/settings";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { SignOutButton } from "@/components/auth/SignOutButton";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false },
};

export default async function AccountPage() {
  const [user, settings] = await Promise.all([
    getServerUser(),
    getStoreSettings(),
  ]);

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
              Sign in to see your order history. You never need an account to buy
              — guest checkout is always available.
            </p>
            <GoogleSignInButton next="/account/orders" />
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
