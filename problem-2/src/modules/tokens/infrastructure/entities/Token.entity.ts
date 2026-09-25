import type { IconFormat } from "@/shared/types/Asset.types";

export interface Token {
  symbol: string;
  fileName: string;
  format: IconFormat;
  url: string;
}
