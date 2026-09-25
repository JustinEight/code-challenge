import { IconCard } from "./IconCard";
import { VirtualIconRows } from "./VirtualIconRows";
import "./IconGrid.css";

export interface IconGridItem {
  id: string;
  label: string;
  url: string;
  title?: string;
}

export type IconGridHoverEffect = "none" | "grow" | "grow-spin";

interface IconGridProps {
  items: readonly IconGridItem[];
  hoverEffect?: IconGridHoverEffect;
  virtualized?: boolean;
}

export function IconGrid({
  items,
  hoverEffect = "none",
  virtualized = false,
}: IconGridProps) {
  const hoverClass = `icon-grid--hover-${hoverEffect}`;

  return virtualized ? (
    <VirtualIconRows items={items} className={hoverClass} />
  ) : (
    <div role="list" className={`icon-grid ${hoverClass}`}>
      {items.map((item) => (
        <IconCard key={item.id} item={item} />
      ))}
    </div>
  );
}
