import type { WalletDto } from "../dtos/Wallet.dto";
import type { Holding } from "../entities/Holding.entity";

export const WalletMapper = {
  toHoldings(dto: WalletDto): Holding[] {
    return dto.holdings.map(({ symbol, amount }) => ({ symbol, amount }));
  },

  toDto(holdings: readonly Holding[]): WalletDto {
    return {
      holdings: holdings.map(({ symbol, amount }) => ({ symbol, amount })),
    };
  },
};
