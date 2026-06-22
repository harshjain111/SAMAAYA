import Link from "next/link";
import { ProductCard, Icon } from "@/components/ui";
import { SectionHeading } from "./SectionHeading";
import type { ProductListItem } from "@/lib/data/products";

export interface ShopTheRangeProps {
  products: ProductListItem[];
}

/**
 * Section 4 — Shop the Range (copy deck §4). All active products, shoppable
 * inline from the homepage. Add-to-cart is wired in Prompt 2.1.
 */
export function ShopTheRange({ products }: ShopTheRangeProps) {
  return (
    <section id="shop" className="scroll-mt-24 bg-cream">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="Shop the range"
          title="Pick your moment."
          subtitle="Each one sourced from a specific estate, chosen for a specific mood. All packed fresh, all shipped across India."
        />

        {products.length === 0 ? (
          <p className="mt-12 text-center text-charcoal/60">
            Our teas are being freshly stocked. Check back soon.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
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

        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 rounded-full border border-green-deep/30 px-5 py-2.5 text-sm font-semibold text-green-deep transition-colors hover:border-green-deep hover:bg-green-deep hover:text-cream"
          >
            View all teas
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
