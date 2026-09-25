import type { IconFormat } from "@/shared/types/Asset.types";

export interface ParsedAssetPath {
  fileName: string;
  name: string;
  format: IconFormat;
}

export function parseAssetPath(path: string): ParsedAssetPath {
  const fileName = path.slice(path.lastIndexOf("/") + 1);
  const dot = fileName.lastIndexOf(".");
  const extension = fileName.slice(dot + 1).toLowerCase();

  return {
    fileName,
    name: fileName.slice(0, dot),
    format: extension === "png" ? "png" : "svg",
  };
}
