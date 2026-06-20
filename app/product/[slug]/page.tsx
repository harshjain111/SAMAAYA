import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getProductBySlug,
  getAllProductSlugs,
  getRelatedProducts,
} from "@/lib/data/products";
import { getStoreSettings } from "@/lib/data/settings";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ProductCard, StrengthMeter } from "@/components/ui";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductBuyBox } from "@/components/product/ProductBuyBox";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Tea not found" };

  const description =
    product.tastingNote ||
    product.description ||
    `${product.name} — fresh-to-cup Assam tea from SAMAAYA.`;
  const image = product.images[0]?.url;

  return {
    title: product.name,
    description,
    openGraph: {
      title: `${product.name} · SAMAAYA`,
      description,
      images: image ? [{ url: image }] : undefined,
      type: "website",
    },
  };
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, settings] = await Promise.all([
    getRelatedProducts(product),
    getStoreSettings(),
  ]);

  // Product JSON-LD (SEO — PRD §7).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.tastingNote || undefined,
    image: product.images.map((i) => i.url),
    brand: { "@type": "Brand", name: "SAMAAYA" },
    offers: product.variants.map((v) => ({
      "@type": "Offer",
      name: v.label,
      price: v.price,
      priceCurrency: "INR",
      availability:
        v.stockQty > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${siteUrl}/product/${product.slug}`,
    })),
  };

  return (
    <>
      <SiteHeader announcement={settings.announcement_bar} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="mx-auto max-w-6xl px-6 pb-28 pt-8 sm:pb-12">
        <nav className="mb-6 text-sm text-charcoal/50">
          <Link href="/shop" className="hover:text-green-deep">
            Shop
          </Link>{" "}
          / <span className="text-charcoal/70">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Gallery */}
          <ProductGallery images={product.images} name={product.name} />

          {/* Info + buy */}
          <div>
            <h1 className="text-3xl sm:text-4xl">{product.name}</h1>
            {product.tastingNote && (
              <p className="mt-2 text-lg text-charcoal/70">
                {product.tastingNote}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-4">
              {typeof product.strength === "number" && (
                <StrengthMeter strength={product.strength} />
              )}
              {product.originRegion && (
                <span className="text-sm text-charcoal/60">
                  📍 {product.originRegion}
                </span>
              )}
            </div>

            <div className="mt-6">
              <ProductBuyBox product={product} />
            </div>
          </div>
        </div>

        {/* Description / story */}
        {(product.description || product.story) && (
          <section className="mt-16 max-w-3xl">
            {product.description && (
              <p className="text-charcoal/80">{product.description}</p>
            )}
            {product.story && (
              <p className="mt-4 text-charcoal/70">{product.story}</p>
            )}
          </section>
        )}

        {/* Brew guide */}
        <section className="mt-12 max-w-3xl rounded-2xl bg-cream p-8">
          <h2 className="text-2xl">Brew it right.</h2>
          <ol className="mt-4 space-y-2 text-charcoal/80">
            <li>1. Heat water to {product.brewTemp || "the right temperature"}</li>
            <li>2. Use one teaspoon per cup</li>
            <li>3. Steep for {product.brewTime || "a few"} minutes</li>
            <li>4. Add milk or take it neat — your moment, your rules.</li>
          </ol>
          {product.originRegion && (
            <p className="mt-6 text-sm text-green-leaf">
              This batch came straight from {product.originRegion}, packed soon
              after sourcing — so what&apos;s in your cup is still close to the
              garden.
            </p>
          )}
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl">You may also like</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  productId={p.id}
                  name={p.name}
                  slug={p.slug}
                  tastingNote={p.tastingNote}
                  strength={p.strength}
                  image={p.image}
                  variants={p.variants}
                />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter storeName={settings.store_name} />
    </>
  );
}
