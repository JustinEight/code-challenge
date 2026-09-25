import type { Holding } from "../entities/Holding.entity";

export interface IWalletRepository {
  getHoldings(): Promise<Holding[]>;
  saveHoldings(holdings: Holding[]): Promise<void>;
}
