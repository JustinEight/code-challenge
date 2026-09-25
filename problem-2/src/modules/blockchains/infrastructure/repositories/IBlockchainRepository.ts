import type { Blockchain } from "../entities/Blockchain.entity";

export interface IBlockchainRepository {
  findAll(): Promise<Blockchain[]>;
}
