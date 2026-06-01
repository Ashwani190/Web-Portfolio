import { useAnimation } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';

/**
 * Custom hook for scroll-triggered animations
 * Returns ref to attach to element and animation controls
 */
export const useScrollAnimation = (options = {}) => {
  const { threshold = 0.3, once = true } = options;
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('animate');
    }
  }, [isInView, controls]);

  return { ref, controls, isInView };
};

// Reusable animation variants
export const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -40 },
  animate: { opacity: 1, y: 0 },
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
};

export const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export const defaultTransition = {
  duration: 0.6,
  ease: [0.22, 1, 0.36, 1],
};
