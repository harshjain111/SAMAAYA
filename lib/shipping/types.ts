/**
 * ShippingProvider abstraction (CLAUDE.md §ARCHITECTURE RULES, PRD §5.7).
 * Order logic depends ONLY on this interface — never on a concrete provider.
 * Launch uses ManualProvider; a ShiprocketProvider drops in later without
 * touching any calling code.
 */

export interface ShippingAddress {
  name?: string;
  phone?: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  pincode: string;
}

/** What the caller hands the provider to create/record a shipment. */
export interface ShipmentInput {
  orderNumber: string;
  address: ShippingAddress;
  /** Manual entry: admin-typed courier/AWB/tracking. Ignored by API providers. */
  courier?: string | null;
  awbNumber?: string | null;
  trackingUrl?: string | null;
  /** Total order weight in grams — used by API providers for rate/label. */
  weightGrams?: number;
}

/** Normalized shipment result stored on the order. */
export interface ShipmentResult {
  courier: string | null;
  awbNumber: string | null;
  trackingUrl: string | null;
}

/** Normalized tracking snapshot. */
export interface TrackingInfo {
  awbNumber: string | null;
  status: string;
  trackingUrl: string | null;
  /** True when status comes from a live API; false for manual entries. */
  live: boolean;
}

export interface ShippingProvider {
  /** Stable identifier, e.g. "manual" | "shiprocket". */
  readonly name: string;
  /** Create or record a shipment for an order. */
  createShipment(input: ShipmentInput): Promise<ShipmentResult>;
  /** Fetch tracking for an AWB. Manual provider has no live feed. */
  getTracking(awbNumber: string): Promise<TrackingInfo>;
}
