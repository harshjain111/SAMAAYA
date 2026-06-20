import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { priceOrder, CheckoutError, type CartLineInput } from "@/lib/checkout/pricing";
import { upsertCustomer } from "@/lib/data/customers";
import { getRazorpay, isRazorpayConfigured } from "@/lib/razorpay";
import { validateCheckout, type ContactInput, type AddressInput } from "@/lib/checkout/validation";

interface CreateBody {
  items: CartLineInput[];
  contact: ContactInput;
  address: AddressInput;
}

/**
 * Create a pending order + Razorpay order. Prices are recomputed server-side
 * from the DB (never trust the client). order_items + shipping_address are
 * snapshotted now. Stock is decremented later, on payment (see fulfill.ts).
 */
export async function POST(req: Request) {
  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      { error: "Payments are not configured yet. Please try again later." },
      { status: 503 },
    );
  }

  let body: CreateBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { items, contact, address } = body;
  const v = validateCheckout(contact, address);
  if (!v.ok) {
    return NextResponse.json({ error: "Please check your details.", fields: v.errors }, { status: 400 });
  }

  // Price from DB.
  let priced;
  try {
    priced = await priceOrder(items);
  } catch (e) {
    const msg = e instanceof CheckoutError ? e.message : "Could not process cart.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const admin = createAdminClient();

  // Link to logged-in user if present; silently create/link customer.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const customerId = await upsertCustomer({
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    authUserId: user?.id ?? null,
  });

  // Unique order number.
  const { data: numData, error: numErr } = await admin.rpc("next_order_number");
  if (numErr || !numData) {
    return NextResponse.json({ error: "Could not generate order number." }, { status: 500 });
  }
  const orderNumber = numData as unknown as string;

  const shippingAddress = {
    name: contact.name,
    phone: contact.phone,
    email: contact.email,
    line1: address.line1,
    line2: address.line2 ?? null,
    city: address.city,
    state: address.state,
    pincode: address.pincode,
  };

  // Create Razorpay order (amount in paise).
  let rzpOrder;
  try {
    rzpOrder = await getRazorpay().orders.create({
      amount: Math.round(priced.total * 100),
      currency: "INR",
      receipt: orderNumber,
      notes: { orderNumber },
    });
  } catch (e) {
    console.error("[checkout/create] razorpay", e);
    return NextResponse.json({ error: "Payment gateway error. Please retry." }, { status: 502 });
  }

  // Insert pending order.
  const { data: order, error: orderErr } = await admin
    .from("orders")
    .insert({
      order_number: orderNumber,
      customer_id: customerId,
      status: "new",
      payment_status: "pending",
      subtotal: priced.subtotal,
      shipping_fee: priced.shippingFee,
      total: priced.total,
      razorpay_order_id: rzpOrder.id,
      shipping_address: shippingAddress,
      source: "web",
    })
    .select("id")
    .single();

  if (orderErr || !order) {
    console.error("[checkout/create] order insert", orderErr?.message);
    return NextResponse.json({ error: "Could not create order." }, { status: 500 });
  }

  // Snapshot line items.
  const { error: itemsErr } = await admin.from("order_items").insert(
    priced.lines.map((l) => ({
      order_id: order.id,
      variant_id: l.variantId,
      product_name: l.productName,
      weight_label: l.weightLabel,
      unit_price: l.unitPrice,
      quantity: l.quantity,
      line_total: l.lineTotal,
    })),
  );
  if (itemsErr) console.error("[checkout/create] items insert", itemsErr.message);

  await admin.from("order_status_history").insert({
    order_id: order.id,
    status: "new",
    note: "Order placed",
  });

  return NextResponse.json({
    orderNumber,
    razorpayOrderId: rzpOrder.id,
    amount: rzpOrder.amount,
    currency: rzpOrder.currency,
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    prefill: { name: contact.name, email: contact.email, contact: contact.phone },
  });
}
