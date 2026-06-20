import type { Metadata } from "next";
import Link from "next/link";
import { getDashboardData } from "@/lib/data/admin";
import { StatusPill } from "@/components/ui";
import { inr, fmtDate } from "@/lib/format";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";

export const metadata: Metadata = { title: "Admin · Dashboard" };
export const dynamic = "force-dynamic";

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
      <p className="text-sm text-charcoal/60">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-green-deep">{value}</p>
      {hint && <p className="mt-1 text-xs text-charcoal/50">{hint}</p>}
    </div>
  );
}

export default async function AdminDashboard() {
  const d = await getDashboardData();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-green-deep">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Orders today" value={String(d.todayOrders)} />
        <Stat label="Pending fulfillment" value={String(d.pendingFulfillment)} hint="Paid, not yet shipped" />
        <Stat label="Revenue today" value={inr(d.revenue.today)} />
        <Stat label="Revenue (30 days)" value={inr(d.revenue.month)} hint={`This week: ${inr(d.revenue.week)}`} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Recent orders */}
        <section className="rounded-2xl border border-charcoal/10 bg-white">
          <div className="flex items-center justify-between border-b border-charcoal/10 px-5 py-4">
            <h2 className="font-semibold text-green-deep">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm font-medium text-amber hover:text-amber-light">
              View all →
            </Link>
          </div>
          {d.recentOrders.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-charcoal/50">No orders yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-charcoal/50">
                  <th className="px-5 py-2 font-medium">Order</th>
                  <th className="px-2 py-2 font-medium">Date</th>
                  <th className="px-2 py-2 font-medium">Payment</th>
                  <th className="px-2 py-2 font-medium">Status</th>
                  <th className="px-5 py-2 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {d.recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-charcoal/5 hover:bg-cream/50">
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders/${o.id}`} className="font-medium text-green-deep hover:underline">
                        {o.order_number}
                      </Link>
                    </td>
                    <td className="px-2 py-3 text-charcoal/60">{fmtDate(o.created_at)}</td>
                    <td className="px-2 py-3"><StatusPill status={o.payment_status} /></td>
                    <td className="px-2 py-3"><StatusPill status={o.status} /></td>
                    <td className="px-5 py-3 text-right font-medium">{inr(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Low stock */}
        <section className="rounded-2xl border border-charcoal/10 bg-white">
          <div className="border-b border-charcoal/10 px-5 py-4">
            <h2 className="font-semibold text-green-deep">Low stock</h2>
            <p className="text-xs text-charcoal/50">At or below {LOW_STOCK_THRESHOLD} units</p>
          </div>
          {d.lowStock.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-charcoal/50">All stocked up. 🌱</p>
          ) : (
            <ul className="divide-y divide-charcoal/5">
              {d.lowStock.map((v) => (
                <li key={v.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <Link href={`/admin/products/${v.productId}`} className="min-w-0 truncate text-charcoal/80 hover:text-green-deep">
                    {v.productName} · {v.label}
                  </Link>
                  <span className={v.stock_qty === 0 ? "font-semibold text-red-600" : "font-semibold text-amber"}>
                    {v.stock_qty}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
