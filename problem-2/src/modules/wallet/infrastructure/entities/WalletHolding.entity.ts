import type { Holding } from "./Holding.entity";

export interface WalletHolding extends Holding {
  iconUrl?: string;
}
