import Link from "next/link";
import { ProductCard } from "@/components/ui";
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
    <section id="shop" className="scroll-mt-24 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl">Pick your moment.</h2>
          <p className="mx-auto mt-3 max-w-xl text-charcoal/70">
            Each one sourced from a specific estate, chosen for a specific mood.
            All packed fresh, all shipped across India.
          </p>
        </div>

        {products.length === 0 ? (
          <p className="mt-12 text-center text-charcoal/60">
            Our teas are being freshly stocked. Check back soon.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <ProductCard
                key={p.id}
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

        <div className="mt-10 text-center">
          <Link
            href="/shop"
            className="text-sm font-semibold text-amber hover:text-amber-light"
          >
            View all teas →
          </Link>
        </div>
      </div>
    </section>
  );
}
