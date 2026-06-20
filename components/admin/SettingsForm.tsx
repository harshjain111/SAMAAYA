"use client";

import { useState, useTransition } from "react";
import { saveSettings, type SettingsFields } from "@/lib/actions/settings";
import { Button } from "@/components/ui";
import type { StoreSettings } from "@/types/database";

const inputCls =
  "mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-amber";
const labelCls = "text-sm font-medium text-charcoal/70";

export function SettingsForm({ settings }: { settings: StoreSettings }) {
  const [f, setF] = useState<SettingsFields>({
    store_name: settings.store_name,
    shipping_fee: Number(settings.shipping_fee),
    free_shipping_threshold: Number(settings.free_shipping_threshold),
    whatsapp_number: settings.whatsapp_number,
    contact_email: settings.contact_email,
    announcement_bar: settings.announcement_bar,
  });
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const upd = <K extends keyof SettingsFields>(k: K, v: SettingsFields[K]) =>
    setF((prev) => ({ ...prev, [k]: v }));

  function save() {
    setMsg(null);
    startTransition(async () => {
      try {
        await saveSettings(f);
        setMsg("Saved ✓");
      } catch (e) {
        setMsg(e instanceof Error ? e.message : "Save failed");
      }
    });
  }

  return (
    <div className="max-w-xl rounded-2xl border border-charcoal/10 bg-white p-5">
      <div className="grid gap-4">
        <div>
          <label className={labelCls}>Store name</label>
          <input className={inputCls} value={f.store_name} onChange={(e) => upd("store_name", e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Shipping fee (₹)</label>
            <input type="number" className={inputCls} value={f.shipping_fee} onChange={(e) => upd("shipping_fee", Number(e.target.value) || 0)} />
          </div>
          <div>
            <label className={labelCls}>Free shipping over (₹)</label>
            <input type="number" className={inputCls} value={f.free_shipping_threshold} onChange={(e) => upd("free_shipping_threshold", Number(e.target.value) || 0)} />
          </div>
        </div>
        <div>
          <label className={labelCls}>WhatsApp number</label>
          <input className={inputCls} value={f.whatsapp_number ?? ""} onChange={(e) => upd("whatsapp_number", e.target.value || null)} placeholder="+91…" />
        </div>
        <div>
          <label className={labelCls}>Contact email</label>
          <input type="email" className={inputCls} value={f.contact_email ?? ""} onChange={(e) => upd("contact_email", e.target.value || null)} />
        </div>
        <div>
          <label className={labelCls}>Announcement bar</label>
          <input className={inputCls} value={f.announcement_bar ?? ""} onChange={(e) => upd("announcement_bar", e.target.value || null)} placeholder="Shown at the top of the store (leave blank to hide)" />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Button onClick={save} disabled={pending}>{pending ? "Saving…" : "Save settings"}</Button>
        {msg && <span className="text-sm text-charcoal/60">{msg}</span>}
      </div>
      <p className="mt-3 text-xs text-charcoal/50">Storefront updates within a minute (cached pages revalidate).</p>
    </div>
  );
}
