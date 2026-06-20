import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminOrder } from "@/lib/data/admin-orders";
import { StatusPill } from "@/components/ui";
import { OrderStatusControl } from "@/components/admin/OrderStatusControl";
import { ShippingForm } from "@/components/admin/ShippingForm";
import { OrderNotes } from "@/components/admin/OrderNotes";
import { RefundButton } from "@/components/admin/RefundButton";
import { buildWhatsAppUrl } from "@/lib/notify/whatsapp";
import type { NotifyEvent, NotifyOrderInput } from "@/lib/notify/types";
import { inr, fmtDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Admin · Order" };
export const dynamic = "force-dynamic";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-charcoal/10 bg-white p-5">
      <h2 className="mb-3 font-semibold text-green-deep">{title}</h2>
      {children}
    </section>
  );
}

export default async function AdminOrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getAdminOrder(id);
  if (!data) notFound();
  const { order, items, history, customer } = data;
  const addr = (order.shipping_address ?? {}) as Record<string, string>;

  // WhatsApp manual update link.
  const waEvent: NotifyEvent =
    order.status === "shipped" ? "shipped" : order.status === "delivered" ? "delivered" : "order_confirmed";
  const waPayload: NotifyOrderInput = {
    orderNumber: order.order_number,
    status: order.status,
    total: Number(order.total),
    customerName: customer?.name ?? addr.name ?? null,
    courier: order.courier,
    awbNumber: order.awb_number,
    trackingUrl: order.tracking_url,
  };
  const waUrl = buildWhatsAppUrl({
    phone: customer?.phone ?? addr.phone ?? null,
    event: waEvent,
    order: waPayload,
  });

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/orders" className="text-sm text-charcoal/50 hover:text-green-deep">← Orders</Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-green-deep">{order.order_number}</h1>
        <div className="flex items-center gap-2">
          <StatusPill status={order.payment_status} />
          <StatusPill status={order.status} />
        </div>
      </div>
      <p className="mt-1 text-sm text-charcoal/50">Placed {fmtDateTime(order.created_at)} · {order.source}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <Card title="Items">
            <ul className="divide-y divide-charcoal/10">
              {items.map((i, idx) => (
                <li key={idx} className="flex justify-between gap-2 py-2 text-sm">
                  <span className="text-charcoal/80">{i.product_name} ({i.weight_label}) × {i.quantity}</span>
                  <span className="font-medium">{inr(i.line_total)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1 border-t border-charcoal/10 pt-3 text-sm">
              <div className="flex justify-between"><dt className="text-charcoal/70">Subtotal</dt><dd>{inr(order.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-charcoal/70">Shipping</dt><dd>{order.shipping_fee === 0 ? "Free" : inr(order.shipping_fee)}</dd></div>
              {order.discount > 0 && <div className="flex justify-between"><dt className="text-charcoal/70">Discount</dt><dd>−{inr(order.discount)}</dd></div>}
              <div className="flex justify-between border-t border-charcoal/10 pt-2 text-base font-semibold"><dt>Total</dt><dd className="text-green-deep">{inr(order.total)}</dd></div>
            </dl>
          </Card>

          <Card title="Customer & shipping">
            <div className="text-sm text-charcoal/80">
              <p className="font-medium">{customer?.name ?? addr.name ?? "—"}</p>
              <p className="text-charcoal/60">{customer?.email ?? addr.email ?? "—"}</p>
              <p className="text-charcoal/60">{customer?.phone ?? addr.phone ?? "—"}</p>
              <div className="mt-3 text-charcoal/70">
                <p>{addr.line1}</p>
                {addr.line2 && <p>{addr.line2}</p>}
                <p>{[addr.city, addr.state, addr.pincode].filter(Boolean).join(", ")}</p>
              </div>
            </div>
            {waUrl && (
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                className="mt-4 inline-flex items-center rounded-full bg-green-mid px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-deep">
                Send WhatsApp update →
              </a>
            )}
          </Card>

          <Card title="Payment">
            <div className="text-sm text-charcoal/70">
              <p>Status: <StatusPill status={order.payment_status} /></p>
              <p className="mt-2">Method: {order.payment_method || "—"}</p>
              <p className="mt-1 break-all text-xs text-charcoal/50">RZP order: {order.razorpay_order_id || "—"}</p>
              <p className="break-all text-xs text-charcoal/50">RZP payment: {order.razorpay_payment_id || "—"}</p>
            </div>
            {order.payment_status === "paid" && (
              <div className="mt-4"><RefundButton orderId={order.id} /></div>
            )}
          </Card>

          <Card title="Internal notes">
            <OrderNotes orderId={order.id} notes={order.notes} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Update status">
            <OrderStatusControl orderId={order.id} current={order.status} />
          </Card>

          <Card title="Shipping (manual)">
            <ShippingForm orderId={order.id} courier={order.courier} awbNumber={order.awb_number} trackingUrl={order.tracking_url} />
          </Card>

          <Card title="History">
            {history.length === 0 ? (
              <p className="text-sm text-charcoal/50">No history yet.</p>
            ) : (
              <ol className="space-y-3">
                {history.map((h, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-soft" />
                    <div>
                      <p className="text-sm font-medium capitalize text-charcoal">{h.note || h.status}</p>
                      <p className="text-xs text-charcoal/50">{fmtDateTime(h.created_at)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
