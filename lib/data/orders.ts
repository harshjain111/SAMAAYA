import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Order } from "@/types/database";

export interface OrderItemRow {
  product_name: string;
  weight_label: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}
export interface OrderHistoryRow {
  status: string;
  note: string | null;
  created_at: string;
}
export interface OrderDetails {
  order: Order;
  items: OrderItemRow[];
  history: OrderHistoryRow[];
}

/**
 * Full order by number (admin read — used by the confirmation page and, after
 * contact verification, by /track). The order number is the access key for the
 * confirmation view; /track additionally verifies phone/email before showing.
 */
export async function getOrderByNumber(
  orderNumber: string,
): Promise<OrderDetails | null> {
  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .maybeSingle();
  if (!order) return null;

  const [{ data: items }, { data: history }] = await Promise.all([
    admin
      .from("order_items")
      .select("product_name, weight_label, unit_price, quantity, line_total")
      .eq("order_id", order.id),
    admin
      .from("order_status_history")
      .select("status, note, created_at")
      .eq("order_id", order.id)
      .order("created_at", { ascending: true }),
  ]);

  return {
    order: order as Order,
    items: (items ?? []) as OrderItemRow[],
    history: (history ?? []) as OrderHistoryRow[],
  };
}

const last10 = (s: string) => s.replace(/\D/g, "").slice(-10);

/**
 * Verify a guest's order by number + phone OR email (matched against the
 * shipping_address snapshot). Returns the order only on a match. Used by /track.
 */
export async function getVerifiedOrder(
  orderNumber: string,
  contact: string,
): Promise<OrderDetails | null> {
  const details = await getOrderByNumber(orderNumber);
  if (!details) return null;

  const addr = (details.order.shipping_address ?? {}) as {
    phone?: string;
    email?: string;
  };
  const c = contact.trim().toLowerCase();
  const phoneMatch = addr.phone ? last10(addr.phone) === last10(contact) : false;
  const emailMatch = addr.email ? addr.email.toLowerCase() === c : false;

  return phoneMatch || emailMatch ? details : null;
}

/**
 * The current user's orders (RLS restricts to their own via auth_user_id).
 * Guests have none — they track via /track (Prompt 2.4).
 */
export async function getMyOrders(): Promise<Order[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[getMyOrders]", error.message);
    return [];
  }
  return (data ?? []) as Order[];
}
