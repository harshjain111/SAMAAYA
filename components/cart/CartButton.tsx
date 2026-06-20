"use client";

import { useCart, cartCount } from "@/lib/cart/store";
import { useHydrated } from "@/lib/cart/useStoreData";

/** Header cart button — opens the drawer, shows live item count. */
export function CartButton() {
  const items = useCart((s) => s.items);
  const openDrawer = useCart((s) => s.openDrawer);
  const hydrated = useHydrated();
  const count = hydrated ? cartCount(items) : 0;

  return (
    <button
      type="button"
      onClick={openDrawer}
      className="relative flex items-center gap-1.5 text-sm font-medium text-charcoal/80 transition-colors hover:text-green-deep"
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
    >
      Cart
      {count > 0 && (
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber px-1.5 text-xs font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}
