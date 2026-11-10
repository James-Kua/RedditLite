import { Children, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

interface MasonryProps {
  columns: number;
  children: ReactNode;
}

interface MasonryLayout {
  height: number;
  positions: { top: number; left: number }[];
}

export default function Masonry({ columns, children }: MasonryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<MasonryLayout>({ height: 0, positions: [] });
  const hasMultipleColumns = columns > 1;

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || columns === 1) return;

    const cards = Array.from(container.children);
    const updateLayout = () => {
      const gap = parseFloat(getComputedStyle(container).rowGap);
      const columnEnds = Array<number>(columns).fill(0);

      // Keep cards in feed order and fill the shortest column first.
      const positions = cards.map((card) => {
        const { width, height } = card.getBoundingClientRect();
        const top = Math.min(...columnEnds);
        const column = columnEnds.indexOf(top);
        columnEnds[column] = top + height + gap;
        return { top, left: column * (width + gap) };
      });

      setLayout({ height: Math.max(0, Math.max(...columnEnds) - gap), positions });
    };

    updateLayout();

    // Media and embeds can change a card's height after the initial render.
    const observer = new ResizeObserver(updateLayout);
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [columns, children]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col gap-(--masonry-gap) [--masonry-gap:--spacing(4)]"
      style={{ "--masonry-columns": columns, height: hasMultipleColumns ? layout.height : undefined } as CSSProperties}
    >
      {Children.map(children, (card, index) => (
        <div
          className={hasMultipleColumns
            ? "absolute w-[calc((100%+var(--masonry-gap))/var(--masonry-columns)-var(--masonry-gap))]"
            : undefined}
          style={hasMultipleColumns ? layout.positions[index] : undefined}
        >
          {card}
        </div>
      ))}
    </div>
  );
}
