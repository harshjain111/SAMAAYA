"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/** A line in the cart. variantId is product_variants.id (the source of truth). */
export interface CartItem {
  variantId: string;
  productId: string;
  slug: string;
  name: string;
  weightLabel: string;
  price: number; // unit price snapshot (display only; checkout recomputes server-side)
  mrp?: number | null;
  image?: string | null;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (variantId: string) => void;
  setQty: (variantId: string, qty: number) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      addItem: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.variantId === item.variantId,
          );
          const items = existing
            ? state.items.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + qty }
                  : i,
              )
            : [...state.items, { ...item, quantity: qty }];
          return { items, isOpen: true };
        }),

      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        })),

      setQty: (variantId, qty) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.variantId === variantId
                ? { ...i, quantity: Math.max(0, qty) }
                : i,
            )
            .filter((i) => i.quantity > 0),
        })),

      clear: () => set({ items: [] }),
      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),
    }),
    { name: "samaaya-cart", partialize: (s) => ({ items: s.items }) },
  ),
);

/** Derived selectors (call inside components). */
export const cartCount = (items: CartItem[]) =>
  items.reduce((n, i) => n + i.quantity, 0);
export const cartSubtotal = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.price * i.quantity, 0);
