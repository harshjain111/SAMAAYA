import type {
  ShippingProvider,
  ShipmentInput,
  ShipmentResult,
  TrackingInfo,
} from "./types";

/**
 * ManualProvider — launch implementation (PRD §5.7).
 * The owner enters courier name, AWB, and tracking URL by hand in the admin
 * order page. This provider just normalizes and echoes those values; there is
 * no carrier API call. Tracking is whatever URL the owner pasted.
 *
 * Usage (admin "mark as shipped"):
 *   const provider = getShippingProvider();
 *   const result = await provider.createShipment({
 *     orderNumber: "SMY-2026-0001",
 *     address,
 *     courier: "Delhivery",
 *     awbNumber: "1234567890",
 *     trackingUrl: "https://www.delhivery.com/track/package/1234567890",
 *   });
 *   // -> persist result.courier / result.awbNumber / result.trackingUrl on the order
 */
export class ManualProvider implements ShippingProvider {
  readonly name = "manual";

  async createShipment(input: ShipmentInput): Promise<ShipmentResult> {
    return {
      courier: input.courier?.trim() || null,
      awbNumber: input.awbNumber?.trim() || null,
      trackingUrl: input.trackingUrl?.trim() || null,
    };
  }

  async getTracking(awbNumber: string): Promise<TrackingInfo> {
    // No live feed for manual shipping — the customer follows the courier URL
    // the owner saved on the order.
    return {
      awbNumber: awbNumber || null,
      status: "manual",
      trackingUrl: null,
      live: false,
    };
  }
}
