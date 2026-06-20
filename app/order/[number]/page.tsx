import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderByNumber } from "@/lib/data/orders";
import { getStoreSettings } from "@/lib/data/settings";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { OrderDetail } from "@/components/order/OrderDetail";

export const metadata: Metadata = {
  title: "Order confirmation",
  robots: { index: false },
};

export default async function OrderPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const [details, settings] = await Promise.all([
    getOrderByNumber(number),
    getStoreSettings(),
  ]);

  if (!details) notFound();

  const addr = (details.order.shipping_address ?? {}) as { name?: string };
  const paid = details.order.payment_status === "paid";

  return (
    <>
      <SiteHeader announcement={settings.announcement_bar} />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl">
            {paid ? "That's the right moment, ordered." : "Order received"}
          </h1>
          <p className="mt-3 text-charcoal/70">
            {paid ? (
              <>
                Thanks{addr.name ? `, ${addr.name}` : ""}! Your SAMAAYA is being
                packed fresh. We&apos;ll send tracking to your email as soon as
                it ships.
              </>
            ) : (
              <>
                Your order <strong>{details.order.order_number}</strong> is
                awaiting payment confirmation. If you completed payment, this
                page will update shortly.
              </>
            )}
          </p>
        </div>

        <OrderDetail details={details} />
      </main>
      <SiteFooter storeName={settings.store_name} />
    </>
  );
}
