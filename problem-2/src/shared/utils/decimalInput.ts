import { MAX_AMOUNT_FRACTION_DIGITS } from "@/shared/utils/formatAmount";

const inputFormatter = new Intl.NumberFormat("en-US", {
  useGrouping: false,
  maximumFractionDigits: MAX_AMOUNT_FRACTION_DIGITS,
});

export function sanitizeDecimalInput(raw: string): string {
  const normalized = raw.replace(/,/g, ".").replace(/[^\d.]/g, "");
  const [whole, ...rest] = normalized.split(".");
  return rest.length > 0 ? `${whole}.${rest.join("")}` : whole;
}

export function parseDecimalInput(text: string): number | null {
  if (!/^(\d+\.?\d*|\.\d+)$/.test(text)) return null;
  const value = Number(text);
  return Number.isFinite(value) ? value : null;
}

export function toDecimalInput(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "";
  return inputFormatter.format(value);
}
