import type { Metadata } from "next";
import Link from "next/link";
import { getAdminCustomers } from "@/lib/data/admin-customers";
import { inr, fmtDate } from "@/lib/format";

export const metadata: Metadata = { title: "Admin · Customers" };
export const dynamic = "force-dynamic";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const customers = await getAdminCustomers(sp.q);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-green-deep">Customers</h1>

      <form className="mt-6 flex flex-wrap gap-3" method="get">
        <input
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="Search name / email / phone"
          className="w-64 rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-amber"
        />
        <button type="submit" className="rounded-lg border border-charcoal/20 px-4 py-2 text-sm font-medium hover:border-green-deep">Search</button>
        {sp.q && <Link href="/admin/customers" className="self-center text-sm text-charcoal/50 hover:text-green-deep">Clear</Link>}
      </form>

      <p className="mt-4 text-sm text-charcoal/50">{customers.length} customers</p>

      <div className="mt-3 overflow-x-auto rounded-2xl border border-charcoal/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-charcoal/50">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-2 py-3 font-medium">Email</th>
              <th className="px-2 py-3 font-medium">Phone</th>
              <th className="px-2 py-3 font-medium">Orders</th>
              <th className="px-2 py-3 font-medium">Total spent</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-charcoal/50">No customers yet.</td></tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="border-t border-charcoal/5 hover:bg-cream/40">
                  <td className="px-4 py-3">
                    <Link href={`/admin/customers/${c.id}`} className="font-medium text-green-deep hover:underline">
                      {c.name || "—"}
                    </Link>
                  </td>
                  <td className="px-2 py-3 text-charcoal/60">{c.email || "—"}</td>
                  <td className="px-2 py-3 text-charcoal/60">{c.phone || "—"}</td>
                  <td className="px-2 py-3 text-charcoal/70">{c.orderCount}</td>
                  <td className="px-2 py-3 font-medium text-green-deep">{inr(c.totalSpent)}</td>
                  <td className="px-4 py-3 text-charcoal/60">{fmtDate(c.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
