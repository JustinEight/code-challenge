import type { Token } from "../entities/Token.entity";
import { TokenMapper } from "../mappers/Token.mapper";
import { TokenAssetService } from "../services/TokenAssetService";
import type { ITokenRepository } from "./ITokenRepository";
import type { TokenRepositoryOptions } from "./TokenRepository.types";

export class TokenRepository implements ITokenRepository {
  private readonly service: TokenAssetService;

  constructor({
    service = new TokenAssetService(),
  }: TokenRepositoryOptions = {}) {
    this.service = service;
  }

  async findAll(): Promise<Token[]> {
    const dtos = await this.service.getAll();
    return dtos.map(TokenMapper.toEntity);
  }
}
