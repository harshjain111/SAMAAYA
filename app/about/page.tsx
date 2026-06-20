import type { Metadata } from "next";
import Link from "next/link";
import { getStoreSettings } from "@/lib/data/settings";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { buttonClasses } from "@/components/ui";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "We don't have a hundred years of history. We have something better — fresh tea, from Assam's finest estates.",
};

export const revalidate = 3600;

export default async function AboutPage() {
  const settings = await getStoreSettings();
  return (
    <>
      <SiteHeader announcement={settings.announcement_bar} />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-3xl sm:text-4xl">
          We don&apos;t have a hundred years of history. We have something better
          — fresh tea.
        </h1>
        <div className="mt-8 space-y-4 text-charcoal/80">
          <p>SAMAAYA exists for one reason: we believe the tea you drink should be fresh.</p>
          <p>
            It sounds obvious. But most tea on the market is anything but. It&apos;s
            harvested, then warehoused for a year or two, blended down for shelf-life
            and sameness, and finally shipped to you long after it lost its best self.
            We thought that was worth fixing.
          </p>
          <p>
            We&apos;re not a legacy brand, and we don&apos;t pretend to be. What we did
            instead was put in the work — travelling across Assam&apos;s tea gardens,
            cupping batch after batch, studying what makes one cup unforgettable and
            another forgettable. We obsessed over the one variable the big brands
            ignore: time. Because the fresher the tea, the truer it tastes.
          </p>
          <p>
            Assam grows some of the most celebrated tea in the world. Our job is simple
            — get it to you while it&apos;s still at its peak, and never get in the way
            of what the garden already did right.
          </p>
          <p>
            Every pack of SAMAAYA is sourced from the finest estates, packed fresh, and
            shipped fast. No middlemen. No long storage. No compromise.
          </p>
          <p>
            Because the right tea, at the right moment, isn&apos;t a luxury. It&apos;s
            just how it should always have been.
          </p>
        </div>
        <Link href="/shop" className={`${buttonClasses("primary", "md")} mt-8`}>
          Find your moment →
        </Link>
      </main>
      <SiteFooter storeName={settings.store_name} />
    </>
  );
}
