import { readJson, writeJson } from "@/shared/utils/jsonStorage";
import type { WalletDto } from "../dtos/Wallet.dto";
import type { WalletStorageServiceOptions } from "./WalletStorageService.types";

const DEFAULT_STORAGE_KEY = "wallet";

function isWalletDto(value: unknown): value is WalletDto {
  if (typeof value !== "object" || value === null) return false;
  const { holdings } = value as Partial<WalletDto>;
  return (
    Array.isArray(holdings) &&
    holdings.every(
      (holding) =>
        typeof holding?.symbol === "string" &&
        typeof holding?.amount === "number",
    )
  );
}

export class WalletStorageService {
  private readonly storageKey: string;

  constructor({
    storageKey = DEFAULT_STORAGE_KEY,
  }: WalletStorageServiceOptions = {}) {
    this.storageKey = storageKey;
  }

  async read(): Promise<WalletDto | null> {
    return readJson(this.storageKey, isWalletDto);
  }

  async write(dto: WalletDto): Promise<void> {
    writeJson(this.storageKey, dto);
  }
}
