import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Order, Customer, OrderStatus, PaymentStatus } from "@/types/database";
import type { OrderItemRow, OrderHistoryRow } from "@/lib/data/orders";

export interface AdminOrderRow {
  id: string;
  order_number: string;
  customerName: string;
  phone: string;
  created_at: string;
  itemCount: number;
  total: number;
  payment_status: string;
  status: string;
  source: string;
}

export interface AdminOrderDetail {
  order: Order;
  items: OrderItemRow[];
  history: OrderHistoryRow[];
  customer: Customer | null;
}

const last10 = (s?: string) => (s ?? "").replace(/\D/g, "").slice(-10);

export async function getAdminOrders(opts?: {
  status?: string;
  payment?: string;
  search?: string;
  from?: string;
  to?: string;
}): Promise<AdminOrderRow[]> {
  const admin = createAdminClient();
  let q = admin
    .from("orders")
    .select(
      "id, order_number, total, payment_status, status, source, created_at, shipping_address, order_items(id)",
    )
    .order("created_at", { ascending: false })
    .limit(500);

  if (opts?.status) q = q.eq("status", opts.status as OrderStatus);
  if (opts?.payment) q = q.eq("payment_status", opts.payment as PaymentStatus);
  if (opts?.from) q = q.gte("created_at", opts.from);
  if (opts?.to) q = q.lte("created_at", opts.to);

  const { data, error } = await q;
  if (error) {
    console.error("[getAdminOrders]", error.message);
    return [];
  }

  let rows = (data ?? []).map((o) => {
    const addr = (o.shipping_address ?? {}) as { name?: string; phone?: string };
    const items = (o.order_items ?? []) as { id: string }[];
    return {
      id: o.id as string,
      order_number: o.order_number as string,
      customerName: addr.name ?? "—",
      phone: addr.phone ?? "",
      created_at: o.created_at as string,
      itemCount: items.length,
      total: Number(o.total),
      payment_status: o.payment_status as string,
      status: o.status as string,
      source: o.source as string,
    } satisfies AdminOrderRow;
  });

  if (opts?.search) {
    const s = opts.search.trim().toLowerCase();
    const sDigits = last10(opts.search);
    rows = rows.filter(
      (r) =>
        r.order_number.toLowerCase().includes(s) ||
        r.customerName.toLowerCase().includes(s) ||
        (sDigits && last10(r.phone) === sDigits),
    );
  }

  return rows;
}

export async function getAdminOrder(id: string): Promise<AdminOrderDetail | null> {
  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!order) return null;

  const [{ data: items }, { data: history }, customerRes] = await Promise.all([
    admin
      .from("order_items")
      .select("product_name, weight_label, unit_price, quantity, line_total")
      .eq("order_id", id),
    admin
      .from("order_status_history")
      .select("status, note, created_at")
      .eq("order_id", id)
      .order("created_at", { ascending: true }),
    order.customer_id
      ? admin.from("customers").select("*").eq("id", order.customer_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  return {
    order: order as Order,
    items: (items ?? []) as OrderItemRow[],
    history: (history ?? []) as OrderHistoryRow[],
    customer: (customerRes.data ?? null) as Customer | null,
  };
}
