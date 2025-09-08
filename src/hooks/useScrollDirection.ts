import { useState, useEffect } from 'react';

/**
 * A custom hook to determine the scroll direction ('up' or 'down').
 * @returns The current scroll direction.
 */
export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    const threshold = 10; // Minimum scroll distance to trigger a direction change

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        return; // Exit if scroll is less than threshold
      }

      // Determine direction
      setScrollDirection(scrollY > lastScrollY ? 'down' : 'up');
      
      // Update last scroll position
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener('scroll', updateScrollDirection, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateScrollDirection);
    };
  }, []);

  return scrollDirection;
}
