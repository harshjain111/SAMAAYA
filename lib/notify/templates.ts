/**
 * Message templates per event. Plain, warm, SAMAAYA voice (copy deck). Used by
 * both the email channel and the manual WhatsApp helper so messaging stays
 * consistent across channels.
 */
import type { NotifyEvent, NotifyOrderInput } from "./types";

const inr = (n: number) =>
  `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

function greeting(order: NotifyOrderInput) {
  const name = order.customerName?.trim();
  return name ? `Hi ${name},` : "Hi,";
}

function itemLines(order: NotifyOrderInput): string {
  if (!order.items?.length) return "";
  return order.items
    .map(
      (i) =>
        `• ${i.productName} (${i.weightLabel}) × ${i.quantity} — ${inr(i.lineTotal)}`,
    )
    .join("\n");
}

export interface RenderedMessage {
  subject: string;
  /** Plain text — used directly for WhatsApp and as the email text part. */
  text: string;
}

export function renderMessage(
  event: NotifyEvent,
  order: NotifyOrderInput,
): RenderedMessage {
  const store = order.storeName || "SAMAAYA";
  const items = itemLines(order);
  const itemBlock = items ? `\n\n${items}` : "";
  const total = `\nOrder total: ${inr(order.total)}`;

  switch (event) {
    case "order_confirmed":
      return {
        subject: `${store} — order ${order.orderNumber} confirmed ✅`,
        text:
          `${greeting(order)}\n\nThat's the right moment, ordered. ` +
          `Your ${store} is being packed fresh.\n\nOrder #${order.orderNumber}${itemBlock}${total}\n\n` +
          `We'll send tracking as soon as it ships. Thanks for choosing fresh.`,
      };

    case "payment_received":
      return {
        subject: `${store} — payment received for ${order.orderNumber}`,
        text:
          `${greeting(order)}\n\nWe've received your payment for order ` +
          `#${order.orderNumber}.${total}\n\nIt's now in the queue to be packed fresh and dispatched.`,
      };

    case "shipped": {
      const tracking = order.trackingUrl
        ? `\n\nTrack it here: ${order.trackingUrl}`
        : "";
      const courier =
        order.courier || order.awbNumber
          ? `\nCourier: ${[order.courier, order.awbNumber].filter(Boolean).join(" · ")}`
          : "";
      return {
        subject: `${store} — your order ${order.orderNumber} has shipped 🚚`,
        text:
          `${greeting(order)}\n\nGood news — order #${order.orderNumber} is on its way, ` +
          `packed fresh and dispatched fast.${courier}${tracking}`,
      };
    }

    case "delivered":
      return {
        subject: `${store} — order ${order.orderNumber} delivered`,
        text:
          `${greeting(order)}\n\nYour ${store} order #${order.orderNumber} has been delivered. ` +
          `Brew it right, and enjoy your moment. ☕\n\nFresh tea, the way it should be.`,
      };
  }
}
