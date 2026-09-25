import type { Blockchain } from "../infrastructure/entities/Blockchain.entity";
import type { IBlockchainRepository } from "../infrastructure/repositories/IBlockchainRepository";

export class GetBlockchainsUseCase {
  private readonly repository: IBlockchainRepository;

  constructor(repository: IBlockchainRepository) {
    this.repository = repository;
  }

  async execute(): Promise<Blockchain[]> {
    const blockchains = await this.repository.findAll();
    return blockchains.sort((a, b) => a.name.localeCompare(b.name));
  }
}
