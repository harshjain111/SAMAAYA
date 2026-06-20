"use client";

import { useState, useTransition } from "react";
import { saveVariants, type VariantInput } from "@/lib/actions/products";
import { Button } from "@/components/ui";
import type { ProductVariant } from "@/types/database";

type Row = VariantInput;

const cell =
  "w-full rounded border border-charcoal/15 bg-white px-2 py-1 text-sm focus-visible:outline-2 focus-visible:outline-amber";

export function VariantsEditor({
  productId,
  variants,
}: {
  productId: string;
  variants: ProductVariant[];
}) {
  const [rows, setRows] = useState<Row[]>(
    variants.map((v) => ({
      id: v.id,
      weight_grams: v.weight_grams,
      label: v.label,
      price: Number(v.price),
      mrp: v.mrp != null ? Number(v.mrp) : null,
      sku: v.sku,
      stock_qty: v.stock_qty,
      active: v.active,
      sort_order: v.sort_order,
    })),
  );
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const update = (i: number, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const addRow = () =>
    setRows((rs) => [
      ...rs,
      { weight_grams: 250, label: "250g", price: 0, mrp: null, sku: null, stock_qty: 0, active: true, sort_order: rs.length },
    ]);

  const removeRow = (i: number) => setRows((rs) => rs.filter((_, idx) => idx !== i));

  function save() {
    setMsg(null);
    // normalize sort_order to current order
    const normalized = rows.map((r, i) => ({ ...r, sort_order: i }));
    startTransition(async () => {
      try {
        await saveVariants(productId, normalized);
        setMsg("Saved ✓");
      } catch (e) {
        setMsg(e instanceof Error ? e.message : "Save failed");
      }
    });
  }

  return (
    <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
      <h2 className="font-semibold text-green-deep">Variants</h2>
      <p className="mt-1 text-xs text-charcoal/50">Weight, price, MRP, SKU, stock. A product needs at least one active variant to be buyable.</p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-charcoal/50">
              <th className="px-1 py-2 font-medium">Grams</th>
              <th className="px-1 py-2 font-medium">Label</th>
              <th className="px-1 py-2 font-medium">Price ₹</th>
              <th className="px-1 py-2 font-medium">MRP ₹</th>
              <th className="px-1 py-2 font-medium">SKU</th>
              <th className="px-1 py-2 font-medium">Stock</th>
              <th className="px-1 py-2 font-medium">Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id ?? `new-${i}`} className="border-t border-charcoal/5">
                <td className="px-1 py-1 w-20"><input type="number" className={cell} value={r.weight_grams} onChange={(e) => update(i, { weight_grams: Number(e.target.value) || 0 })} /></td>
                <td className="px-1 py-1 w-20"><input className={cell} value={r.label} onChange={(e) => update(i, { label: e.target.value })} /></td>
                <td className="px-1 py-1 w-24"><input type="number" className={cell} value={r.price} onChange={(e) => update(i, { price: Number(e.target.value) || 0 })} /></td>
                <td className="px-1 py-1 w-24"><input type="number" className={cell} value={r.mrp ?? ""} onChange={(e) => update(i, { mrp: e.target.value ? Number(e.target.value) : null })} /></td>
                <td className="px-1 py-1 w-28"><input className={cell} value={r.sku ?? ""} onChange={(e) => update(i, { sku: e.target.value || null })} /></td>
                <td className="px-1 py-1 w-20"><input type="number" className={cell} value={r.stock_qty} onChange={(e) => update(i, { stock_qty: Number(e.target.value) || 0 })} /></td>
                <td className="px-1 py-1 text-center"><input type="checkbox" checked={r.active} onChange={(e) => update(i, { active: e.target.checked })} /></td>
                <td className="px-1 py-1 text-right"><button type="button" onClick={() => removeRow(i)} className="text-xs text-red-600 hover:underline">Remove</button></td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={8} className="px-1 py-4 text-center text-charcoal/40">No variants yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button type="button" onClick={addRow} className="rounded-lg border border-charcoal/20 px-3 py-1.5 text-sm font-medium hover:border-green-deep">
          + Add variant
        </button>
        <Button onClick={save} disabled={pending}>{pending ? "Saving…" : "Save variants"}</Button>
        {msg && <span className="text-sm text-charcoal/60">{msg}</span>}
      </div>
    </div>
  );
}
