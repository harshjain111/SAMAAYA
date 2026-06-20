import "server-only";
import type { ShippingProvider } from "./types";
import { ManualProvider } from "./manual";

export type {
  ShippingProvider,
  ShipmentInput,
  ShipmentResult,
  TrackingInfo,
  ShippingAddress,
} from "./types";
export { ManualProvider } from "./manual";

let provider: ShippingProvider | null = null;

/**
 * The single entry point order logic uses. Returns the active provider.
 * To add Shiprocket later: implement ShiprocketProvider, then switch here on
 * an env flag (e.g. SHIPPING_PROVIDER=shiprocket). No calling code changes.
 *
 *   const provider = getShippingProvider();
 *   await provider.createShipment(...);
 */
export function getShippingProvider(): ShippingProvider {
  if (provider) return provider;

  // switch (process.env.SHIPPING_PROVIDER) {
  //   case "shiprocket":
  //     provider = new ShiprocketProvider();
  //     break;
  //   default:
  //     provider = new ManualProvider();
  // }
  provider = new ManualProvider();
  return provider;
}
