import type { Price } from "../entities/Price.entity";
import { PriceMapper } from "../mappers/Price.mapper";
import { PriceApiService } from "../services/PriceApiService";
import type { IPriceRepository } from "./IPriceRepository";
import type { PriceRepositoryOptions } from "./PriceRepository.types";

export class PriceRepository implements IPriceRepository {
  private readonly service: PriceApiService;
  private cache: Promise<Price[]> | null = null;

  constructor({
    service = new PriceApiService(),
  }: PriceRepositoryOptions = {}) {
    this.service = service;
  }

  findAll(): Promise<Price[]> {
    if (!this.cache) {
      this.cache = this.service
        .getPrices()
        .then(PriceMapper.toEntities)
        .catch((error: unknown) => {
          this.cache = null;
          throw error;
        });
    }
    return this.cache;
  }
}
