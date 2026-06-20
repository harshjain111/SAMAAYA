"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import {
  addProductImage,
  deleteImage,
  updateImageAlt,
  reorderImages,
} from "@/lib/actions/products";
import type { ProductImage } from "@/types/database";

const BUCKET = "product-images";

export function ImageManager({
  productId,
  images,
}: {
  productId: string;
  images: ProductImage[];
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${productId}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      await addProductImage(productId, data.publicUrl, file.name);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? `Upload failed: ${err.message}. Did you run supabase/storage.sql?`
          : "Upload failed.",
      );
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...images];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    startTransition(async () => {
      await reorderImages(next.map((i) => i.id));
      router.refresh();
    });
  }

  function remove(id: string) {
    if (!confirm("Remove this image?")) return;
    startTransition(async () => {
      await deleteImage(id);
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
      <h2 className="font-semibold text-green-deep">Images</h2>
      <p className="mt-1 text-xs text-charcoal/50">First image is the main one. Drag-free reorder with the arrows.</p>

      <div className="mt-4">
        <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} disabled={uploading} className="text-sm" />
        {uploading && <span className="ml-2 text-sm text-charcoal/60">Uploading…</span>}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {images.length > 0 && (
        <ul className="mt-4 space-y-3">
          {images.map((img, i) => (
            <li key={img.id} className="flex items-center gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-cream">
                <Image src={img.url} alt={img.alt || ""} fill sizes="64px" className="object-cover" />
              </div>
              <input
                defaultValue={img.alt ?? ""}
                placeholder="Alt text"
                onBlur={(e) => startTransition(() => updateImageAlt(img.id, e.target.value).then(() => {}))}
                className="flex-1 rounded border border-charcoal/15 bg-white px-2 py-1 text-sm"
              />
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0 || pending} className="rounded border border-charcoal/20 px-2 py-1 text-xs disabled:opacity-30">↑</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1 || pending} className="rounded border border-charcoal/20 px-2 py-1 text-xs disabled:opacity-30">↓</button>
                <button type="button" onClick={() => remove(img.id)} disabled={pending} className="ml-1 text-xs text-red-600 hover:underline">Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
