import type { ITokenRepository } from "@/modules/tokens/infrastructure/repositories/ITokenRepository";
import { createTokenIconLookup } from "@/modules/tokens/use-cases/createTokenIconLookup";
import type { WalletHolding } from "../infrastructure/entities/WalletHolding.entity";
import type { IWalletRepository } from "../infrastructure/repositories/IWalletRepository";

export class GetWalletHoldingsUseCase {
  private readonly walletRepository: IWalletRepository;
  private readonly tokenRepository: ITokenRepository;

  constructor(
    walletRepository: IWalletRepository,
    tokenRepository: ITokenRepository,
  ) {
    this.walletRepository = walletRepository;
    this.tokenRepository = tokenRepository;
  }

  async execute(): Promise<WalletHolding[]> {
    const [holdings, tokens] = await Promise.all([
      this.walletRepository.getHoldings(),
      this.tokenRepository.findAll(),
    ]);
    const findIcon = createTokenIconLookup(tokens);

    return holdings
      .filter((holding) => holding.amount > 0)
      .map((holding) => ({ ...holding, iconUrl: findIcon(holding.symbol) }))
      .sort((a, b) => b.amount - a.amount || a.symbol.localeCompare(b.symbol));
  }
}
