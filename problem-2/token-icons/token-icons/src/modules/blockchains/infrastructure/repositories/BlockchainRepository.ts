import type { Blockchain } from "../entities/Blockchain.entity";
import { BlockchainMapper } from "../mappers/Blockchain.mapper";
import { BlockchainAssetService } from "../services/BlockchainAssetService";
import type { BlockchainRepositoryOptions } from "./BlockchainRepository.types";
import type { IBlockchainRepository } from "./IBlockchainRepository";

export class BlockchainRepository implements IBlockchainRepository {
  private readonly service: BlockchainAssetService;

  constructor({
    service = new BlockchainAssetService(),
  }: BlockchainRepositoryOptions = {}) {
    this.service = service;
  }

  async findAll(): Promise<Blockchain[]> {
    const dtos = await this.service.getAll();
    return dtos.map(BlockchainMapper.toEntity);
  }
}
