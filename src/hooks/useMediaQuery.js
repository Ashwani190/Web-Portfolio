import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive breakpoint detection
 * @param {string} query - CSS media query string (e.g., '(min-width: 768px)')
 * @returns {boolean} - Whether the media query matches
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (event) => setMatches(event.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

// Convenience hooks for common breakpoints
export const useIsMobile = () => !useMediaQuery('(min-width: 768px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px)') && !useMediaQuery('(min-width: 1024px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
