import { cn } from "@/lib/cn";
import type { OrderStatus, PaymentStatus } from "@/types/database";

type Tone = "neutral" | "info" | "progress" | "success" | "warn" | "danger";

const TONE_CLASSES: Record<Tone, string> = {
  neutral: "bg-charcoal/10 text-charcoal/70",
  info: "bg-green-leaf/15 text-green-leaf",
  progress: "bg-amber/15 text-amber",
  success: "bg-green-soft/25 text-green-deep",
  warn: "bg-amber-light/25 text-amber",
  danger: "bg-red-100 text-red-700",
};

const STATUS_TONE: Record<OrderStatus | PaymentStatus, Tone> = {
  // order statuses
  new: "progress",
  confirmed: "info",
  packed: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "danger",
  refunded: "danger",
  // payment statuses
  pending: "progress",
  paid: "success",
  failed: "danger",
  // 'refunded' shared above
};

export interface StatusPillProps {
  status: OrderStatus | PaymentStatus | string;
  /** Override the auto-mapped tone. */
  tone?: Tone;
  className?: string;
}

/** Status pill — order/payment state badge (PRD §6.5). */
export function StatusPill({ status, tone, className }: StatusPillProps) {
  const resolved: Tone =
    tone ?? STATUS_TONE[status as OrderStatus | PaymentStatus] ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
        TONE_CLASSES[resolved],
        className,
      )}
    >
      {status}
    </span>
  );
}
