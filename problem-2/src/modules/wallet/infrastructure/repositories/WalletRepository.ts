import type { Holding } from "../entities/Holding.entity";
import { WalletMapper } from "../mappers/Wallet.mapper";
import { WalletStorageService } from "../services/WalletStorageService";
import type { IWalletRepository } from "./IWalletRepository";
import type { WalletRepositoryOptions } from "./WalletRepository.types";

const DEFAULT_INITIAL_HOLDINGS: Holding[] = [
  { symbol: "USDC", amount: 10_000 },
];

export class WalletRepository implements IWalletRepository {
  private readonly service: WalletStorageService;
  private readonly initialHoldings: Holding[];

  constructor({
    service = new WalletStorageService(),
    initialHoldings = DEFAULT_INITIAL_HOLDINGS,
  }: WalletRepositoryOptions = {}) {
    this.service = service;
    this.initialHoldings = initialHoldings;
  }

  async getHoldings(): Promise<Holding[]> {
    const dto = await this.service.read();
    if (dto) return WalletMapper.toHoldings(dto);

    await this.saveHoldings(this.initialHoldings);
    return this.initialHoldings.map((holding) => ({ ...holding }));
  }

  async saveHoldings(holdings: Holding[]): Promise<void> {
    await this.service.write(WalletMapper.toDto(holdings));
  }
}
