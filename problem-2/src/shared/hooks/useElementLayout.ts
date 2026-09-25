import { useLayoutEffect, useRef, useState } from "react";

export interface ElementLayout {
  width: number;
  offsetTop: number;
}

export function useElementLayout<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [layout, setLayout] = useState<ElementLayout>({
    width: 0,
    offsetTop: 0,
  });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => {
      const rect = element.getBoundingClientRect();
      const next = { width: rect.width, offsetTop: rect.top + window.scrollY };
      setLayout((prev) =>
        prev.width === next.width && prev.offsetTop === next.offsetTop
          ? prev
          : next,
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return [ref, layout] as const;
}
