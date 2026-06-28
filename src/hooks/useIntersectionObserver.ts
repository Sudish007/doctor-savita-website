"use client";

import { useState, useEffect, useRef, type RefObject } from "react";

/**
 * Custom hook that uses Intersection Observer to detect when an element
 * enters the viewport. Useful for triggering animations on scroll.
 *
 * @param options - IntersectionObserver options
 * @param options.threshold - Visibility threshold (0-1). Default: 0.2
 * @param options.rootMargin - Root margin string. Default: "0px"
 * @param options.once - If true, stops observing after first intersection. Default: true
 * @returns [ref, isInView] - Ref to attach to the target element, and boolean indicating visibility
 */
interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
): [RefObject<T | null>, boolean] {
  const { threshold = 0.2, rootMargin = "0px", once = true } = options;
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If already triggered and once is true, skip
    if (once && isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (once) {
              observer.unobserve(element);
            }
          } else if (!once) {
            setIsInView(false);
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, once, isInView]);

  return [ref, isInView];
}
