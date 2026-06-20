import { createPublicClient } from "@/lib/supabase/public";
import type { CardVariant } from "@/components/ui";
import type { Moment } from "@/types/database";

/** Product shape ready to feed ProductCard + listing pages. */
export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  tastingNote: string | null;
  strength: number | null;
  moment: Moment | null;
  featured: boolean;
  image: { url: string; alt: string | null } | null;
  variants: CardVariant[];
  /** Lowest active variant price, for "From ₹X" and sorting. */
  priceFrom: number;
}

// Raw row shapes from the nested select.
interface RawVariant {
  id: string;
  label: string;
  price: number | string;
  mrp: number | string | null;
  active: boolean;
  sort_order: number;
}
interface RawImage {
  url: string;
  alt: string | null;
  sort_order: number;
}
interface RawProduct {
  id: string;
  name: string;
  slug: string;
  short_tasting_note: string | null;
  strength: number | null;
  moment: Moment | null;
  featured: boolean;
  sort_order: number;
  product_variants: RawVariant[];
  product_images: RawImage[];
}

const num = (v: number | string | null): number | null =>
  v === null ? null : typeof v === "string" ? parseFloat(v) : v;

function mapProduct(p: RawProduct): ProductListItem {
  const variants: CardVariant[] = (p.product_variants ?? [])
    .filter((v) => v.active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((v) => ({
      id: v.id,
      label: v.label,
      price: num(v.price) ?? 0,
      mrp: num(v.mrp),
    }));

  const image =
    (p.product_images ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((i) => ({ url: i.url, alt: i.alt }))[0] ?? null;

  const priceFrom = variants.length
    ? Math.min(...variants.map((v) => v.price))
    : 0;

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    tastingNote: p.short_tasting_note,
    strength: p.strength,
    moment: p.moment,
    featured: p.featured,
    image,
    variants,
    priceFrom,
  };
}

const SELECT = `
  id, name, slug, short_tasting_note, strength, moment, featured, sort_order,
  product_variants ( id, label, price, mrp, active, sort_order ),
  product_images ( url, alt, sort_order )
`;

/** Full product for the detail page. */
export interface DetailVariant extends CardVariant {
  weightGrams?: number;
  stockQty: number;
}
export interface ProductImageItem {
  url: string;
  alt: string | null;
}
export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  tastingNote: string | null;
  description: string | null;
  story: string | null;
  originRegion: string | null;
  strength: number | null;
  moment: Moment | null;
  brewTemp: string | null;
  brewTime: string | null;
  images: ProductImageItem[];
  variants: DetailVariant[];
  priceFrom: number;
}

const DETAIL_SELECT = `
  id, name, slug, short_tasting_note, description, story, origin_region,
  strength, moment, brew_temp, brew_time,
  product_variants ( id, label, price, mrp, weight_grams, stock_qty, active, sort_order ),
  product_images ( url, alt, sort_order )
`;

interface RawDetailVariant extends RawVariant {
  weight_grams: number;
  stock_qty: number;
}
interface RawDetail {
  id: string;
  name: string;
  slug: string;
  short_tasting_note: string | null;
  description: string | null;
  story: string | null;
  origin_region: string | null;
  strength: number | null;
  moment: Moment | null;
  brew_temp: string | null;
  brew_time: string | null;
  product_variants: RawDetailVariant[];
  product_images: RawImage[];
}

/** One active product by slug, with all images + buyable variants. */
export async function getProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(DETAIL_SELECT)
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    console.error("[getProductBySlug]", error.message);
    return null;
  }
  if (!data) return null;

  const p = data as unknown as RawDetail;
  const variants: DetailVariant[] = (p.product_variants ?? [])
    .filter((v) => v.active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((v) => ({
      id: v.id,
      label: v.label,
      price: num(v.price) ?? 0,
      mrp: num(v.mrp),
      weightGrams: v.weight_grams,
      stockQty: v.stock_qty,
    }));

  if (variants.length === 0) return null;

  const images: ProductImageItem[] = (p.product_images ?? [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => ({ url: i.url, alt: i.alt }));

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    tastingNote: p.short_tasting_note,
    description: p.description,
    story: p.story,
    originRegion: p.origin_region,
    strength: p.strength,
    moment: p.moment,
    brewTemp: p.brew_temp,
    brewTime: p.brew_time,
    images,
    variants,
    priceFrom: Math.min(...variants.map((v) => v.price)),
  };
}

/** Slugs of all active products — for generateStaticParams (SSG). */
export async function getAllProductSlugs(): Promise<string[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("slug")
    .eq("active", true);
  if (error) {
    console.error("[getAllProductSlugs]", error.message);
    return [];
  }
  return (data ?? []).map((r) => r.slug as string);
}

/**
 * "You may also like" — admin-set product_related first; fallback to same
 * moment, then closest strength. Always excludes the product itself.
 */
export async function getRelatedProducts(
  product: Pick<ProductDetail, "id" | "moment" | "strength">,
  limit = 3,
): Promise<ProductListItem[]> {
  const supabase = createPublicClient();

  // 1) Admin-curated related.
  const { data: rel } = await supabase
    .from("product_related")
    .select("related_product_id, sort_order")
    .eq("product_id", product.id)
    .order("sort_order", { ascending: true });

  const relatedIds = (rel ?? []).map((r) => r.related_product_id as string);

  if (relatedIds.length) {
    const { data } = await supabase
      .from("products")
      .select(SELECT)
      .eq("active", true)
      .in("id", relatedIds);
    const items = ((data as unknown as RawProduct[]) ?? [])
      .map(mapProduct)
      .filter((p) => p.variants.length > 0);
    // preserve curated order
    items.sort(
      (a, b) => relatedIds.indexOf(a.id) - relatedIds.indexOf(b.id),
    );
    // Use admin-curated relations whenever any exist (even if fewer than limit).
    if (items.length) return items.slice(0, limit);
  }

  // 2) Fallback (only when no curated relations): same moment, excluding self.
  let q = supabase
    .from("products")
    .select(SELECT)
    .eq("active", true)
    .neq("id", product.id);
  if (product.moment) q = q.eq("moment", product.moment);

  const { data: fb } = await q.limit(limit + 3);
  let items = ((fb as unknown as RawProduct[]) ?? [])
    .map(mapProduct)
    .filter((p) => p.variants.length > 0);

  // sort by closeness in strength when available
  if (typeof product.strength === "number") {
    items = items.sort(
      (a, b) =>
        Math.abs((a.strength ?? 3) - product.strength!) -
        Math.abs((b.strength ?? 3) - product.strength!),
    );
  }
  return items.slice(0, limit);
}

/** All active products, ordered by sort_order. RLS restricts to active rows. */
export async function getActiveProducts(options?: {
  moment?: Moment;
}): Promise<ProductListItem[]> {
  const supabase = createPublicClient();
  let query = supabase
    .from("products")
    .select(SELECT)
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (options?.moment) query = query.eq("moment", options.moment);

  const { data, error } = await query;
  if (error) {
    console.error("[getActiveProducts]", error.message);
    return [];
  }
  // Drop products with no buyable variant.
  return (data as unknown as RawProduct[])
    .map(mapProduct)
    .filter((p) => p.variants.length > 0);
}
