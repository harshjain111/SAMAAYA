import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/data/settings";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { TrackForm } from "@/components/track/TrackForm";

export const metadata: Metadata = {
  title: "Track your order",
  description: "Track your SAMAAYA order by order number and phone or email.",
};

export default async function TrackPage() {
  const settings = await getStoreSettings();
  return (
    <>
      <SiteHeader announcement={settings.announcement_bar} />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl sm:text-4xl">Track your order</h1>
        <p className="mt-3 text-charcoal/70">
          Enter your order number and the phone or email you used at checkout.
        </p>
        <div className="mt-8">
          <TrackForm />
        </div>
      </main>
      <SiteFooter storeName={settings.store_name} />
    </>
  );
}
