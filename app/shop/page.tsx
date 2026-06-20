import type { Metadata } from "next";
import { getActiveProducts } from "@/lib/data/products";
import { getStoreSettings } from "@/lib/data/settings";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ProductCard } from "@/components/ui";
import { ShopFilters } from "@/components/shop/ShopFilters";
import type { Moment } from "@/types/database";

export const metadata: Metadata = {
  title: "Shop fresh Assam tea",
  description:
    "Browse SAMAAYA's fresh-to-cup Assam teas. Filter by moment and strength. Packed fresh, shipped across India.",
};

export const revalidate = 60;

const MOMENTS = ["morning", "afternoon", "evening"];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ moment?: string; strength?: string }>;
}) {
  const sp = await searchParams;
  const moment = MOMENTS.includes(sp.moment ?? "") ? (sp.moment as Moment) : undefined;
  const strength = sp.strength && /^[1-5]$/.test(sp.strength) ? Number(sp.strength) : undefined;

  const [allProducts, settings] = await Promise.all([
    getActiveProducts(moment ? { moment } : undefined),
    getStoreSettings(),
  ]);

  const products = strength
    ? allProducts.filter((p) => p.strength === strength)
    : allProducts;

  return (
    <>
      <SiteHeader announcement={settings.announcement_bar} />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-8">
          <h1 className="text-4xl sm:text-5xl">Shop the range</h1>
          <p className="mt-3 max-w-xl text-charcoal/70">
            Each one sourced from a specific estate, chosen for a specific mood.
            All packed fresh, all shipped across India.
          </p>
        </header>

        <ShopFilters moment={sp.moment} strength={sp.strength} />

        <p className="mt-6 text-sm text-charcoal/50">
          {products.length} {products.length === 1 ? "tea" : "teas"}
        </p>

        {products.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-charcoal/10 bg-white p-10 text-center text-charcoal/60">
            No teas match these filters yet.{" "}
            <a href="/shop" className="font-semibold text-amber hover:text-amber-light">
              Clear filters
            </a>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <ProductCard
                key={p.id}
                productId={p.id}
                name={p.name}
                slug={p.slug}
                tastingNote={p.tastingNote}
                strength={p.strength}
                image={p.image}
                variants={p.variants}
                priority={i < 3}
              />
            ))}
          </div>
        )}
      </main>
      <SiteFooter storeName={settings.store_name} />
    </>
  );
}
