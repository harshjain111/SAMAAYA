import Link from "next/link";
import { StatusPill, buttonClasses } from "@/components/ui";
import type { OrderDetails } from "@/lib/data/orders";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const fmt = (s: string) =>
  new Date(s).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/** Shared order view used by the confirmation page and /track results. */
export function OrderDetail({ details }: { details: OrderDetails }) {
  const { order, items, history } = details;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <div>
        {/* Items */}
        <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-green-deep">
              Order {order.order_number}
            </h2>
            <div className="flex gap-2">
              <StatusPill status={order.payment_status} />
              <StatusPill status={order.status} />
            </div>
          </div>

          <ul className="mt-4 divide-y divide-charcoal/10">
            {items.map((i, idx) => (
              <li key={idx} className="flex justify-between gap-2 py-3 text-sm">
                <span className="text-charcoal/80">
                  {i.product_name} ({i.weight_label}) × {i.quantity}
                </span>
                <span className="font-medium">{inr(i.line_total)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-1 border-t border-charcoal/10 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-charcoal/70">Subtotal</dt>
              <dd>{inr(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-charcoal/70">Shipping</dt>
              <dd>{order.shipping_fee === 0 ? "Free" : inr(order.shipping_fee)}</dd>
            </div>
            <div className="flex justify-between border-t border-charcoal/10 pt-2 text-base font-semibold">
              <dt>Total</dt>
              <dd className="text-green-deep">{inr(order.total)}</dd>
            </div>
          </dl>
        </div>

        {/* Tracking */}
        {order.tracking_url && (
          <div className="mt-6 rounded-2xl border border-charcoal/10 bg-white p-5">
            <h2 className="text-lg font-semibold text-green-deep">Tracking</h2>
            <p className="mt-1 text-sm text-charcoal/70">
              {[order.courier, order.awb_number].filter(Boolean).join(" · ")}
            </p>
            <a
              href={order.tracking_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonClasses("primary", "sm")} mt-3`}
            >
              Track shipment →
            </a>
          </div>
        )}
      </div>

      {/* Timeline */}
      <aside className="h-fit rounded-2xl border border-charcoal/10 bg-white p-5">
        <h2 className="text-lg font-semibold text-green-deep">Status</h2>
        {history.length === 0 ? (
          <p className="mt-3 text-sm text-charcoal/60">No updates yet.</p>
        ) : (
          <ol className="mt-4 space-y-4">
            {history.map((h, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-soft" />
                <div>
                  <p className="text-sm font-medium capitalize text-charcoal">
                    {h.note || h.status}
                  </p>
                  <p className="text-xs text-charcoal/50">{fmt(h.created_at)}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
        <div className="mt-6">
          <Link
            href="/shop"
            className="text-sm font-semibold text-amber hover:text-amber-light"
          >
            Continue shopping →
          </Link>
        </div>
      </aside>
    </div>
  );
}
