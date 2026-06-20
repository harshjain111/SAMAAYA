/**
 * Brand-level constants. Product data is NEVER hardcoded — it comes from the
 * DB/admin (CLAUDE.md §NON-NEGOTIABLE PRINCIPLES). Keep this for static brand
 * facts only.
 */
export const BRAND = {
  name: "SAMAAYA",
  tagline: "The Right Moment.",
} as const;

/** Moment tags used for moment-based merchandising (PRD §5.2). */
export const MOMENTS = ["morning", "afternoon", "evening"] as const;
export type Moment = (typeof MOMENTS)[number];

/** Order status pipeline (CLAUDE.md §ORDER STATUS PIPELINE). */
export const ORDER_STATUSES = [
  "new",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "refunded",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
