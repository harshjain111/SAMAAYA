"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import type { Moment } from "@/types/database";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "product";
}

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const admin = createAdminClient();
  let slug = slugify(base);
  let n = 1;
  // try until free
  for (;;) {
    let q = admin.from("products").select("id").eq("slug", slug);
    if (ignoreId) q = q.neq("id", ignoreId);
    const { data } = await q.maybeSingle();
    if (!data) return slug;
    n += 1;
    slug = `${slugify(base)}-${n}`;
  }
}

/** Revalidate storefront + admin so changes show within the request. */
function revalidateAll(slug?: string) {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  if (slug) revalidatePath(`/product/${slug}`);
}

/** Create a draft product and jump to its editor. */
export async function createProduct() {
  await requireAdmin();
  const admin = createAdminClient();
  const slug = await uniqueSlug("new-product");
  const { data, error } = await admin
    .from("products")
    .insert({ name: "New product", slug, active: false })
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message || "Could not create product.");
  revalidateAll();
  redirect(`/admin/products/${data.id}`);
}

export interface ProductFields {
  name: string;
  slug?: string;
  short_tasting_note: string | null;
  description: string | null;
  story: string | null;
  origin_region: string | null;
  strength: number | null;
  moment: Moment | null;
  brew_temp: string | null;
  brew_time: string | null;
  featured: boolean;
  active: boolean;
  sort_order: number;
}

export async function updateProduct(id: string, fields: ProductFields) {
  await requireAdmin();
  const admin = createAdminClient();
  const slug = await uniqueSlug(fields.slug?.trim() || fields.name, id);
  const { error } = await admin
    .from("products")
    .update({ ...fields, slug })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll(slug);
  return { ok: true, slug };
}

export async function setProductActive(id: string, active: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("products").update({ active }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
  return { ok: true };
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
  redirect("/admin/products");
}

export interface VariantInput {
  id?: string;
  weight_grams: number;
  label: string;
  price: number;
  mrp: number | null;
  sku: string | null;
  stock_qty: number;
  active: boolean;
  sort_order: number;
}

/** Replace the product's variants with the given set (upsert + delete removed). */
export async function saveVariants(productId: string, variants: VariantInput[]) {
  await requireAdmin();
  const admin = createAdminClient();

  // Delete variants removed in the UI (FK on order_items is ON DELETE SET NULL).
  const keepIds = variants.filter((v) => v.id).map((v) => v.id as string);
  const { data: existing } = await admin
    .from("product_variants")
    .select("id")
    .eq("product_id", productId);
  const toDelete = (existing ?? [])
    .map((r) => r.id as string)
    .filter((id) => !keepIds.includes(id));
  if (toDelete.length) {
    await admin.from("product_variants").delete().in("id", toDelete);
  }

  for (const v of variants) {
    const row = {
      product_id: productId,
      weight_grams: v.weight_grams,
      label: v.label,
      price: v.price,
      mrp: v.mrp,
      sku: v.sku,
      stock_qty: v.stock_qty,
      active: v.active,
      sort_order: v.sort_order,
    };
    if (v.id) {
      await admin.from("product_variants").update(row).eq("id", v.id);
    } else {
      await admin.from("product_variants").insert(row);
    }
  }

  revalidateAll();
  return { ok: true };
}

export async function addProductImage(
  productId: string,
  url: string,
  alt: string | null,
) {
  await requireAdmin();
  const admin = createAdminClient();
  const { count } = await admin
    .from("product_images")
    .select("*", { count: "exact", head: true })
    .eq("product_id", productId);
  const { error } = await admin.from("product_images").insert({
    product_id: productId,
    url,
    alt,
    sort_order: count ?? 0,
  });
  if (error) throw new Error(error.message);
  revalidateAll();
  return { ok: true };
}

export async function updateImageAlt(id: string, alt: string) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from("product_images").update({ alt }).eq("id", id);
  revalidateAll();
  return { ok: true };
}

export async function deleteImage(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from("product_images").delete().eq("id", id);
  revalidateAll();
  return { ok: true };
}

/** Persist an explicit image order (array of image ids in desired order). */
export async function reorderImages(orderedIds: string[]) {
  await requireAdmin();
  const admin = createAdminClient();
  for (let i = 0; i < orderedIds.length; i++) {
    await admin
      .from("product_images")
      .update({ sort_order: i })
      .eq("id", orderedIds[i]);
  }
  revalidateAll();
  return { ok: true };
}

export async function saveRelated(productId: string, relatedIds: string[]) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from("product_related").delete().eq("product_id", productId);
  if (relatedIds.length) {
    await admin.from("product_related").insert(
      relatedIds.map((rid, i) => ({
        product_id: productId,
        related_product_id: rid,
        sort_order: i,
      })),
    );
  }
  revalidateAll();
  return { ok: true };
}
