"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { getShippingProvider } from "@/lib/shipping";
import { notify, type NotifyOrderInput, type NotifyEvent } from "@/lib/notify";
import { getRazorpay, isRazorpayConfigured } from "@/lib/razorpay";
import type { OrderStatus } from "@/types/database";

const ADMINC = () => createAdminClient();

/** Build the notify payload for an order from its current DB state. */
async function loadNotifyPayload(orderId: string): Promise<NotifyOrderInput | null> {
  const admin = ADMINC();
  const { data: order } = await admin.from("orders").select("*").eq("id", orderId).maybeSingle();
  if (!order) return null;

  const [{ data: items }, customerRes] = await Promise.all([
    admin.from("order_items").select("product_name, weight_label, quantity, line_total").eq("order_id", orderId),
    order.customer_id
      ? admin.from("customers").select("name, email, phone").eq("id", order.customer_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  const customer = customerRes.data as { name?: string; email?: string; phone?: string } | null;
  const addr = (order.shipping_address ?? {}) as { name?: string; phone?: string; email?: string };

  return {
    orderNumber: order.order_number,
    status: order.status,
    total: Number(order.total),
    customerName: customer?.name ?? addr.name ?? null,
    email: customer?.email ?? addr.email ?? null,
    phone: customer?.phone ?? addr.phone ?? null,
    courier: order.courier,
    awbNumber: order.awb_number,
    trackingUrl: order.tracking_url,
    items: (items ?? []).map((i) => ({
      productName: i.product_name,
      weightLabel: i.weight_label,
      quantity: i.quantity,
      lineTotal: Number(i.line_total),
    })),
  };
}

function revalidateOrder(id: string) {
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin");
}

/** Change fulfillment status; logs history; fires notify on shipped/delivered. */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  note?: string,
) {
  await requireAdmin();
  const admin = ADMINC();
  const { error } = await admin.from("orders").update({ status }).eq("id", orderId);
  if (error) throw new Error(error.message);

  await admin.from("order_status_history").insert({
    order_id: orderId,
    status,
    note: note || `Marked ${status}`,
  });

  if (status === "shipped" || status === "delivered") {
    const payload = await loadNotifyPayload(orderId);
    if (payload) await notify(status as NotifyEvent, payload);
  }

  revalidateOrder(orderId);
  return { ok: true };
}

/** Save courier/AWB/tracking via the shipping provider (manual at launch). */
export async function saveShipping(
  orderId: string,
  input: { courier: string; awbNumber: string; trackingUrl: string },
) {
  await requireAdmin();
  const admin = ADMINC();

  const { data: order } = await admin
    .from("orders")
    .select("order_number, shipping_address")
    .eq("id", orderId)
    .maybeSingle();
  if (!order) throw new Error("Order not found.");

  const addr = (order.shipping_address ?? {}) as Record<string, string>;
  const result = await getShippingProvider().createShipment({
    orderNumber: order.order_number,
    address: {
      line1: addr.line1 ?? "",
      city: addr.city ?? "",
      state: addr.state ?? "",
      pincode: addr.pincode ?? "",
    },
    courier: input.courier,
    awbNumber: input.awbNumber,
    trackingUrl: input.trackingUrl,
  });

  const { error } = await admin
    .from("orders")
    .update({
      courier: result.courier,
      awb_number: result.awbNumber,
      tracking_url: result.trackingUrl,
    })
    .eq("id", orderId);
  if (error) throw new Error(error.message);

  await admin.from("order_status_history").insert({
    order_id: orderId,
    status: "shipped",
    note: "Shipping details saved",
  });

  revalidateOrder(orderId);
  return { ok: true };
}

export async function saveOrderNotes(orderId: string, notes: string) {
  await requireAdmin();
  const admin = ADMINC();
  const { error } = await admin.from("orders").update({ notes }).eq("id", orderId);
  if (error) throw new Error(error.message);
  revalidateOrder(orderId);
  return { ok: true };
}

/** Full refund via Razorpay, then mark refunded. */
export async function refundOrder(orderId: string) {
  await requireAdmin();
  if (!isRazorpayConfigured()) throw new Error("Razorpay is not configured.");
  const admin = ADMINC();

  const { data: order } = await admin
    .from("orders")
    .select("razorpay_payment_id, payment_status")
    .eq("id", orderId)
    .maybeSingle();
  if (!order) throw new Error("Order not found.");
  if (order.payment_status !== "paid") throw new Error("Only paid orders can be refunded.");
  if (!order.razorpay_payment_id) throw new Error("No payment id on this order.");

  try {
    await getRazorpay().payments.refund(order.razorpay_payment_id, {});
  } catch (e) {
    throw new Error(e instanceof Error ? `Refund failed: ${e.message}` : "Refund failed.");
  }

  await admin
    .from("orders")
    .update({ payment_status: "refunded", status: "refunded" })
    .eq("id", orderId);
  await admin.from("order_status_history").insert({
    order_id: orderId,
    status: "refunded",
    note: "Refund issued via Razorpay",
  });

  revalidateOrder(orderId);
  return { ok: true };
}
