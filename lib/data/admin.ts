import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";
import type { Order } from "@/types/database";

export interface LowStockVariant {
  id: string;
  label: string;
  stock_qty: number;
  productName: string;
  productSlug: string;
  productId: string;
}

export interface DashboardData {
  todayOrders: number;
  pendingFulfillment: number;
  revenue: { today: number; week: number; month: number };
  lowStock: LowStockVariant[];
  recentOrders: Order[];
}

/**
 * Dashboard metrics (PRD §5.9). Uses the service-role client — the /admin
 * layout already gates access to admins, so reads here are trusted.
 */
export async function getDashboardData(): Promise<DashboardData> {
  const admin = createAdminClient();

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Paid orders in the last 30 days → bucket revenue in JS.
  const { data: paid } = await admin
    .from("orders")
    .select("total, created_at")
    .eq("payment_status", "paid")
    .gte("created_at", monthAgo.toISOString());

  const revenue = { today: 0, week: 0, month: 0 };
  for (const o of paid ?? []) {
    const t = Number(o.total);
    const created = new Date(o.created_at);
    revenue.month += t;
    if (created >= weekAgo) revenue.week += t;
    if (created >= startOfToday) revenue.today += t;
  }

  // Today's orders (any status).
  const { count: todayOrders } = await admin
    .from("orders")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startOfToday.toISOString());

  // Pending fulfillment: paid but not yet shipped/delivered/cancelled/refunded.
  const { count: pendingFulfillment } = await admin
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("payment_status", "paid")
    .in("status", ["new", "confirmed", "packed"]);

  // Low stock variants.
  const { data: lowRaw } = await admin
    .from("product_variants")
    .select("id, label, stock_qty, product_id, products(name, slug)")
    .eq("active", true)
    .lte("stock_qty", LOW_STOCK_THRESHOLD)
    .order("stock_qty", { ascending: true });

  const lowStock: LowStockVariant[] = (lowRaw ?? []).map((v) => {
    const product = Array.isArray(v.products) ? v.products[0] : v.products;
    return {
      id: v.id as string,
      label: v.label as string,
      stock_qty: v.stock_qty as number,
      productName: product?.name ?? "—",
      productSlug: product?.slug ?? "",
      productId: v.product_id as string,
    };
  });

  // Recent orders.
  const { data: recent } = await admin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  return {
    todayOrders: todayOrders ?? 0,
    pendingFulfillment: pendingFulfillment ?? 0,
    revenue,
    lowStock,
    recentOrders: (recent ?? []) as Order[],
  };
}
