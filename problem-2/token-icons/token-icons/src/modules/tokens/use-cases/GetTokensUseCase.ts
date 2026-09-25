import type { Token } from "../infrastructure/entities/Token.entity";
import type { ITokenRepository } from "../infrastructure/repositories/ITokenRepository";

export class GetTokensUseCase {
  private readonly repository: ITokenRepository;

  constructor(repository: ITokenRepository) {
    this.repository = repository;
  }

  async execute(): Promise<Token[]> {
    const tokens = await this.repository.findAll();
    return tokens.sort((a, b) => a.symbol.localeCompare(b.symbol));
  }
}
