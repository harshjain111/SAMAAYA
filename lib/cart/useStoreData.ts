"use client";

import { useEffect, useState } from "react";
import type { ProductListItem } from "@/lib/data/products";

export interface StoreData {
  products: ProductListItem[];
  settings: { shipping_fee: number; free_shipping_threshold: number };
}

// Module-level cache so every cart component shares ONE fetch.
let cache: StoreData | null = null;
let inflight: Promise<StoreData> | null = null;

async function load(): Promise<StoreData> {
  if (cache) return cache;
  if (!inflight) {
    inflight = fetch("/api/store")
      .then((r) => r.json())
      .then((d: StoreData) => {
        cache = d;
        return d;
      })
      .catch(() => ({
        products: [],
        settings: { shipping_fee: 0, free_shipping_threshold: 0 },
      }))
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

/** Client hook for public store data (cross-sell list + shipping settings). */
export function useStoreData(): StoreData | null {
  const [data, setData] = useState<StoreData | null>(cache);
  useEffect(() => {
    let active = true;
    load().then((d) => active && setData(d));
    return () => {
      active = false;
    };
  }, []);
  return data;
}

/** True once mounted on the client — guards against hydration mismatch. */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
