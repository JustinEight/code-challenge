import { parseAssetPath } from "@/shared/utils/parseAssetPath";
import type { BlockchainDto } from "../dtos/Blockchain.dto";
import type { Blockchain } from "../entities/Blockchain.entity";

export const BlockchainMapper = {
  toEntity({ path, url }: BlockchainDto): Blockchain {
    const { fileName, name, format } = parseAssetPath(path);
    return { name, fileName, format, url };
  },
};
