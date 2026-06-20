import type { Metadata } from "next";
import Link from "next/link";
import { getServerUser } from "@/lib/auth";
import { getMyOrders } from "@/lib/data/orders";
import { getStoreSettings } from "@/lib/data/settings";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { StatusPill } from "@/components/ui";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

export const metadata: Metadata = {
  title: "Your orders",
  robots: { index: false },
};

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default async function MyOrdersPage() {
  const [user, settings] = await Promise.all([
    getServerUser(),
    getStoreSettings(),
  ]);

  return (
    <>
      <SiteHeader announcement={settings.announcement_bar} />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl">Your orders</h1>

        {!user ? (
          <div className="mt-6 space-y-4">
            <p className="text-charcoal/70">Sign in to see your order history.</p>
            <GoogleSignInButton next="/account/orders" />
          </div>
        ) : (
          <OrdersList />
        )}
      </main>
      <SiteFooter storeName={settings.store_name} />
    </>
  );
}

async function OrdersList() {
  const orders = await getMyOrders();
  if (orders.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-charcoal/10 bg-white p-10 text-center text-charcoal/60">
        No orders yet.{" "}
        <Link href="/shop" className="font-semibold text-amber hover:text-amber-light">
          Shop the range →
        </Link>
      </div>
    );
  }
  return (
    <ul className="mt-8 divide-y divide-charcoal/10 overflow-hidden rounded-2xl border border-charcoal/10 bg-white">
      {orders.map((o) => (
        <li key={o.id}>
          <Link
            href={`/order/${o.order_number}`}
            className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-cream"
          >
            <div>
              <p className="font-medium text-charcoal">{o.order_number}</p>
              <p className="text-sm text-charcoal/50">{fmtDate(o.created_at)}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusPill status={o.status} />
              <span className="font-semibold text-green-deep">{inr(o.total)}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
