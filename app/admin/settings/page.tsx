import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/data/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const metadata: Metadata = { title: "Admin · Settings" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-green-deep">Settings</h1>
      <p className="mt-1 text-sm text-charcoal/60">Shipping, contact, and storefront announcement.</p>
      <div className="mt-6">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
