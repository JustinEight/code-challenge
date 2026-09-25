import type { PriceDto } from "../dtos/Price.dto";
import type { PriceApiServiceOptions } from "./PriceApiService.types";

const DEFAULT_URL = "https://interview.switcheo.com/prices.json";

function isPriceDto(value: unknown): value is PriceDto {
  if (typeof value !== "object" || value === null) return false;
  const { currency, date, price } = value as Partial<PriceDto>;
  return (
    typeof currency === "string" &&
    typeof date === "string" &&
    typeof price === "number" &&
    Number.isFinite(price) &&
    price > 0 &&
    !Number.isNaN(Date.parse(date))
  );
}

export class PriceApiService {
  private readonly url: string;
  private readonly fetcher: typeof fetch;

  constructor({
    url = DEFAULT_URL,
    fetcher = (...args) => fetch(...args),
  }: PriceApiServiceOptions = {}) {
    this.url = url;
    this.fetcher = fetcher;
  }

  async getPrices(): Promise<PriceDto[]> {
    const response = await this.fetcher(this.url);
    if (!response.ok)
      throw new Error(`Price service responded with ${response.status}`);

    const body: unknown = await response.json();
    if (!Array.isArray(body))
      throw new Error("Price service returned an unexpected response");

    return body.filter(isPriceDto);
  }
}
