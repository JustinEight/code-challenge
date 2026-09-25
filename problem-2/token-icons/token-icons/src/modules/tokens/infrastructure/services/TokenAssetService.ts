import type { AssetUrlMap } from "@/shared/types/Asset.types";
import type { TokenDto } from "../dtos/Token.dto";
import type { TokenAssetServiceOptions } from "./TokenAssetService.types";

const TOKEN_ASSETS = import.meta.glob<string>("/tokens/*.{svg,png}", {
  eager: true,
  query: "?url",
  import: "default",
});

export class TokenAssetService {
  private readonly assets: AssetUrlMap;

  constructor({ assets = TOKEN_ASSETS }: TokenAssetServiceOptions = {}) {
    this.assets = assets;
  }

  async getAll(): Promise<TokenDto[]> {
    return Object.entries(this.assets).map(([path, url]) => ({ path, url }));
  }
}
