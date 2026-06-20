import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface CartLineInput {
  variantId: string;
  quantity: number;
}

export interface PricedLine {
  variantId: string;
  productName: string;
  weightLabel: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface PricedOrder {
  lines: PricedLine[];
  subtotal: number;
  shippingFee: number;
  total: number;
}

export class CheckoutError extends Error {}

/**
 * Recompute the order ENTIRELY from the DB — never trust client prices
 * (CLAUDE.md, PRD §5.6). Validates each variant is active and in stock, prices
 * from product_variants, and applies shipping from store_settings.
 */
export async function priceOrder(items: CartLineInput[]): Promise<PricedOrder> {
  if (!items.length) throw new CheckoutError("Your cart is empty.");

  const admin = createAdminClient();
  const ids = [...new Set(items.map((i) => i.variantId))];

  const { data: variants, error } = await admin
    .from("product_variants")
    .select("id, label, price, stock_qty, active, products(name, active)")
    .in("id", ids);

  if (error) throw new CheckoutError("Could not load cart items.");

  const byId = new Map(
    (variants ?? []).map((v) => [v.id as string, v]),
  );

  const lines: PricedLine[] = [];
  for (const item of items) {
    const v = byId.get(item.variantId);
    const qty = Math.max(1, Math.floor(item.quantity));
    // products may come back as an object or array depending on the relation.
    const product = Array.isArray(v?.products) ? v?.products[0] : v?.products;

    if (!v || !v.active || !product?.active) {
      throw new CheckoutError("An item in your cart is no longer available.");
    }
    if (v.stock_qty < qty) {
      throw new CheckoutError(
        `Only ${v.stock_qty} of "${product.name} (${v.label})" left in stock.`,
      );
    }
    const unitPrice = Number(v.price);
    lines.push({
      variantId: v.id,
      productName: product.name,
      weightLabel: v.label,
      unitPrice,
      quantity: qty,
      lineTotal: unitPrice * qty,
    });
  }

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);

  const { data: settings } = await admin
    .from("store_settings")
    .select("shipping_fee, free_shipping_threshold")
    .limit(1)
    .maybeSingle();

  const fee = Number(settings?.shipping_fee ?? 0);
  const threshold = Number(settings?.free_shipping_threshold ?? 0);
  const shippingFee = threshold > 0 && subtotal >= threshold ? 0 : fee;

  return {
    lines,
    subtotal,
    shippingFee,
    total: subtotal + shippingFee,
  };
}
