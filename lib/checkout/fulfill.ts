import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { notify, type NotifyOrderInput } from "@/lib/notify";

/**
 * Mark an order paid, decrement stock, log history, and fire confirmation
 * notifications. IDEMPOTENT — safe to call from both the client verify step and
 * the Razorpay webhook; the second caller is a no-op. Stock is only decremented
 * on the first transition to paid.
 */
export async function fulfillPaidOrder(opts: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  paymentMethod?: string | null;
}): Promise<{ orderNumber: string } | null> {
  const admin = createAdminClient();

  const { data: order } = await admin
    .from("orders")
    .select("*")
    .eq("razorpay_order_id", opts.razorpayOrderId)
    .maybeSingle();

  if (!order) return null;

  // Already fulfilled → idempotent return.
  if (order.payment_status === "paid") {
    return { orderNumber: order.order_number };
  }

  // Flip to paid.
  await admin
    .from("orders")
    .update({
      payment_status: "paid",
      razorpay_payment_id: opts.razorpayPaymentId,
      payment_method: opts.paymentMethod ?? order.payment_method,
    })
    .eq("id", order.id);

  // Load items (snapshots taken at order creation).
  const { data: items } = await admin
    .from("order_items")
    .select("variant_id, product_name, weight_label, unit_price, quantity, line_total")
    .eq("order_id", order.id);

  // Decrement stock (only now, on first payment).
  for (const it of items ?? []) {
    if (!it.variant_id) continue;
    const { data: v } = await admin
      .from("product_variants")
      .select("stock_qty")
      .eq("id", it.variant_id)
      .maybeSingle();
    if (v) {
      await admin
        .from("product_variants")
        .update({ stock_qty: Math.max(0, v.stock_qty - it.quantity) })
        .eq("id", it.variant_id);
    }
  }

  await admin.from("order_status_history").insert({
    order_id: order.id,
    status: order.status,
    note: "Payment received",
  });

  // Customer contact for notifications.
  const { data: customer } = order.customer_id
    ? await admin
        .from("customers")
        .select("name, email, phone")
        .eq("id", order.customer_id)
        .maybeSingle()
    : { data: null };

  const addr = (order.shipping_address ?? {}) as {
    name?: string;
    phone?: string;
  };

  const payload: NotifyOrderInput = {
    orderNumber: order.order_number,
    status: order.status,
    total: Number(order.total),
    customerName: customer?.name ?? addr.name ?? null,
    email: customer?.email ?? null,
    phone: customer?.phone ?? addr.phone ?? null,
    items: (items ?? []).map((it) => ({
      productName: it.product_name,
      weightLabel: it.weight_label,
      quantity: it.quantity,
      lineTotal: Number(it.line_total),
    })),
  };

  // Fire-and-await; channels never throw.
  await notify("payment_received", payload);
  await notify("order_confirmed", payload);

  return { orderNumber: order.order_number };
}
