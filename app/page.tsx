import { getActiveProducts } from "@/lib/data/products";
import { getStoreSettings } from "@/lib/data/settings";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { FreshDifference } from "@/components/home/FreshDifference";
import { ShopTheRange } from "@/components/home/ShopTheRange";
import { FindYourMoment } from "@/components/home/FindYourMoment";
import { EstateToCup } from "@/components/home/EstateToCup";
import { SamaayaStory } from "@/components/home/SamaayaStory";
import { SocialProofBulkContact } from "@/components/home/SocialProofBulkContact";

// Re-fetch periodically so admin catalog/setting changes surface without redeploy.
export const revalidate = 60;

export default async function Home() {
  const [products, settings] = await Promise.all([
    getActiveProducts(),
    getStoreSettings(),
  ]);

  const priceFrom = products.length
    ? Math.min(...products.map((p) => p.priceFrom))
    : undefined;

  return (
    <>
      <SiteHeader announcement={settings.announcement_bar} />
      <main>
        <Hero priceFrom={priceFrom} />
        <TrustStrip />
        <FreshDifference />
        <ShopTheRange products={products} />
        <FindYourMoment />
        <EstateToCup />
        <SamaayaStory />
        <SocialProofBulkContact
          whatsappNumber={settings.whatsapp_number}
          contactEmail={settings.contact_email}
        />
      </main>
      <SiteFooter storeName={settings.store_name} />
    </>
  );
}
