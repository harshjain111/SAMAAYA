import "server-only";
import { Resend } from "resend";
import type {
  ChannelResult,
  NotificationChannel,
  NotifyEvent,
  NotifyOrderInput,
} from "./types";
import { renderMessage } from "./templates";

const EMAIL_EVENTS: NotifyEvent[] = [
  "order_confirmed",
  "payment_received",
  "shipped",
  "delivered",
];

/** Minimal text -> HTML: escape, then turn newlines into <br>. */
function toHtml(text: string): string {
  const esc = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return `<div style="font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.6;color:#2A2A24">${esc.replace(
    /\n/g,
    "<br>",
  )}</div>`;
}

/**
 * EmailChannel — automatic transactional email via Resend (PRD §5.8).
 * If RESEND_API_KEY is unset (e.g. local dev), it logs and returns "skipped"
 * instead of throwing, so the order flow never breaks on missing email config.
 */
export class EmailChannel implements NotificationChannel {
  readonly name = "email";

  supports(event: NotifyEvent): boolean {
    return EMAIL_EVENTS.includes(event);
  }

  async send(
    event: NotifyEvent,
    order: NotifyOrderInput,
  ): Promise<ChannelResult> {
    if (!order.email) {
      return { channel: this.name, status: "skipped", detail: "no email" };
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    if (!apiKey || !from) {
      console.warn(
        `[notify:email] RESEND_API_KEY/RESEND_FROM_EMAIL not set — skipping "${event}" to ${order.email}`,
      );
      return { channel: this.name, status: "skipped", detail: "not configured" };
    }

    const { subject, text } = renderMessage(event, order);

    try {
      const resend = new Resend(apiKey);
      const { data, error } = await resend.emails.send({
        from,
        to: order.email,
        subject,
        text,
        html: toHtml(text),
      });
      if (error) {
        return { channel: this.name, status: "error", detail: error.message };
      }
      return { channel: this.name, status: "sent", detail: data?.id };
    } catch (err) {
      return {
        channel: this.name,
        status: "error",
        detail: err instanceof Error ? err.message : String(err),
      };
    }
  }
}
