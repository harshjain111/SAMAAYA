import { cn } from "@/lib/cn";

export interface FreeShippingNudgeProps {
  /** Current cart subtotal (₹). */
  subtotal: number;
  /** Free-shipping threshold from store_settings (₹). */
  threshold: number;
  className?: string;
}

const inr = (n: number) =>
  `₹${Math.max(0, Math.round(n)).toLocaleString("en-IN")}`;

/**
 * Free-shipping progress nudge — raises AOV (PRD §5.2). Shows how far the cart
 * is from free shipping, with a progress bar; celebrates once unlocked.
 * A threshold of 0 means free shipping is always on → renders nothing.
 */
export function FreeShippingNudge({
  subtotal,
  threshold,
  className,
}: FreeShippingNudgeProps) {
  if (threshold <= 0) return null;

  const unlocked = subtotal >= threshold;
  const remaining = Math.max(0, threshold - subtotal);
  const pct = Math.max(0, Math.min(100, (subtotal / threshold) * 100));

  return (
    <div className={cn("rounded-xl bg-cream p-3", className)}>
      <p className="text-sm text-charcoal/80">
        {unlocked ? (
          <span className="font-semibold text-green-deep">
            You&apos;ve unlocked free shipping.
          </span>
        ) : (
          <>
            You&apos;re{" "}
            <span className="font-semibold text-green-deep">
              {inr(remaining)}
            </span>{" "}
            away from free shipping.
          </>
        )}
      </p>
      <div
        className="mt-2 h-2 w-full overflow-hidden rounded-full bg-green-soft/20"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={threshold}
        aria-valuenow={Math.min(subtotal, threshold)}
        aria-label="Progress toward free shipping"
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            unlocked ? "bg-green-soft" : "bg-amber",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
