import "server-only";
import type {
  NotificationChannel,
  NotifyEvent,
  NotifyOrderInput,
  NotifyResult,
} from "./types";
import { EmailChannel } from "./email";

export type {
  NotifyEvent,
  NotifyOrderInput,
  NotifyItem,
  NotifyResult,
  ChannelResult,
  NotificationChannel,
} from "./types";
export { buildWhatsAppUrl, normalizePhoneForWa } from "./whatsapp";
export { renderMessage } from "./templates";

/**
 * Registered AUTOMATIC channels. Launch = email only (WhatsApp is manual via
 * buildWhatsAppUrl). To automate WhatsApp later: implement a WhatsAppApiChannel
 * (NotificationChannel) and add it here — notify() callers never change.
 */
const channels: NotificationChannel[] = [new EmailChannel()];

/**
 * Fire all channels that support `event`. Channels never throw — each returns a
 * ChannelResult — so one failing channel can't break the order flow.
 *
 * Usage (from checkout / webhook / admin, server-side only):
 *   await notify("order_confirmed", {
 *     orderNumber: "SMY-2026-0001",
 *     status: "new",
 *     total: 648,
 *     customerName: "Asha",
 *     email: "asha@example.com",
 *     phone: "9876543210",
 *     items: [{ productName: "Assam Morning Gold", weightLabel: "250g", quantity: 2, lineTotal: 598 }],
 *   });
 *   // -> { event: "order_confirmed", results: [{ channel: "email", status: "sent" }] }
 */
export async function notify(
  event: NotifyEvent,
  order: NotifyOrderInput,
): Promise<NotifyResult> {
  const applicable = channels.filter((c) => c.supports(event));
  const results = await Promise.all(
    applicable.map((c) => c.send(event, order)),
  );
  return { event, results };
}
