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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function Home() {
  const [products, settings] = await Promise.all([
    getActiveProducts(),
    getStoreSettings(),
  ]);

  const priceFrom = products.length
    ? Math.min(...products.map((p) => p.priceFrom))
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: settings.store_name || "SAMAAYA",
        url: siteUrl,
        slogan: "The Right Moment.",
        description:
          "Fresh-to-cup Assam tea. Packed fresh from Assam's finest estates, never warehoused.",
        ...(settings.contact_email
          ? {
              contactPoint: {
                "@type": "ContactPoint",
                email: settings.contact_email,
                contactType: "customer service",
              },
            }
          : {}),
      },
      {
        "@type": "WebSite",
        name: settings.store_name || "SAMAAYA",
        url: siteUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
