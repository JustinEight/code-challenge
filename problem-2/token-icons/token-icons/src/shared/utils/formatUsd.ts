const standard = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const small = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumSignificantDigits: 4,
});

export function formatUsd(value: number): string {
  return value !== 0 && Math.abs(value) < 1
    ? small.format(value)
    : standard.format(value);
}
