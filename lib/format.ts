/** Shared display formatters. */

export const inr = (n: number | string | null | undefined): string => {
  const v = typeof n === "string" ? parseFloat(n) : (n ?? 0);
  return `₹${Math.round(v).toLocaleString("en-IN")}`;
};

export const fmtDate = (s: string): string =>
  new Date(s).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const fmtDateTime = (s: string): string =>
  new Date(s).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
