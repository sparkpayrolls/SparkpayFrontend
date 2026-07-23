import { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Reveals an element once it scrolls into view. Returns a ref to attach and a
 * boolean that flips to true on first intersection. Falls back to visible
 * immediately when reduced motion is requested or IntersectionObserver is
 * unavailable, so content is never trapped behind an animation.
 */
export const useRevealOnScroll = <T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit,
) => {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return undefined;
    }

    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      });
    }, options ?? { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    observer.observe(node);

    return () => observer.disconnect();
  }, [options]);

  return { ref, revealed };
};
