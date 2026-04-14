import { useEffect, useRef, useState } from "react";

/**
 * Shared scroll-reveal hook using IntersectionObserver.
 * Returns a ref to attach to an element and a `visible` boolean.
 * Once visible, it stays visible (disconnect after trigger).
 */
export function useReveal(threshold = 0.15, rootMargin = "0px 0px -50px 0px") {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, visible };
}
