"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { buttonClasses } from "@/components/ui";
import { useCart } from "@/lib/cart/store";
import type { ProductDetail } from "@/lib/data/products";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export interface ProductBuyBoxProps {
  product: ProductDetail;
}

/**
 * Size selector + live price + quantity + add-to-cart. Renders an inline box
 * and a sticky bottom bar on mobile (PRD §5.3). Out-of-stock variants are
 * disabled; the button reflects stock.
 */
export function ProductBuyBox({ product }: ProductBuyBoxProps) {
  const addItem = useCart((s) => s.addItem);
  const firstInStock =
    product.variants.find((v) => v.stockQty > 0) ?? product.variants[0];
  const [selected, setSelected] = useState(firstInStock);
  const [qty, setQty] = useState(1);

  const outOfStock = selected.stockQty <= 0;
  const image = product.images[0]?.url ?? null;

  function add() {
    if (outOfStock) return;
    addItem(
      {
        variantId: selected.id ?? `${product.slug}:${selected.label}`,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        weightLabel: selected.label,
        price: selected.price,
        mrp: selected.mrp,
        image,
      },
      qty,
    );
  }

  return (
    <div>
      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-semibold text-green-deep">
          {inr(selected.price)}
        </span>
        {selected.mrp && selected.mrp > selected.price && (
          <span className="text-lg text-charcoal/40 line-through">
            {inr(selected.mrp)}
          </span>
        )}
      </div>

      {/* Size selector */}
      {product.variants.length > 1 && (
        <div className="mt-5">
          <p className="text-sm font-medium text-charcoal/70">Size</p>
          <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Select size">
            {product.variants.map((v) => {
              const active = v.label === selected.label;
              const soldOut = v.stockQty <= 0;
              return (
                <button
                  key={v.id ?? v.label}
                  type="button"
                  disabled={soldOut}
                  onClick={() => setSelected(v)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "border-green-deep bg-green-deep text-white"
                      : "border-charcoal/20 text-charcoal/70 hover:border-green-deep",
                    soldOut && "cursor-not-allowed opacity-40 line-through",
                  )}
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="mt-5">
        <p className="text-sm font-medium text-charcoal/70">Quantity</p>
        <div className="mt-2 inline-flex items-center rounded-full border border-charcoal/20">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-1.5 text-lg text-charcoal/70 hover:text-green-deep"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-semibold">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="px-3 py-1.5 text-lg text-charcoal/70 hover:text-green-deep"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to cart (inline) */}
      <button
        type="button"
        onClick={add}
        disabled={outOfStock}
        className={cn(buttonClasses("primary", "lg"), "mt-6 w-full")}
      >
        {outOfStock ? "Freshly sold out" : "Add to Cart"}
      </button>

      {/* Fresh-packed reassurance */}
      <p className="mt-4 flex items-center gap-2 text-sm text-green-leaf">
        🌱 Packed fresh · never warehoused
      </p>

      {/* Sticky mobile bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-charcoal/10 bg-cream/95 px-4 py-3 backdrop-blur sm:hidden">
        <div>
          <p className="text-xs text-charcoal/60">{selected.label}</p>
          <p className="text-lg font-semibold text-green-deep">
            {inr(selected.price * qty)}
          </p>
        </div>
        <button
          type="button"
          onClick={add}
          disabled={outOfStock}
          className={cn(buttonClasses("primary", "md"), "flex-1")}
        >
          {outOfStock ? "Sold out" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
