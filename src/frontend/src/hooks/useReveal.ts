import { useEffect, useRef, useState } from "react";

/**
 * Bidirectional scroll-reveal hook using IntersectionObserver.
 * Returns a ref to attach to an element and a `visible` boolean.
 *
 * When bidirectional=true (default):
 *   - Scrolling down into view → visible=true
 *   - Scrolling out of view (up) → visible=false, re-entering → visible=true again
 *
 * When bidirectional=false:
 *   - Once visible, stays visible (one-shot, original behavior).
 */
export function useReveal(
  threshold = 0.15,
  rootMargin = "0px 0px -50px 0px",
  bidirectional = false,
) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (!bidirectional) observer.disconnect();
        } else if (bidirectional) {
          setVisible(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, bidirectional]);

  return { ref, visible };
}

/**
 * Bidirectional scroll-reveal that animates elements in when scrolling
 * down and out when scrolling up past them.
 * Adds/removes CSS classes: 'reveal-up', 'visible', 'hidden-up'
 */
export function useScrollReveal(rootMargin = "0px 0px -60px 0px") {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let lastRatio = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;
        const isEntering = ratio > lastRatio;
        lastRatio = ratio;

        if (entry.isIntersecting) {
          el.classList.remove("hidden-up", "hidden-down");
          el.classList.add("visible");
        } else if (!isEntering) {
          // Scrolled past (going down, element exited top)
          el.classList.remove("visible", "hidden-down");
          el.classList.add("hidden-up");
        } else {
          // Not yet reached (going up, element exited bottom)
          el.classList.remove("visible", "hidden-up");
          el.classList.add("hidden-down");
        }
      },
      { threshold: [0, 0.1, 0.2], rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref };
}
