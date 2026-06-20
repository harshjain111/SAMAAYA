"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export interface ContactFormProps {
  /** Destination email (store_settings.contact_email). */
  contactEmail?: string | null;
}

/**
 * Contact form. Server-side routing to the inbox lands in Prompt 4.2; for now
 * it composes a prefilled email via the user's mail client (mailto), so it
 * works end-to-end without a backend.
 */
export function ContactForm({ contactEmail }: ContactFormProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const to = contactEmail || "";
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`SAMAAYA enquiry from ${form.name || "website"}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\n\n${form.message}`,
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  }

  const inputCls =
    "w-full rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-amber";

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input className={inputCls} placeholder="Name" value={form.name} onChange={set("name")} required />
        <input className={inputCls} placeholder="Phone" value={form.phone} onChange={set("phone")} />
      </div>
      <input
        className={inputCls}
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={set("email")}
        required
      />
      <textarea
        className={inputCls}
        placeholder="Message"
        rows={4}
        value={form.message}
        onChange={set("message")}
        required
      />
      <Button type="submit">Send Message</Button>
    </form>
  );
}
