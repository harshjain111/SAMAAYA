import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/data/settings";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CartContents } from "@/components/cart/CartContents";

export const metadata: Metadata = {
  title: "Your cart",
  robots: { index: false },
};

export default async function CartPage() {
  const settings = await getStoreSettings();
  return (
    <>
      <SiteHeader announcement={settings.announcement_bar} />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-8 text-3xl sm:text-4xl">Your cart</h1>
        <CartContents />
      </main>
      <SiteFooter storeName={settings.store_name} />
    </>
  );
}
