/** Shared checkout validation (India formats). Used client + server. */

export interface ContactInput {
  name: string;
  phone: string;
  email: string;
}
export interface AddressInput {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Indian mobile: 10 digits starting 6–9 (optionally +91 / 0 prefix). */
export function isValidPhone(phone: string): boolean {
  const d = phone.replace(/\D/g, "");
  const ten = d.length === 12 && d.startsWith("91") ? d.slice(2) : d.length === 11 && d.startsWith("0") ? d.slice(1) : d;
  return /^[6-9]\d{9}$/.test(ten);
}

/** Indian PIN code: 6 digits, not starting 0. */
export function isValidPincode(pin: string): boolean {
  return /^[1-9]\d{5}$/.test(pin.trim());
}

export interface ValidationResult {
  ok: boolean;
  errors: Record<string, string>;
}

export function validateCheckout(
  contact: ContactInput,
  address: AddressInput,
): ValidationResult {
  const errors: Record<string, string> = {};
  if (!contact.name.trim()) errors.name = "Name is required";
  if (!isValidPhone(contact.phone)) errors.phone = "Enter a valid 10-digit mobile number";
  if (!isValidEmail(contact.email)) errors.email = "Enter a valid email";
  if (!address.line1.trim()) errors.line1 = "Address is required";
  if (!address.city.trim()) errors.city = "City is required";
  if (!address.state.trim()) errors.state = "State is required";
  if (!isValidPincode(address.pincode)) errors.pincode = "Enter a valid 6-digit PIN code";
  return { ok: Object.keys(errors).length === 0, errors };
}
