import { parseAssetPath } from "@/shared/utils/parseAssetPath";
import type { TokenDto } from "../dtos/Token.dto";
import type { Token } from "../entities/Token.entity";

export const TokenMapper = {
  toEntity({ path, url }: TokenDto): Token {
    const { fileName, name, format } = parseAssetPath(path);
    return { symbol: name, fileName, format, url };
  },
};
