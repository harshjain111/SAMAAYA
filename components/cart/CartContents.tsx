"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart, cartSubtotal } from "@/lib/cart/store";
import { useStoreData, useHydrated } from "@/lib/cart/useStoreData";
import { FreeShippingNudge, buttonClasses } from "@/components/ui";
import { CrossSell } from "./CrossSell";
import { cn } from "@/lib/cn";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

/** Full cart page contents (PRD §5.4). */
export function CartContents() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const removeItem = useCart((s) => s.removeItem);
  const data = useStoreData();
  const hydrated = useHydrated();

  const subtotal = cartSubtotal(items);
  const threshold = data?.settings.free_shipping_threshold ?? 0;
  const shippingFee = data?.settings.shipping_fee ?? 0;
  const shipping = threshold > 0 && subtotal >= threshold ? 0 : shippingFee;
  const total = subtotal + (items.length ? shipping : 0);

  if (!hydrated) {
    return <p className="py-20 text-center text-charcoal/50">Loading your cart…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-lg text-charcoal/60">Your moment&apos;s waiting.</p>
        <Link href="/shop" className={buttonClasses("primary", "md")}>
          Shop the range
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
      {/* Items */}
      <ul className="divide-y divide-charcoal/10">
        {items.map((i) => (
          <li key={i.variantId} className="flex gap-4 py-5">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream">
              {i.image && (
                <Image
                  src={i.image}
                  alt={i.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <Link
                href={`/product/${i.slug}`}
                className="font-medium text-charcoal hover:text-green-deep"
              >
                {i.name}
              </Link>
              <p className="text-sm text-charcoal/50">{i.weightLabel}</p>
              <div className="mt-auto flex items-center gap-3 pt-2">
                <div className="inline-flex items-center rounded-full border border-charcoal/20">
                  <button
                    type="button"
                    onClick={() => setQty(i.variantId, i.quantity - 1)}
                    className="px-3 py-1 text-charcoal/60 hover:text-green-deep"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">
                    {i.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(i.variantId, i.quantity + 1)}
                    className="px-3 py-1 text-charcoal/60 hover:text-green-deep"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(i.variantId)}
                  className="text-sm text-charcoal/40 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="font-semibold text-green-deep">
              {inr(i.price * i.quantity)}
            </p>
          </li>
        ))}
      </ul>

      {/* Summary */}
      <aside className="h-fit rounded-2xl border border-charcoal/10 bg-white p-6">
        <h2 className="text-lg font-semibold text-green-deep">Order summary</h2>
        <div className="mt-4">
          <FreeShippingNudge subtotal={subtotal} threshold={threshold} />
        </div>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-charcoal/70">Subtotal</dt>
            <dd className="font-medium">{inr(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-charcoal/70">Estimated shipping</dt>
            <dd className="font-medium">
              {shipping === 0 ? "Free" : inr(shipping)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-charcoal/10 pt-2 text-base">
            <dt className="font-semibold">Total</dt>
            <dd className="font-semibold text-green-deep">{inr(total)}</dd>
          </div>
        </dl>
        <Link
          href="/checkout"
          className={cn(buttonClasses("primary", "lg"), "mt-5 w-full")}
        >
          Checkout
        </Link>
        <p className="mt-2 text-center text-xs text-charcoal/50">
          Final price calculated securely at checkout.
        </p>

        <div className="mt-8">
          <CrossSell />
        </div>
      </aside>
    </div>
  );
}
