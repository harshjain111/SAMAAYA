import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Product,
  ProductVariant,
  ProductImage,
  Moment,
} from "@/types/database";

export interface AdminProductRow {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  featured: boolean;
  moment: Moment | null;
  strength: number | null;
  sort_order: number;
  variantCount: number;
  priceFrom: number | null;
  totalStock: number;
  image: string | null;
}

export interface AdminProductFull {
  product: Product;
  variants: ProductVariant[];
  images: ProductImage[];
  relatedIds: string[];
}

/** Products list for admin (includes inactive). Optional search + filters. */
export async function getAdminProducts(opts?: {
  search?: string;
  active?: "active" | "inactive";
}): Promise<AdminProductRow[]> {
  const admin = createAdminClient();
  let query = admin
    .from("products")
    .select(
      "id, name, slug, active, featured, moment, strength, sort_order, product_variants(price, stock_qty, active), product_images(url, sort_order)",
    )
    .order("sort_order", { ascending: true });

  if (opts?.search) query = query.ilike("name", `%${opts.search}%`);
  if (opts?.active === "active") query = query.eq("active", true);
  if (opts?.active === "inactive") query = query.eq("active", false);

  const { data, error } = await query;
  if (error) {
    console.error("[getAdminProducts]", error.message);
    return [];
  }

  return (data ?? []).map((p) => {
    const variants = (p.product_variants ?? []) as {
      price: number;
      stock_qty: number;
      active: boolean;
    }[];
    const activeVariants = variants.filter((v) => v.active);
    const images = (p.product_images ?? []) as { url: string; sort_order: number }[];
    const firstImage = images
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)[0]?.url ?? null;

    return {
      id: p.id as string,
      name: p.name as string,
      slug: p.slug as string,
      active: p.active as boolean,
      featured: p.featured as boolean,
      moment: p.moment as Moment | null,
      strength: p.strength as number | null,
      sort_order: p.sort_order as number,
      variantCount: variants.length,
      priceFrom: activeVariants.length
        ? Math.min(...activeVariants.map((v) => Number(v.price)))
        : null,
      totalStock: variants.reduce((s, v) => s + Number(v.stock_qty), 0),
      image: firstImage,
    };
  });
}

/** Full product for the editor (all variants/images/related, incl. inactive). */
export async function getAdminProduct(id: string): Promise<AdminProductFull | null> {
  const admin = createAdminClient();
  const { data: product } = await admin
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!product) return null;

  const [{ data: variants }, { data: images }, { data: related }] =
    await Promise.all([
      admin
        .from("product_variants")
        .select("*")
        .eq("product_id", id)
        .order("sort_order", { ascending: true }),
      admin
        .from("product_images")
        .select("*")
        .eq("product_id", id)
        .order("sort_order", { ascending: true }),
      admin
        .from("product_related")
        .select("related_product_id, sort_order")
        .eq("product_id", id)
        .order("sort_order", { ascending: true }),
    ]);

  return {
    product: product as Product,
    variants: (variants ?? []) as ProductVariant[],
    images: (images ?? []) as ProductImage[],
    relatedIds: (related ?? []).map((r) => r.related_product_id as string),
  };
}

/** Minimal list of other products, for the "related products" picker. */
export async function getProductsForRelatedPicker(
  excludeId?: string,
): Promise<{ id: string; name: string }[]> {
  const admin = createAdminClient();
  let q = admin.from("products").select("id, name").order("name");
  if (excludeId) q = q.neq("id", excludeId);
  const { data } = await q;
  return (data ?? []) as { id: string; name: string }[];
}
