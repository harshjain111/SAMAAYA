import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { fulfillPaidOrder } from "@/lib/checkout/fulfill";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Razorpay webhook — the SOURCE OF TRUTH for payment state (PRD §5.6).
 * Verifies the webhook signature against the raw body, then fulfills on
 * payment.captured (idempotent) or marks failed on payment.failed.
 *
 * Configure in Razorpay Dashboard → Webhooks:
 *   URL: https://<your-domain>/api/webhooks/razorpay
 *   Secret: RAZORPAY_WEBHOOK_SECRET
 *   Events: payment.captured, payment.failed
 */
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let event: {
    event: string;
    payload?: { payment?: { entity?: { order_id?: string; id?: string; method?: string } } };
  };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const payment = event.payload?.payment?.entity;

  if (event.event === "payment.captured" && payment?.order_id && payment.id) {
    await fulfillPaidOrder({
      razorpayOrderId: payment.order_id,
      razorpayPaymentId: payment.id,
      paymentMethod: payment.method ?? null,
    });
  } else if (event.event === "payment.failed" && payment?.order_id) {
    const admin = createAdminClient();
    await admin
      .from("orders")
      .update({ payment_status: "failed" })
      .eq("razorpay_order_id", payment.order_id)
      .eq("payment_status", "pending");
  }

  // Always 200 so Razorpay doesn't retry a handled event.
  return NextResponse.json({ received: true });
}
