import { AssetIcon } from "@/shared/components/AssetIcon/AssetIcon";
import type { IconGridItem } from "./IconGrid";

interface IconCardProps {
  item: IconGridItem;
}

export function IconCard({ item }: IconCardProps) {
  return (
    <div
      role="listitem"
      className="icon-grid__card"
      title={item.title ?? item.label}
    >
      <AssetIcon url={item.url} label={item.label} />
      <span>{item.label}</span>
    </div>
  );
}
