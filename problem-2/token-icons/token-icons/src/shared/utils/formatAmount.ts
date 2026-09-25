export const MAX_AMOUNT_FRACTION_DIGITS = 18;

const formatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: MAX_AMOUNT_FRACTION_DIGITS,
});

export function formatAmount(amount: number): string {
  return formatter.format(amount);
}
