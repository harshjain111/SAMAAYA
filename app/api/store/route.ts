import { NextResponse } from "next/server";
import { getActiveProducts } from "@/lib/data/products";
import { getStoreSettings } from "@/lib/data/settings";

export const revalidate = 60;

/**
 * Public store data for client components (cart drawer cross-sell + free-ship
 * threshold). RLS-safe: only active catalog + public settings.
 */
export async function GET() {
  const [products, settings] = await Promise.all([
    getActiveProducts(),
    getStoreSettings(),
  ]);

  return NextResponse.json({
    products,
    settings: {
      shipping_fee: settings.shipping_fee,
      free_shipping_threshold: settings.free_shipping_threshold,
    },
  });
}
