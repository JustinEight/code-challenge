import type { Token } from "../infrastructure/entities/Token.entity";

export type TokenIconLookup = (symbol: string) => string | undefined;

export function createTokenIconLookup(
  tokens: readonly Token[],
): TokenIconLookup {
  const exact = new Map<string, string>();
  const insensitive = new Map<string, string>();

  for (const token of tokens) {
    exact.set(token.symbol, token.url);
    const key = token.symbol.toLowerCase();
    if (!insensitive.has(key)) insensitive.set(key, token.url);
  }

  return (symbol) => exact.get(symbol) ?? insensitive.get(symbol.toLowerCase());
}
