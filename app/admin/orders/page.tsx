import type { Metadata } from "next";
import Link from "next/link";
import { getAdminOrders } from "@/lib/data/admin-orders";
import { StatusPill } from "@/components/ui";
import { inr, fmtDate } from "@/lib/format";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/constants";

export const metadata: Metadata = { title: "Admin · Orders" };
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; payment?: string }>;
}) {
  const sp = await searchParams;
  const orders = await getAdminOrders({
    search: sp.q,
    status: sp.status,
    payment: sp.payment,
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-green-deep">Orders</h1>

      <form className="mt-6 flex flex-wrap gap-3" method="get">
        <input
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="Search order # / name / phone"
          className="w-64 rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-amber"
        />
        <select name="status" defaultValue={sp.status ?? ""} className="rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
        <select name="payment" defaultValue={sp.payment ?? ""} className="rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm">
          <option value="">All payments</option>
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
        <button type="submit" className="rounded-lg border border-charcoal/20 px-4 py-2 text-sm font-medium hover:border-green-deep">Filter</button>
        {(sp.q || sp.status || sp.payment) && (
          <Link href="/admin/orders" className="self-center text-sm text-charcoal/50 hover:text-green-deep">Clear</Link>
        )}
      </form>

      <p className="mt-4 text-sm text-charcoal/50">{orders.length} orders</p>

      <div className="mt-3 overflow-x-auto rounded-2xl border border-charcoal/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-charcoal/50">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-2 py-3 font-medium">Customer</th>
              <th className="px-2 py-3 font-medium">Phone</th>
              <th className="px-2 py-3 font-medium">Date</th>
              <th className="px-2 py-3 font-medium">Items</th>
              <th className="px-2 py-3 font-medium">Payment</th>
              <th className="px-2 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-charcoal/50">No orders found.</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-t border-charcoal/5 hover:bg-cream/40">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="font-medium text-green-deep hover:underline">{o.order_number}</Link>
                    {o.source !== "web" && <span className="ml-1 text-xs text-charcoal/40">({o.source})</span>}
                  </td>
                  <td className="px-2 py-3 text-charcoal/70">{o.customerName}</td>
                  <td className="px-2 py-3 text-charcoal/60">{o.phone || "—"}</td>
                  <td className="px-2 py-3 text-charcoal/60">{fmtDate(o.created_at)}</td>
                  <td className="px-2 py-3 text-charcoal/70">{o.itemCount}</td>
                  <td className="px-2 py-3"><StatusPill status={o.payment_status} /></td>
                  <td className="px-2 py-3"><StatusPill status={o.status} /></td>
                  <td className="px-4 py-3 text-right font-medium">{inr(o.total)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
