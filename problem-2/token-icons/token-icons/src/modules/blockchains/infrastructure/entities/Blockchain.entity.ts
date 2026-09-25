import type { IconFormat } from "@/shared/types/Asset.types";

export interface Blockchain {
  name: string;
  fileName: string;
  format: IconFormat;
  url: string;
}
