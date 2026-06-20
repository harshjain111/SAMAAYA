/**
 * Database types — hand-authored to mirror supabase/migrations/0001_schema.sql.
 * Shaped like `supabase gen types typescript` output so it can be regenerated
 * and dropped in later. Use via the typed clients in lib/supabase/*.
 *
 * Regenerate once the project is live:
 *   npx supabase gen types typescript --project-id <id> --schema public > types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type OrderStatus =
  | "new"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type Moment = "morning" | "afternoon" | "evening";

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: { user_id: string; created_at: string };
        Insert: { user_id: string; created_at?: string };
        Update: { user_id?: string; created_at?: string };
        Relationships: [];
      };
      products: {
        Row: {
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
          featured: boolean;
          active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          short_tasting_note?: string | null;
          description?: string | null;
          story?: string | null;
          origin_region?: string | null;
          strength?: number | null;
          moment?: Moment | null;
          brew_temp?: string | null;
          brew_time?: string | null;
          featured?: boolean;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          weight_grams: number;
          label: string;
          price: number;
          mrp: number | null;
          sku: string | null;
          stock_qty: number;
          active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          weight_grams: number;
          label: string;
          price: number;
          mrp?: number | null;
          sku?: string | null;
          stock_qty?: number;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["product_variants"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          alt?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["product_images"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_related: {
        Row: {
          product_id: string;
          related_product_id: string;
          sort_order: number;
        };
        Insert: {
          product_id: string;
          related_product_id: string;
          sort_order?: number;
        };
        Update: Partial<
          Database["public"]["Tables"]["product_related"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "product_related_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_related_related_product_id_fkey";
            columns: ["related_product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      customers: {
        Row: {
          id: string;
          name: string | null;
          email: string | null;
          phone: string | null;
          auth_user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          auth_user_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["customers"]["Insert"]>;
        Relationships: [];
      };
      addresses: {
        Row: {
          id: string;
          customer_id: string;
          line1: string;
          line2: string | null;
          city: string;
          state: string;
          pincode: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          line1: string;
          line2?: string | null;
          city: string;
          state: string;
          pincode: string;
          is_default?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["addresses"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "addresses_customer_id_fkey";
            columns: ["customer_id"];
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string | null;
          status: OrderStatus;
          payment_status: PaymentStatus;
          payment_method: string | null;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          subtotal: number;
          shipping_fee: number;
          discount: number;
          total: number;
          courier: string | null;
          awb_number: string | null;
          tracking_url: string | null;
          shipping_address: Json | null;
          source: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_id?: string | null;
          status?: OrderStatus;
          payment_status?: PaymentStatus;
          payment_method?: string | null;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          subtotal?: number;
          shipping_fee?: number;
          discount?: number;
          total?: number;
          courier?: string | null;
          awb_number?: string | null;
          tracking_url?: string | null;
          shipping_address?: Json | null;
          source?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey";
            columns: ["customer_id"];
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          variant_id: string | null;
          product_name: string;
          weight_label: string;
          unit_price: number;
          quantity: number;
          line_total: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          variant_id?: string | null;
          product_name: string;
          weight_label: string;
          unit_price: number;
          quantity: number;
          line_total: number;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_variant_id_fkey";
            columns: ["variant_id"];
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
        ];
      };
      order_status_history: {
        Row: {
          id: string;
          order_id: string;
          status: string;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          status: string;
          note?: string | null;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["order_status_history"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey";
            columns: ["order_id"];
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      store_settings: {
        Row: {
          id: string;
          shipping_fee: number;
          free_shipping_threshold: number;
          whatsapp_number: string | null;
          contact_email: string | null;
          store_name: string;
          announcement_bar: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          shipping_fee?: number;
          free_shipping_threshold?: number;
          whatsapp_number?: string | null;
          contact_email?: string | null;
          store_name?: string;
          announcement_bar?: string | null;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["store_settings"]["Insert"]
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

/** Convenience row aliases. */
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductVariant =
  Database["public"]["Tables"]["product_variants"]["Row"];
export type ProductImage =
  Database["public"]["Tables"]["product_images"]["Row"];
export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type Address = Database["public"]["Tables"]["addresses"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type StoreSettings =
  Database["public"]["Tables"]["store_settings"]["Row"];
