import type { ITokenRepository } from "@/modules/tokens/infrastructure/repositories/ITokenRepository";
import { createTokenIconLookup } from "@/modules/tokens/use-cases/createTokenIconLookup";
import type { IWalletRepository } from "@/modules/wallet/infrastructure/repositories/IWalletRepository";
import type { SwapAsset } from "../infrastructure/entities/SwapAsset.entity";
import type { IPriceRepository } from "../infrastructure/repositories/IPriceRepository";

export interface SwapAssets {
  assets: SwapAsset[];
  pricesUpdatedAt: Date | null;
}

export class GetSwapAssetsUseCase {
  private readonly walletRepository: IWalletRepository;
  private readonly priceRepository: IPriceRepository;
  private readonly tokenRepository: ITokenRepository;

  constructor(
    walletRepository: IWalletRepository,
    priceRepository: IPriceRepository,
    tokenRepository: ITokenRepository,
  ) {
    this.walletRepository = walletRepository;
    this.priceRepository = priceRepository;
    this.tokenRepository = tokenRepository;
  }

  async execute(): Promise<SwapAssets> {
    const [holdings, prices, tokens] = await Promise.all([
      this.walletRepository.getHoldings(),
      this.priceRepository.findAll(),
      this.tokenRepository.findAll(),
    ]);
    const findIcon = createTokenIconLookup(tokens);

    const assets = new Map<string, SwapAsset>();
    for (const price of prices) {
      assets.set(price.currency, {
        symbol: price.currency,
        balance: 0,
        usdPrice: price.usd,
      });
    }
    for (const holding of holdings) {
      const asset = assets.get(holding.symbol) ?? {
        symbol: holding.symbol,
        balance: 0,
      };
      assets.set(holding.symbol, {
        ...asset,
        balance: asset.balance + holding.amount,
      });
    }

    const pricesUpdatedAt = prices.reduce<Date | null>(
      (latest, price) =>
        !latest || price.updatedAt > latest ? price.updatedAt : latest,
      null,
    );

    return {
      assets: [...assets.values()]
        .map((asset) => ({ ...asset, iconUrl: findIcon(asset.symbol) }))
        .sort((a, b) =>
          a.symbol.localeCompare(b.symbol, undefined, { sensitivity: "base" }),
        ),
      pricesUpdatedAt,
    };
  }
}
