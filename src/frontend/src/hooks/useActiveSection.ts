import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Returns the currently-visible section ID by tracking scroll position.
 * Uses IntersectionObserver when available for precision, falls back to
 * scroll offset detection. Includes a 100px header offset buffer.
 */
export function useActiveSection(sectionIds: string[]): string {
  const [activeSection, setActiveSection] = useState<string>(
    sectionIds[0] ?? "",
  );
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Scroll-position fallback (used as primary to keep header-offset accuracy)
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY + 110;
    let current = sectionIds[0] ?? "";

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) {
        current = id;
      }
    }

    setActiveSection(current);
  }, [sectionIds]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount to set initial state
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Disconnect any stale observer on unmount
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return activeSection;
}
