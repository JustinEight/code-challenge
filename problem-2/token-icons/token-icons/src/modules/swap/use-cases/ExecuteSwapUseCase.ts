import type { Holding } from "@/modules/wallet/infrastructure/entities/Holding.entity";
import type { IWalletRepository } from "@/modules/wallet/infrastructure/repositories/IWalletRepository";
import type { IPriceRepository } from "../infrastructure/repositories/IPriceRepository";
import { convertAmount } from "./swapMath";
import { resolveSendAmount, validateSwap } from "./validateSwap";

export interface SwapRequest {
  fromSymbol: string;
  toSymbol: string;
  amount: number;
}

export interface SwapResult {
  fromSymbol: string;
  toSymbol: string;
  fromAmount: number;
  toAmount: number;
}

const RELATIVE_DUST = 1e-12;

export class ExecuteSwapUseCase {
  private readonly walletRepository: IWalletRepository;
  private readonly priceRepository: IPriceRepository;

  constructor(
    walletRepository: IWalletRepository,
    priceRepository: IPriceRepository,
  ) {
    this.walletRepository = walletRepository;
    this.priceRepository = priceRepository;
  }

  async execute({
    fromSymbol,
    toSymbol,
    amount,
  }: SwapRequest): Promise<SwapResult> {
    const [holdings, prices] = await Promise.all([
      this.walletRepository.getHoldings(),
      this.priceRepository.findAll(),
    ]);
    const priceOf = (symbol: string) =>
      prices.find((price) => price.currency === symbol)?.usd;
    const balanceOf = (symbol: string) =>
      holdings
        .filter((holding) => holding.symbol === symbol)
        .reduce((sum, holding) => sum + holding.amount, 0);

    const from = {
      symbol: fromSymbol,
      balance: balanceOf(fromSymbol),
      usdPrice: priceOf(fromSymbol),
    };
    const to = {
      symbol: toSymbol,
      balance: balanceOf(toSymbol),
      usdPrice: priceOf(toSymbol),
    };

    const issue = validateSwap({ from, to, amount, hasAmountInput: true });
    if (issue) throw new Error(issue.message);

    const fromAmount = Math.min(
      resolveSendAmount(amount, from.balance),
      from.balance,
    );
    const toAmount = convertAmount(fromAmount, from.usdPrice!, to.usdPrice!);

    const balances = new Map<string, number>();
    for (const holding of holdings)
      balances.set(
        holding.symbol,
        (balances.get(holding.symbol) ?? 0) + holding.amount,
      );
    const fromRemaining = from.balance - fromAmount;
    balances.set(
      fromSymbol,
      fromRemaining > from.balance * RELATIVE_DUST ? fromRemaining : 0,
    );
    balances.set(toSymbol, to.balance + toAmount);

    const next: Holding[] = [...balances.entries()]
      .filter(([, balance]) => balance > 0)
      .map(([symbol, balance]) => ({ symbol, amount: balance }));

    await this.walletRepository.saveHoldings(next);

    return { fromSymbol, toSymbol, fromAmount, toAmount };
  }
}
