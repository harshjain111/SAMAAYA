"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart/store";
import { useStoreData } from "@/lib/cart/useStoreData";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export interface CrossSellProps {
  limit?: number;
  title?: string;
}

/** "Customers also love…" cross-sell (PRD §5.2). Suggests active products not
 *  already in the cart; one tap adds the entry-size variant. */
export function CrossSell({ limit = 3, title = "Customers also love…" }: CrossSellProps) {
  const data = useStoreData();
  const items = useCart((s) => s.items);
  const addItem = useCart((s) => s.addItem);

  if (!data) return null;
  const inCart = new Set(items.map((i) => i.slug));
  const suggestions = data.products
    .filter((p) => !inCart.has(p.slug) && p.variants.length > 0)
    .slice(0, limit);

  if (suggestions.length === 0) return null;

  return (
    <div>
      <p className="text-sm font-semibold text-charcoal/70">{title}</p>
      <ul className="mt-3 space-y-3">
        {suggestions.map((p) => {
          const v = p.variants[0];
          return (
            <li key={p.id} className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cream">
                {p.image?.url && (
                  <Image
                    src={p.image.url}
                    alt={p.image.alt || p.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-charcoal">
                  {p.name}
                </p>
                <p className="text-xs text-charcoal/50">
                  {v.label} · {inr(v.price)}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  addItem({
                    variantId: v.id ?? `${p.slug}:${v.label}`,
                    productId: p.id,
                    slug: p.slug,
                    name: p.name,
                    weightLabel: v.label,
                    price: v.price,
                    mrp: v.mrp,
                    image: p.image?.url ?? null,
                  })
                }
                className="rounded-full border border-green-deep px-3 py-1 text-xs font-semibold text-green-deep transition-colors hover:bg-green-deep hover:text-white"
              >
                Add
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
