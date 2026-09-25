import type { PriceDto } from "../dtos/Price.dto";
import type { Price } from "../entities/Price.entity";

export const PriceMapper = {
  toEntities(dtos: readonly PriceDto[]): Price[] {
    const groups = new Map<string, { time: number; prices: number[] }>();

    for (const dto of dtos) {
      const time = Date.parse(dto.date);
      const group = groups.get(dto.currency);
      if (!group || time > group.time)
        groups.set(dto.currency, { time, prices: [dto.price] });
      else if (time === group.time) group.prices.push(dto.price);
    }

    return [...groups.entries()].map(([currency, { time, prices }]) => ({
      currency,
      usd: prices.reduce((sum, price) => sum + price, 0) / prices.length,
      updatedAt: new Date(time),
    }));
  },
};
