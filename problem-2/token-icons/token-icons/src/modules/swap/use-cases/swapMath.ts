export function convertAmount(
  amount: number,
  fromUsdPrice: number,
  toUsdPrice: number,
): number {
  return (amount * fromUsdPrice) / toUsdPrice;
}

export function toUsdValue(amount: number, usdPrice: number): number {
  return amount * usdPrice;
}
