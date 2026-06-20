"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart, cartSubtotal } from "@/lib/cart/store";
import { useStoreData, useHydrated } from "@/lib/cart/useStoreData";
import { FreeShippingNudge, buttonClasses } from "@/components/ui";
import { CrossSell } from "./CrossSell";
import { cn } from "@/lib/cn";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

/** Global slide-out cart drawer (PRD §5.4). Mounted once in the root layout. */
export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const closeDrawer = useCart((s) => s.closeDrawer);
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const removeItem = useCart((s) => s.removeItem);
  const data = useStoreData();
  const hydrated = useHydrated();

  const subtotal = cartSubtotal(items);
  const threshold = data?.settings.free_shipping_threshold ?? 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/40 transition-opacity",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-cream shadow-xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
      >
        <header className="flex items-center justify-between border-b border-charcoal/10 px-5 py-4">
          <h2 className="text-lg font-semibold text-green-deep">Your cart</h2>
          <button
            type="button"
            onClick={closeDrawer}
            className="text-2xl leading-none text-charcoal/50 hover:text-charcoal"
            aria-label="Close cart"
          >
            ×
          </button>
        </header>

        {!hydrated || items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-charcoal/60">Your moment&apos;s waiting.</p>
            <Link
              href="/shop"
              onClick={closeDrawer}
              className={buttonClasses("primary", "md")}
            >
              Shop the range
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-4">
                {items.map((i) => (
                  <li key={i.variantId} className="flex gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
                      {i.image && (
                        <Image
                          src={i.image}
                          alt={i.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/product/${i.slug}`}
                        onClick={closeDrawer}
                        className="block truncate text-sm font-medium text-charcoal hover:text-green-deep"
                      >
                        {i.name}
                      </Link>
                      <p className="text-xs text-charcoal/50">{i.weightLabel}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="inline-flex items-center rounded-full border border-charcoal/20">
                          <button
                            type="button"
                            onClick={() => setQty(i.variantId, i.quantity - 1)}
                            className="px-2 text-charcoal/60 hover:text-green-deep"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-xs font-semibold">
                            {i.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty(i.variantId, i.quantity + 1)}
                            className="px-2 text-charcoal/60 hover:text-green-deep"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(i.variantId)}
                          className="text-xs text-charcoal/40 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-green-deep">
                      {inr(i.price * i.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <CrossSell />
              </div>
            </div>

            <footer className="border-t border-charcoal/10 px-5 py-4">
              <div className="mb-3">
                <FreeShippingNudge subtotal={subtotal} threshold={threshold} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-charcoal/70">Subtotal</span>
                <span className="text-lg font-semibold text-green-deep">
                  {inr(subtotal)}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className={cn(buttonClasses("primary", "lg"), "mt-3 w-full")}
              >
                Checkout
              </Link>
              <p className="mt-2 text-center text-xs text-charcoal/50">
                Secure checkout · Packed fresh before dispatch
              </p>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
