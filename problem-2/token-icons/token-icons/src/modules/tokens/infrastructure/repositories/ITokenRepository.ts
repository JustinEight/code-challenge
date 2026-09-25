import type { Token } from "../entities/Token.entity";

export interface ITokenRepository {
  findAll(): Promise<Token[]>;
}
