/**
 * notify(event, order) dispatcher types (CLAUDE.md §ARCHITECTURE RULES, PRD §5.8).
 * Calling code fires a single notify() and never changes when channels are
 * added. At launch the only AUTOMATIC channel is email (Resend). WhatsApp is
 * manual — the admin taps a pre-filled wa.me link (see whatsapp.ts). A future
 * automated WhatsApp API channel implements NotificationChannel and is appended
 * to the channel list — no calling-code changes.
 */
import type { OrderStatus } from "@/types/database";

export type NotifyEvent =
  | "order_confirmed"
  | "payment_received"
  | "shipped"
  | "delivered";

export interface NotifyItem {
  productName: string;
  weightLabel: string;
  quantity: number;
  lineTotal: number;
}

/**
 * Channel-agnostic order view. Built by the caller from DB rows so the notify
 * layer stays decoupled from the database schema and is trivially testable.
 */
export interface NotifyOrderInput {
  orderNumber: string;
  status: OrderStatus;
  total: number;
  customerName?: string | null;
  email?: string | null;
  phone?: string | null;
  items?: NotifyItem[];
  /** Shipping fields — present for the "shipped" event. */
  courier?: string | null;
  awbNumber?: string | null;
  trackingUrl?: string | null;
  /** Branding/links — defaulted from store settings + env if omitted. */
  storeName?: string;
  siteUrl?: string;
}

export interface ChannelResult {
  channel: string;
  status: "sent" | "skipped" | "error";
  detail?: string;
}

export interface NotifyResult {
  event: NotifyEvent;
  results: ChannelResult[];
}

export interface NotificationChannel {
  readonly name: string;
  /** Whether this channel handles the given event. */
  supports(event: NotifyEvent): boolean;
  /** Deliver the notification. Must resolve (never throw) — return an error result. */
  send(event: NotifyEvent, order: NotifyOrderInput): Promise<ChannelResult>;
}
