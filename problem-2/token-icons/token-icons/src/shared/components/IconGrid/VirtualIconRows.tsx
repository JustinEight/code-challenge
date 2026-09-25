import { useMemo } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useElementLayout } from "@/shared/hooks/useElementLayout";
import { IconCard } from "./IconCard";
import type { IconGridItem } from "./IconGrid";

const DEFAULT_MIN_CARD_WIDTH = 110;
const DEFAULT_GAP = 12;
const ESTIMATED_ROW_HEIGHT = 120;
const OVERSCAN_ROWS = 3;

interface VirtualIconRowsProps {
  items: readonly IconGridItem[];
  className: string;
}

function readGridMetrics(element: HTMLElement | null) {
  if (!element)
    return { minCardWidth: DEFAULT_MIN_CARD_WIDTH, gap: DEFAULT_GAP };

  const style = getComputedStyle(element);
  return {
    minCardWidth:
      parseFloat(style.getPropertyValue("--icon-card-min-width")) ||
      DEFAULT_MIN_CARD_WIDTH,
    gap: parseFloat(style.getPropertyValue("--icon-grid-gap")) || DEFAULT_GAP,
  };
}

export function VirtualIconRows({ items, className }: VirtualIconRowsProps) {
  const [containerRef, { width, offsetTop }] =
    useElementLayout<HTMLDivElement>();

  const { minCardWidth, gap } = useMemo(
    () => readGridMetrics(containerRef.current),
    [width],
  );

  const columns = Math.max(1, Math.floor((width + gap) / (minCardWidth + gap)));

  const rows = useMemo(() => {
    const result: IconGridItem[][] = [];
    for (let i = 0; i < items.length; i += columns)
      result.push(items.slice(i, i + columns));
    return result;
  }, [items, columns]);

  const virtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: OVERSCAN_ROWS,
    scrollMargin: offsetTop,
  });

  return (
    <div
      ref={containerRef}
      role="list"
      className={`icon-grid-virtual ${className}`}
      style={{ height: virtualizer.getTotalSize() }}
    >
      {virtualizer.getVirtualItems().map((virtualRow) => (
        <div
          key={virtualRow.key}
          ref={virtualizer.measureElement}
          data-index={virtualRow.index}
          role="presentation"
          className="icon-grid-virtual__row"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            transform: `translateY(${virtualRow.start - virtualizer.options.scrollMargin}px)`,
          }}
        >
          {rows[virtualRow.index].map((item) => (
            <IconCard key={item.id} item={item} />
          ))}
        </div>
      ))}
    </div>
  );
}
