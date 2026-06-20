"use client";

import { useState, useTransition } from "react";
import { updateProduct, deleteProduct, type ProductFields } from "@/lib/actions/products";
import { Button } from "@/components/ui";
import type { Product } from "@/types/database";

const inputCls =
  "mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-amber";
const labelCls = "text-sm font-medium text-charcoal/70";

export function ProductForm({ product }: { product: Product }) {
  const [f, setF] = useState<ProductFields>({
    name: product.name,
    slug: product.slug,
    short_tasting_note: product.short_tasting_note,
    description: product.description,
    story: product.story,
    origin_region: product.origin_region,
    strength: product.strength,
    moment: product.moment,
    brew_temp: product.brew_temp,
    brew_time: product.brew_time,
    featured: product.featured,
    active: product.active,
    sort_order: product.sort_order,
  });
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const upd = <K extends keyof ProductFields>(k: K, v: ProductFields[K]) =>
    setF((prev) => ({ ...prev, [k]: v }));

  function save() {
    setMsg(null);
    startTransition(async () => {
      try {
        await updateProduct(product.id, f);
        setMsg("Saved ✓");
      } catch (e) {
        setMsg(e instanceof Error ? e.message : "Save failed");
      }
    });
  }

  function onDelete() {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    startTransition(async () => {
      try {
        await deleteProduct(product.id);
      } catch (e) {
        setMsg(e instanceof Error ? e.message : "Delete failed");
      }
    });
  }

  return (
    <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
      <h2 className="font-semibold text-green-deep">Details</h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls}>Name</label>
          <input className={inputCls} value={f.name} onChange={(e) => upd("name", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Slug (URL)</label>
          <input className={inputCls} value={f.slug ?? ""} onChange={(e) => upd("slug", e.target.value)} placeholder="auto from name if blank" />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Tasting note (card one-liner)</label>
          <input className={inputCls} value={f.short_tasting_note ?? ""} onChange={(e) => upd("short_tasting_note", e.target.value || null)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Description</label>
          <textarea className={inputCls} rows={3} value={f.description ?? ""} onChange={(e) => upd("description", e.target.value || null)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Story</label>
          <textarea className={inputCls} rows={3} value={f.story ?? ""} onChange={(e) => upd("story", e.target.value || null)} />
        </div>
        <div>
          <label className={labelCls}>Origin region</label>
          <input className={inputCls} value={f.origin_region ?? ""} onChange={(e) => upd("origin_region", e.target.value || null)} />
        </div>
        <div>
          <label className={labelCls}>Strength (1–5)</label>
          <select className={inputCls} value={f.strength ?? ""} onChange={(e) => upd("strength", e.target.value ? Number(e.target.value) : null)}>
            <option value="">—</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Moment</label>
          <select className={inputCls} value={f.moment ?? ""} onChange={(e) => upd("moment", (e.target.value || null) as ProductFields["moment"])}>
            <option value="">—</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Sort order</label>
          <input type="number" className={inputCls} value={f.sort_order} onChange={(e) => upd("sort_order", Number(e.target.value) || 0)} />
        </div>
        <div>
          <label className={labelCls}>Brew temp</label>
          <input className={inputCls} value={f.brew_temp ?? ""} onChange={(e) => upd("brew_temp", e.target.value || null)} placeholder="95°C" />
        </div>
        <div>
          <label className={labelCls}>Brew time</label>
          <input className={inputCls} value={f.brew_time ?? ""} onChange={(e) => upd("brew_time", e.target.value || null)} placeholder="3–4" />
        </div>
        <div className="flex items-center gap-6 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={f.featured} onChange={(e) => upd("featured", e.target.checked)} />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={f.active} onChange={(e) => upd("active", e.target.checked)} />
            Active (visible in store)
          </label>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <Button onClick={save} disabled={pending}>
          {pending ? "Saving…" : "Save details"}
        </Button>
        {msg && <span className="text-sm text-charcoal/60">{msg}</span>}
        <button type="button" onClick={onDelete} disabled={pending} className="ml-auto text-sm text-red-600 hover:underline">
          Delete product
        </button>
      </div>
    </div>
  );
}
