import type { Price } from "../entities/Price.entity";

export interface IPriceRepository {
  findAll(): Promise<Price[]>;
}
