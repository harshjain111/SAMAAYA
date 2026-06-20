import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/data/settings";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default async function CheckoutPage() {
  const settings = await getStoreSettings();
  return (
    <>
      <SiteHeader announcement={settings.announcement_bar} />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-8 text-3xl sm:text-4xl">Almost yours.</h1>
        <CheckoutForm />
      </main>
      <SiteFooter storeName={settings.store_name} />
    </>
  );
}
