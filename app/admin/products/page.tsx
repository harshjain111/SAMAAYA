import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAdminProducts } from "@/lib/data/admin-products";
import { NewProductButton } from "@/components/admin/NewProductButton";
import { ActiveToggle } from "@/components/admin/ActiveToggle";
import { inr } from "@/lib/format";

export const metadata: Metadata = { title: "Admin · Products" };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; active?: string }>;
}) {
  const sp = await searchParams;
  const activeFilter =
    sp.active === "active" || sp.active === "inactive" ? sp.active : undefined;
  const products = await getAdminProducts({ search: sp.q, active: activeFilter });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-green-deep">Products</h1>
        <NewProductButton />
      </div>

      {/* Search + filter (GET form, no JS needed) */}
      <form className="mt-6 flex flex-wrap gap-3" method="get">
        <input
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="Search by name…"
          className="w-56 rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-amber"
        />
        <select
          name="active"
          defaultValue={sp.active ?? ""}
          className="rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm"
        >
          <option value="">All</option>
          <option value="active">Active only</option>
          <option value="inactive">Inactive only</option>
        </select>
        <button type="submit" className="rounded-lg border border-charcoal/20 px-4 py-2 text-sm font-medium hover:border-green-deep">
          Filter
        </button>
        {(sp.q || sp.active) && (
          <Link href="/admin/products" className="self-center text-sm text-charcoal/50 hover:text-green-deep">
            Clear
          </Link>
        )}
      </form>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-charcoal/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-charcoal/50">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-2 py-3 font-medium">Moment</th>
              <th className="px-2 py-3 font-medium">Variants</th>
              <th className="px-2 py-3 font-medium">From</th>
              <th className="px-2 py-3 font-medium">Stock</th>
              <th className="px-2 py-3 font-medium">Active</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-charcoal/50">
                  No products. Click <strong>+ New product</strong> to add one.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-t border-charcoal/5 hover:bg-cream/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-cream">
                        {p.image && (
                          <Image src={p.image} alt={p.name} fill sizes="40px" className="object-cover" />
                        )}
                      </div>
                      <div>
                        <Link href={`/admin/products/${p.id}`} className="font-medium text-green-deep hover:underline">
                          {p.name}
                        </Link>
                        <p className="text-xs text-charcoal/40">/{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3 capitalize text-charcoal/70">{p.moment ?? "—"}</td>
                  <td className="px-2 py-3 text-charcoal/70">{p.variantCount}</td>
                  <td className="px-2 py-3 text-charcoal/70">{p.priceFrom != null ? inr(p.priceFrom) : "—"}</td>
                  <td className={p.totalStock === 0 ? "px-2 py-3 font-medium text-red-600" : "px-2 py-3 text-charcoal/70"}>
                    {p.totalStock}
                  </td>
                  <td className="px-2 py-3">
                    <ActiveToggle id={p.id} active={p.active} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/products/${p.id}`} className="text-sm font-medium text-amber hover:text-amber-light">
                      Edit →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
