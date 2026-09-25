import type { AssetUrlMap } from "@/shared/types/Asset.types";
import type { BlockchainDto } from "../dtos/Blockchain.dto";
import type { BlockchainAssetServiceOptions } from "./BlockchainAssetService.types";

const BLOCKCHAIN_ASSETS = import.meta.glob<string>("/blockchains/*.{svg,png}", {
  eager: true,
  query: "?url",
  import: "default",
});

export class BlockchainAssetService {
  private readonly assets: AssetUrlMap;

  constructor({
    assets = BLOCKCHAIN_ASSETS,
  }: BlockchainAssetServiceOptions = {}) {
    this.assets = assets;
  }

  async getAll(): Promise<BlockchainDto[]> {
    return Object.entries(this.assets).map(([path, url]) => ({ path, url }));
  }
}
