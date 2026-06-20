import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminCustomer } from "@/lib/data/admin-customers";
import { StatusPill } from "@/components/ui";
import { inr, fmtDate } from "@/lib/format";

export const metadata: Metadata = { title: "Admin · Customer" };
export const dynamic = "force-dynamic";

export default async function AdminCustomerDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getAdminCustomer(id);
  if (!data) notFound();
  const { customer, orders, orderCount, totalSpent } = data;

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/customers" className="text-sm text-charcoal/50 hover:text-green-deep">← Customers</Link>
      <h1 className="mt-3 text-2xl font-semibold text-green-deep">{customer.name || "Customer"}</h1>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-charcoal/10 bg-white p-4">
          <p className="text-sm text-charcoal/60">Contact</p>
          <p className="mt-1 text-sm">{customer.email || "—"}</p>
          <p className="text-sm text-charcoal/70">{customer.phone || "—"}</p>
        </div>
        <div className="rounded-2xl border border-charcoal/10 bg-white p-4">
          <p className="text-sm text-charcoal/60">Orders</p>
          <p className="mt-1 text-2xl font-semibold text-green-deep">{orderCount}</p>
        </div>
        <div className="rounded-2xl border border-charcoal/10 bg-white p-4">
          <p className="text-sm text-charcoal/60">Total spent</p>
          <p className="mt-1 text-2xl font-semibold text-green-deep">{inr(totalSpent)}</p>
        </div>
      </div>

      <h2 className="mt-8 font-semibold text-green-deep">Order history</h2>
      <div className="mt-3 overflow-hidden rounded-2xl border border-charcoal/10 bg-white">
        {orders.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-charcoal/50">No orders.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-charcoal/50">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-2 py-3 font-medium">Date</th>
                <th className="px-2 py-3 font-medium">Payment</th>
                <th className="px-2 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-charcoal/5 hover:bg-cream/40">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="font-medium text-green-deep hover:underline">{o.order_number}</Link>
                  </td>
                  <td className="px-2 py-3 text-charcoal/60">{fmtDate(o.created_at)}</td>
                  <td className="px-2 py-3"><StatusPill status={o.payment_status} /></td>
                  <td className="px-2 py-3"><StatusPill status={o.status} /></td>
                  <td className="px-4 py-3 text-right font-medium">{inr(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
