/**
 * WhatsApp MANUAL helper (PRD §5.8). It does NOT send anything — it builds a
 * pre-filled wa.me URL that the admin opens and taps "send" on the order page.
 *
 * The automated WhatsApp Business API channel (Phase 2) will be a separate
 * NotificationChannel registered in the notify() dispatcher; this helper stays
 * as the manual fallback / link generator.
 *
 * Usage (admin order page "Send WhatsApp update" button):
 *   const url = buildWhatsAppUrl({
 *     phone: order.shipping_address.phone,   // customer's number
 *     event: "shipped",
 *     order: notifyInput,
 *   });
 *   // <a href={url} target="_blank">Send WhatsApp update</a>
 */
import type { NotifyEvent, NotifyOrderInput } from "./types";
import { renderMessage } from "./templates";

/** Normalize an Indian phone number to wa.me's digits-only, country-coded form. */
export function normalizePhoneForWa(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  // 10-digit Indian mobile -> prefix country code 91.
  if (digits.length === 10) return `91${digits}`;
  // 0XXXXXXXXXX -> drop leading 0, add 91.
  if (digits.length === 11 && digits.startsWith("0")) return `91${digits.slice(1)}`;
  // Already country-coded (e.g. 91XXXXXXXXXX) or other — use as-is.
  return digits;
}

export interface WhatsAppUrlInput {
  phone: string | null | undefined;
  event: NotifyEvent;
  order: NotifyOrderInput;
}

/**
 * Build the wa.me link. Returns null if there's no phone number to message.
 * The message body reuses the shared templates so WhatsApp matches email.
 */
export function buildWhatsAppUrl({
  phone,
  event,
  order,
}: WhatsAppUrlInput): string | null {
  if (!phone) return null;
  const to = normalizePhoneForWa(phone);
  if (!to) return null;

  const { text } = renderMessage(event, order);
  return `https://wa.me/${to}?text=${encodeURIComponent(text)}`;
}
