import type { Holding } from "../entities/Holding.entity";
import type { WalletStorageService } from "../services/WalletStorageService";

export interface WalletRepositoryOptions {
  service?: WalletStorageService;
  initialHoldings?: Holding[];
}
